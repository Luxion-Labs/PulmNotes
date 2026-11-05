# Pulm Notes

> Local-first, privacy-focused research and personal note-taking desktop and web app.

![Pulm Notes Banner](assets/images/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/Desktop_Shell-Tauri_2.0-FFC131?style=for-the-badge&logo=tauri&logoColor=white" alt="Tauri">
  &nbsp;
  <img src="https://img.shields.io/badge/Language-Rust-DEA584?style=for-the-badge&logo=rust&logoColor=white" alt="Rust">
  &nbsp;
  <img src="https://img.shields.io/badge/Frontend-Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  &nbsp;
  <img src="https://img.shields.io/badge/UI-React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  &nbsp;
  <img src="https://img.shields.io/badge/Package_Manager-Bun-FBF0DF?style=for-the-badge&logo=bun&logoColor=black" alt="Bun">
  &nbsp;
  <img src="https://img.shields.io/badge/SLA-24_Hours-14B8A6?style=for-the-badge" alt="SLA">
</p>

<p align="center">
  <a href="https://pulm.luxionlabs.com"><img src="https://img.shields.io/badge/Live_Demo-Try_Pulm-F59E0B?style=flat-square" alt="Live App"></a>
  &nbsp;
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License"></a>
  &nbsp;
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/Contributions-Welcome-blueviolet?style=flat-square" alt="Contributing"></a>
</p>

---

## Quick Start & Getting Started

Getting Pulm Notes running locally takes only two steps:

```bash
git clone https://github.com/Luxion-Labs/PulmNotes.git
cd PulmNotes
bun install && bun run dev
```

For native desktop build:
```bash
bun run tauri:dev
```

---

## Prerequisites

- Node.js 18+ (or bun 1.0+)
- bun package manager
- **For desktop app:** Rust toolchain (see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

## Installation & Setup

1. Install dependencies using bun:
   ```bash
   bun install
   ```

2. **Web App:** Start the development server:
   ```bash
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

3. **Desktop App:** Run the Tauri development build:
   ```bash
   bun run tauri:dev
   ```

## Build for Production

**Web App:**
```bash
bun run build
bun start
```

**Desktop App:**
```bash
bun run tauri:build
```
Installers will be created in `src-tauri/target/release/bundle/`

## Technology

- **Framework**: Next.js 15 (App Router)
- **Desktop Shell**: Tauri 2.0 (Rust)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Package Manager**: bun

## Features

- **Local-first**: All data stays on your device
- **Offline-capable**: Works without internet
- **Private**: No cloud, no tracking, no accounts
- Minimalist text editor interface
- Slash command menu (type `/` to open)
- Support for multiple block types (headings, lists, code, quotes, etc.)
- Keyboard shortcuts for navigation and editing
- Clean, responsive design
- **Desktop app**: Native performance with Tauri

## Migration Notes

- **Next.js Migration**: See `docs/NEXT_MIGRATION_LOG.md`
- **Tauri Integration**: See `TAURI_AUDIT_LOG.md` for desktop architecture details

## Manual Release Process

1. Ensure commits follow Conventional Commits.
2. When ready to release, run:
```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```
3. GitHub Actions will run CI, semantic-release, generate `CHANGELOG`, update `package.json` version, create the GitHub Release, attach Tauri artifacts, and generate checksums.


---

## Maintainer Response SLA
Luxion Labs enforces a strict 24-hour response SLA on all community issues, feature proposals, and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for full development guidelines.

## License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.
