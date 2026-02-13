# Melius Engine

Melius Engine is an autonomous AI agent that continuously improves your repository. It runs as a GitHub Action, analyzing your code, applying UI-specific improvements based on events, and verifying the results.

## Features
- **Autonomous UI Improvements**: Automatically identifies and applies UI enhancements based on predefined events.
- **Event-Driven Theming**: Modifies UI themes (e.g., for holidays like Christmas or Diwali) based on `event.json` configuration.
- **Strict UI-Only Modification**: Ensures that only UI-related files (CSS, TSX components, etc.) are modified, preventing changes to build configurations or dependencies.
- **Session-Based Chat History**: Each AI run generates a new, numbered chat history file in the `/history` directory, ensuring clear context for each session.
- **System Reset**: Provides a mechanism to clean all logs, errors, to-dos, and history files, resetting the system to a clean state.
- **Redundant Read Prevention**: Implements a file caching mechanism to prevent the LLM from re-reading files already in context.
- **Verification Loop**: Verifies every change and attempts to fix errors.
- **Fallback System**: Uses OpenRouter with 5 API keys and multiple free models for high availability.
- **Logging & Tracking**: Maintains detailed logs in `/log`, `/to-do`, and `/error` folders.

## Setup
1.  **API Keys**: Add 5 OpenRouter API keys to your repository secrets as:
    - `OPENROUTER_API_KEY_1`
    - `OPENROUTER_API_KEY_2`
    - `OPENROUTER_API_KEY_3`
    - `OPENROUTER_API_KEY_4`
    - `OPENROUTER_API_KEY_5`
2.  **Permissions**: Ensure the GitHub Action has write permissions to the repository (Settings > Actions > General > Workflow permissions).
3.  **Models**: The engine uses free models from OpenRouter by default.
4.  **Event Configuration**: Create an `event.json` file in the repository root with the format `{"event": "your_event_name"}` (e.g., `{"event": "christmas"}`). If the event is `"no change"`, the system will reset all logs and history.

## How it Works

### High-Level Flowchart
```mermaid
graph TD
    A[GitHub Action Trigger] --> B{Read event.json}
    B --> C{Event is "no change"?}
    C -- Yes --> D[Reset System (Clear logs, history, etc.)]
    C -- No --> E[Scan Repository Files]
    E --> F[LLM Analysis & Planning (UI-focused)]
    F --> G{Files to Read?}
    G -- Yes --> H[Read Requested Files (Cached)]
    H --> I[LLM Generates UI Improvements]
    I --> J{Is File UI-related & Not Restricted?}
    J -- Yes --> K[Write File with New Content]
    J -- No --> L[Skip Modification (Log Reason)]
    K --> M[LLM Verification]
    M --> N{Verified?}
    N -- No --> O[Attempt Fix]
    O --> P{Fixed?}
    P -- No --> Q[Log Error/To-Do]
    N -- Yes --> R[Log Improvement]
    D --> S[End]
    L --> S
    Q --> S
    R --> S
```

### Detailed Steps
1.  **Trigger**: The GitHub Action triggers the Melius Engine.
2.  **Event Check**: The engine reads `event.json` from the repository root to determine the current event or theme request.
    -   If `event.json` specifies `"no change"`, the system performs a full reset: clearing all logs, errors, to-dos, and chat history, then exits.
3.  **File Scanning**: The agent scans all files in your repository, excluding internal engine directories, `.git`, and log/history folders.
4.  **LLM Analysis & Planning**: The LLM analyzes the project, existing to-dos, and errors. It generates a plan for UI improvements based on the `event.json` value. It can request specific files for more context.
    -   **Constraint Enforcement**: The LLM is strictly instructed to only suggest modifications to UI-related files (e.g., `.tsx`, `.css`, `.html`) and to avoid build/dependency files.
5.  **File Reading (with Cache)**: If the LLM requests to read files, the engine reads them. A caching mechanism prevents redundant reads of the same file within a session.
6.  **Execution of Improvements**: The LLM generates new content for files based on the improvement plan.
    -   **Write Protection**: Before writing, the engine verifies that the target file is UI-related and not on the restricted list (e.g., `vercel.json`, `package.json`). If it's a restricted file or not a UI file, the modification is skipped.
7.  **Verification**: Each change is verified by the LLM. If errors are detected, the system attempts one automatic fix.
8.  **Logging & Persistence**: All improvements are logged in the `/log` folder. Persistent errors are tracked in `/error`, and pending tasks in `/to-do`. Each AI run generates a new, numbered chat history file in `/history`.

## Directory Structure
-   `melius-engine/`: Core logic of the agent (`agent.py`, `llm_client.py`, `sole.py`).
-   `event.json`: Configuration file for event-driven UI theming.
-   `log/`: Numbered JSON logs of each improvement cycle.
-   `to-do/`: Pending tasks or improvements.
-   `error/`: Persistent errors that need manual attention or a retry.
-   `history/`: Numbered JSON files containing chat history with the LLM for each session.
-   `test-website/`: A multi-page test application (Home, About, Contact) for validating UI modifications.

---

