# Pulm Notes - Next.js Version

This is a Next.js App Router version of the Pulm Notes.

## Prerequisites

- Node.js 18+ (or bun 1.0+)
- bun package manager

## Installation & Setup

1. Install dependencies using bun:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
bun run build
bun start
```

## Technology

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Package Manager**: bun

## Features

- Minimalist text editor interface
- Slash command menu (type `/` to open)
- Support for multiple block types (headings, lists, code, quotes, etc.)
- Keyboard shortcuts for navigation and editing
- Clean, responsive design

## Migration Notes

This project was migrated from Vite to Next.js. See `docs/NEXT_MIGRATION_LOG.md` for detailed migration information.
