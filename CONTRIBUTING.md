# Contributing to Pulm Notes

Thank you for your interest in contributing to Pulm Notes! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Bun** package manager (recommended)
- **Rust toolchain** (for desktop app development) - [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)
- **Git** for version control

### Installation

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/Luxion-Labs/PulmNotes.git
   cd PulmNotes
   ```

3. Install dependencies:
   ```bash
   bun install
   ```

### Development Workflow

#### Web App Development

Start the Next.js development server:
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Desktop App Development

Run the Tauri development build:
```bash
bun run tauri:dev
```

### Building

#### Web App
```bash
bun run build
```

#### Desktop App
```bash
bun run tauri:build
```

## Development Guidelines

### Code Style

- **Language**: TypeScript (strict mode enabled)
- **Indentation**: 2 spaces
- **Line endings**: LF (Unix-style)
- **Formatting**: Follow existing code style
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes

### Linting and Type Checking

Before submitting code, ensure it passes all checks:

```bash
# Run linter
bun run lint

# Run type checker
bun run typecheck

# Run tests
bun run test
```

### Testing

- Write unit tests for new features using Vitest
- Place tests in `__tests__` directories next to the code they test
- Test file naming: `*.test.ts` or `*.test.tsx`
- Run tests: `bun run test`
- Run tests with UI: `bun run test:ui`

### Commit Messages

We follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(editor): add markdown export functionality

fix(storage): resolve data persistence issue on Windows

docs: update installation instructions
```

### Developer Certificate of Origin (DCO)

All commits must be signed off to indicate you agree to the DCO:

```bash
git commit -s -m "feat: add new feature"
```

Or add to your commit message:
```
Signed-off-by: Your Name <your.email@example.com>
```

## Branch Naming

Use descriptive branch names:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

**Examples:**
- `feature/markdown-export`
- `fix/storage-persistence`
- `docs/update-readme`

## Pull Request Process

1. **Create a branch** from `main` for your changes
2. **Make your changes** following the guidelines above
3. **Test thoroughly** on all relevant platforms (web/desktop)
4. **Run all checks**:
   ```bash
   bun run lint
   bun run typecheck
   bun run test
   bun run build
   ```
5. **Commit with DCO sign-off** (`git commit -s`)
6. **Push to your fork** and create a pull request
7. **Fill out the PR template** completely
8. **Respond to review feedback** promptly

### PR Requirements

- All CI checks must pass
- Code must be reviewed and approved
- No merge conflicts with `main`
- DCO sign-off on all commits
- Tests added for new features
- Documentation updated if needed

### Branch Protection (Recommended)

To keep `main` stable, configure these branch protection rules in GitHub:

- Required status checks:
  - `CI / Lint & Typecheck`
  - `CI / Unit Tests`
  - `CI / Build Web App`
  - `CI / Rust Clippy`
  - `CI / Build Tauri App`
  - `DCO Check / Developer Certificate of Origin`
- Required reviews: at least 1 approving review
- Restrict pushes: prevent force pushes and require pull requests

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:

- Platform (web/desktop) and OS
- Version number
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

## Requesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml) and include:

- Clear problem statement
- Proposed solution
- Use case description
- Target platform(s)

## Project Structure

```
PulmNotes/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── lib/               # Utility functions and stores
│   └── types.ts           # TypeScript type definitions
├── editor/                # Rich text editor components
│   ├── components/        # Tiptap editor components
│   └── hooks/             # Custom React hooks
├── src-tauri/             # Tauri (Rust) backend
│   ├── src/               # Rust source code
│   └── Cargo.toml         # Rust dependencies
├── e2e/                   # End-to-end tests (Playwright)
└── public/                # Static assets
```

## Technology Stack

- **Frontend**: React 19, Next.js 15 (App Router)
- **Desktop**: Tauri 2.0 (Rust)
- **Styling**: Tailwind CSS, SCSS
- **Editor**: Tiptap (ProseMirror)
- **Testing**: Vitest, Playwright
- **Package Manager**: Bun
- **Language**: TypeScript

## Questions?

- Open a [Discussion](https://github.com/Luxion-Labs/PulmNotes/discussions)
- Check existing [Issues](https://github.com/Luxion-Labs/PulmNotes/issues)
- Review the [README](README.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Pulm Notes! 🎉
