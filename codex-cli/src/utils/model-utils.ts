import { OPENAI_API_KEY, JULEP_BASE_URL, RESPONSES_API_KEY } from "./config";
import OpenAI from "openai";

const MODEL_LIST_TIMEOUT_MS = 2_000; // 2 seconds
export const RECOMMENDED_MODELS: Array<string> = ["o4-mini", "o3"];

/**
 * Background model loader / cache.
 *
 * We start fetching the list of available models from OpenAI once the CLI
 * enters interactive mode.  The request is made exactly once during the
 * lifetime of the process and the results are cached for subsequent calls.
 */

let modelsPromise: Promise<Array<string>> | null = null;

async function fetchModels(): Promise<Array<string>> {
  // If the user has not configured an API key we cannot hit the network.
  if (!RESPONSES_API_KEY) {
    return RECOMMENDED_MODELS;
  }

  try {
    const openai = new OpenAI({ 
      apiKey: RESPONSES_API_KEY,
      baseURL: JULEP_BASE_URL
    });
    
    try {
      const list = await openai.models.list();
      const models: Array<string> = [];
      for await (const model of list as AsyncIterable<{ id?: string }>) {
        if (model && typeof model.id === "string") {
          models.push(model.id);
        }
      }
      return models.sort();
    } catch (modelError) {
      // If the /models endpoint fails (404) on Julep, return [] instead of recommended.
      console.log(
        "Note: Could not fetch models from Julep server, proceeding without client-side list.",
      );
      return []; // Return empty list for Julep failure
    }
  } catch (error) {
    // General error (e.g., network issues before trying /models)
    return [];
  }
}

export function preloadModels(): void {
  if (!modelsPromise) {
    // Fire‑and‑forget – callers that truly need the list should `await`
    // `getAvailableModels()` instead.
    void getAvailableModels();
  }
}

export async function getAvailableModels(): Promise<Array<string>> {
  if (!modelsPromise) {
    modelsPromise = fetchModels();
  }
  return modelsPromise;
}

/**
 * Verify that the provided model identifier is present in the set returned by
 * {@link getAvailableModels}. The list of models is fetched from the OpenAI
 * `/models` endpoint the first time it is required and then cached in‑process.
 */
export async function isModelSupportedForResponses(
  model: string | undefined | null,
  julepBaseUrl?: string | null,
): Promise<boolean> {
  // If Julep is configured (passed explicitly), skip client-side validation.
  if (julepBaseUrl) {
    return true;
  }

  // If Julep is configured (globally), skip client-side validation and let the server handle it.
  if (JULEP_BASE_URL) {
    return true;
  }

  if (
    typeof model !== "string" ||
    model.trim() === "" ||
    RECOMMENDED_MODELS.includes(model)
  ) {
    return true;
  }

  try {
    const models = await Promise.race<Array<string>>([
      getAvailableModels(),
      new Promise<Array<string>>((resolve) =>
        setTimeout(() => resolve([]), MODEL_LIST_TIMEOUT_MS),
      ),
    ]);

    // If the timeout fired we get an empty list → treat as supported to avoid
    // false negatives.
    if (models.length === 0) {
      return true;
    }

    return models.includes(model.trim());
  } catch {
    // Network or library failure → don't block start‑up.
    return true;
  }
}
