# OpenCode GUI (ocgui)

[![Tauri](https://img.shields.io/badge/Tauri-v2-blue?logo=tauri)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

> A native desktop application that transforms OpenCode CLI into a visually orchestrated control plane.

**Status:** 🚧 Early Development

## Prerequisites

- **OpenCode CLI** >= 1.0.0 - [Install](https://opencode.ai/download)
- **Node.js** >= 18
- **Rust** >= 1.70 (for Tauri builds)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sulhi-sabil/ocgui.git
cd ocgui

# Install dependencies
npm install

# Start development
npm run dev
```

## What is ocgui?

**ocgui** provides a first-class orchestration interface for OpenCode CLI, eliminating cognitive overhead when managing:
- Multiple agents
- Skill compositions
- Tool permissions
- Plugin configurations

## Core Features

### Implemented
- **Agent Management** - Visual agent registry with create, edit, delete, duplicate, and enable/disable toggles
- **Theme Support** - Light and dark theme with persistent preference
- **Search** - Client-side agent search with keyboard shortcut (⌘K)
- **Toast Notifications** - User feedback for actions

### Planned
- **Skill Composer** - Drag-and-drop skill composition interface
- **Configuration Editor** - Schema-driven forms for opencode.json
- **Execution Console** - Real-time CLI output streaming
- **Run History** - Structured logs with diff/replay capabilities

## Tech Stack

- **Frontend**: React + TypeScript + Radix UI
- **Desktop Framework**: Tauri v2 (Rust)
- **State Management**: Zustand
- **Code Editor**: Monaco Editor (planned)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run tauri:dev` | Start Tauri in development mode |
| `npm run tauri:build` | Build Tauri application for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm test` | Run test suite |

## Documentation

- [Changelog](./CHANGELOG.md) - Version history and changes
- [Tasks](./docs/task.md) - Active development tasks
- [Bugs](./docs/bug.md) - Known issues tracker
- [AGENTS.md](./AGENTS.md) - Project conventions and guidelines

## Contributing

Contributions welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please read the [AGENTS.md](./AGENTS.md) to understand project conventions before submitting PRs.

## License

MIT License - see LICENSE file for details.
