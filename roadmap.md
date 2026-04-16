# Plum Notes Roadmap

**Status:** DRAFT
**Focus:** Speed, local-first reliability, and frictionless capture.

## Target Audience
**Developers and Creators.** People who need a blazing-fast, local-first scratchpad that doesn't get in their way.

## Next 3 Priorities (The Core Loop)

### 1. Frictionless Quick Capture (Tauri)
* **Goal:** Sub-100ms time to write. 
* **Implementation:** Register a global OS hotkey (e.g., `Cmd/Ctrl + Shift + Space`) that summons a floating Tauri window, ready to accept input immediately.
* **Why:** If capturing a thought takes too long, the thought is lost.

### 2. Bulletproof Local Storage (Tauri FS)
* **Goal:** Your data is yours, stored locally as markdown/json, and lightning fast.
* **Implementation:** Wire up `@tauri-apps/plugin-fs` to save/load TipTap documents directly to the local filesystem. 
* **Why:** Trust is paramount for a notes app. Local-first guarantees privacy and offline capability.

### 3. Command Palette & Fuzzy Search (Ariakit)
* **Goal:** Never use the mouse to find a note.
* **Implementation:** Use `@ariakit/react` to build a keyboard-first command palette (`Cmd/Ctrl + K`) for instantly switching between or searching within notes.
* **Why:** Retrieval must be as frictionless as capture.

## Backlog (Post-Core)
* **AI Integration:** Keep `@tiptap-pro/extension-ai` on ice until the core loop is perfect. Once ready, use it for contextual summarization or auto-tagging, not just generative text.
* **Collaboration/Sync:** Only after local-first is fully stabilized.
