# OpenCode GUI (ocgui)

> A native desktop application that transforms OpenCode CLI into a visually orchestrated control plane.

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

## Documentation

- [Blueprint](./blueprint.md) - Complete project specification
- [Tasks](./docs/task.md) - Active development tasks
- [Bugs](./docs/bug.md) - Known issues tracker

## Contributing

Contributions welcome! Please read our workflow documentation before submitting PRs.

## License

MIT License - see LICENSE file for details.