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

## Decision Log

- **D-1:** Built with Tauri + React instead of Electron for smaller bundle size and lower memory usage.
- **D-2:** SQLite used as the primary local data store instead of plain JSON files to support full-text search.
- **D-3:** No AI features (summarization, auto-tagging) in v0.1 or v0.2. Focus exclusively on the local-first core loop.
- **D-8:** Shipped v0.1 as a purely local, single-blob SQLite implementation. Deferred the CR-SQLite normalization and React Native mobile companion to v0.2 to avoid delaying the core product launch.
### 1. Inbox triage flow
* **Goal:** Quick captures land but have no path to becoming real notes. Users need a way to promote inbox items — assign a title, move to notes, or discard. Without this the inbox fills up and becomes noise.

### 2. Note linking ([[wiki-style]])
* **Goal:** The single feature that turns a notes app into a thinking tool. One TipTap extension, one regex, massive retention impact. Developers specifically will use this heavily.

### 3. Tags + filter sidebar
* **Goal:** Search gets you to a known note. Tags get you to a topic you're exploring. These are different mental modes — both matter for daily use.

### 4. Sync across devices
* **Goal:** Local-first is the trust foundation, but developers work on multiple machines. The right approach here is end-to-end encrypted sync — not a cloud database you own their data. CR-SQLite (CRDTs over SQLite) is the path that preserves the local-first guarantee.

### 5. Mobile companion (iOS/Android)
* **Goal:** Quick capture on desktop is powerful. Quick capture from a phone is where the habit actually forms — shower thoughts, meeting observations, reading highlights. Tauri doesn't do mobile; this means a React Native companion that syncs to the same SQLite store.

### 6. AI Integration
* **Goal:** Keep `@tiptap-pro/extension-ai` on ice until the core loop is perfect. Once ready, use it for contextual summarization or auto-tagging, not just generative text.
