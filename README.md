# OpenCode GUI (ocgui)

[![Tauri](https://img.shields.io/badge/Tauri-v2-blue?logo=tauri)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Early_Development-orange)](./docs/task.md)

> A native desktop application that transforms OpenCode CLI into a visually orchestrated control plane.

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

- **Agent Management** - Visual agent registry with enable/disable toggles
- **Skill Composer** - Drag-and-drop skill composition interface
- **Configuration Editor** - Schema-driven forms for opencode.json
- **Execution Console** - Real-time CLI output streaming
- **Run History** - Structured logs with diff/replay capabilities

## Tech Stack

- **Frontend**: React + TypeScript + Radix UI
- **Desktop Framework**: Tauri v2 (Rust)
- **State Management**: Zustand
- **Code Editor**: Monaco Editor

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

- [Blueprint](./blueprint.md) - Complete project specification
- [Changelog](./CHANGELOG.md) - Version history and changes
- [Tasks](./docs/task.md) - Active development tasks
- [Bugs](./docs/bug.md) - Known issues tracker
- [Security Policy](./.github/SECURITY.md) - Security guidelines and reporting

## Troubleshooting

### Common Issues

**OpenCode CLI not found**
- Ensure OpenCode CLI is installed and in your PATH
- Run `opencode --version` to verify installation
- Download from [opencode.ai/download](https://opencode.ai/download)

**Tauri build fails**
- Verify Rust version: `rustc --version` (requires >= 1.70)
- Run `rustup update` to update Rust toolchain
- Check Tauri prerequisites for your platform: [tauri.app/start/prerequisites](https://tauri.app/start/prerequisites/)

**Development server won't start**
- Delete `node_modules` and run `npm install` fresh
- Check Node.js version: `node --version` (requires >= 18)

**Tests fail unexpectedly**
- Run `npm run lint && npm run typecheck` first
- Check for TypeScript errors that may cause test failures

### Getting Help

- Check [Issues](https://github.com/sulhi-sabil/ocgui/issues) for known problems
- Review [AGENTS.md](./AGENTS.md) for development guidelines
- Report bugs via [GitHub Issues](https://github.com/sulhi-sabil/ocgui/issues/new)

## Contributing

Contributions welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please read the [Blueprint](./blueprint.md) to understand project direction before submitting PRs.

## License

MIT License - see LICENSE file for details.