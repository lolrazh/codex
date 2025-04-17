<h1 align="center">OpenAI Codex CLI (Open Responses Fork)</h1>
<p align="center">A fork of <a href="https://github.com/openai/codex">openai/codex</a> integrated with <a href="https://docs.julep.ai/responses/quickstart">Julep's Open Responses API</a></p>

---

## Overview

This repository is a fork of the original [openai/codex](https://github.com/openai/codex) CLI tool. The primary change in this fork is the migration from the original OpenAI API dependency (noted in the original repo readme referencing deprecation around March 2025) to using [Julep's Open Responses API](https://docs.julep.ai/responses/quickstart). This allows the CLI to interact with a wider range of language models from various providers.

For the original documentation, features, and goals of the Codex CLI project, please refer to the [upstream repository](https://github.com/openai/codex). This README focuses specifically on the setup and usage changes related to the Open Responses integration.

## Getting Started

### Prerequisites

- **Node.js:** Version 22 or newer (as required by the original `codex-cli`).
- **Python:** Required for the Open Responses CLI.
- **API Keys:** You'll need API keys for the language model providers you intend to use (e.g., OpenAI, Anthropic, Groq).

### Setup

1.  **Install Open Responses CLI:**
    Follow the instructions at the [Open Responses Quickstart](https://docs.julep.ai/responses/quickstart#cli-installation) to install the CLI tool. Typically:
    ```bash
    pip install open-responses
    ```

2.  **Configure API Keys:**
    Set the necessary API keys as environment variables for the providers you want to use. The Open Responses server will pick these up. Refer to the Open Responses documentation for the specific environment variable names (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).
    ```bash
    # Example for bash/zsh
    export OPENAI_API_KEY="your-openai-key"
    export ANTHROPIC_API_KEY="your-anthropic-key"
    # Add others as needed
    ```

3.  **Run the Open Responses Server:**
    Start the local Open Responses server. It acts as a proxy to the different model providers.
    ```bash
    open-responses server
    ```
    Keep this server running in a separate terminal.

4.  **Clone and Build this Fork:**
    Clone this repository and build the `codex-cli` package:
    ```bash
    git clone <your-fork-repo-url>
    cd <your-fork-repo-name>/codex-cli
    npm install
    npm run build
    ```

5.  **Run the CLI:**
    Execute the CLI using `node`, specifying the model via the `-m` flag using the `<provider>/<model>` format recognized by your Open Responses server.
    ```bash
    # Example using an OpenAI model via Open Responses
    node dist/cli.js -m openai/gpt-4o "Explain this codebase to me"

    # Example using an Anthropic model via Open Responses
    node dist/cli.js -m anthropic/claude-3-opus-20240229 "Refactor this function"
    ```

    The `codex` command should now interact with the model specified through your local Open Responses server.

---

## Contributing

Contributions to the core functionality should ideally be directed to the [upstream openai/codex repository](https://github.com/openai/codex). Issues or pull requests specific to the Open Responses integration in this fork can be opened here.

---

## License

This fork retains the original [Apache-2.0 License](LICENSE) from the upstream repository.
