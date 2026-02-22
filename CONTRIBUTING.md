# Contributing to ocgui

Thank you for your interest in contributing to ocgui! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Label System](#label-system)
- [Coding Standards](#coding-standards)

## Code of Conduct

Be respectful and constructive in all interactions. We welcome contributions from everyone.

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Rust (for Tauri backend)
- OpenCode CLI (for AI-assisted development)

### Setup

```bash
# Clone the repository
git clone https://github.com/sulhi-sabil/ocgui.git
cd ocgui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Verification

Before submitting changes, ensure all checks pass:

```bash
npm run lint && npm run typecheck && npm run test
```

## Development Workflow

1. **Create a branch** from `main` with a descriptive name:
   - `feature/your-feature-name` - for new features
   - `fix/your-bug-fix` - for bug fixes
   - `docs/your-docs-change` - for documentation updates
   - `chore/your-chore` - for maintenance tasks

2. **Make your changes** following the coding standards in [AGENTS.md](./AGENTS.md)

3. **Write/update tests** for your changes

4. **Run verification** before committing

5. **Create a Pull Request**

## Pull Request Process

1. Ensure your PR has:
   - Clear title and description
   - Reference to related issues (if any)
   - Passing CI checks
   - Appropriate labels

2. PR template checklist must be completed

3. Wait for review from maintainers

4. Address review feedback

5. Maintainers will merge when approved

## Label System

### Category Labels

| Label | Description | Color |
|-------|-------------|-------|
| `bug` | Something isn't working | Red |
| `feature` | New feature or capability | Green |
| `enhancement` | Improvement to existing feature | Blue |
| `docs` | Documentation improvements | Blue |
| `refactor` | Code refactoring | Blue |
| `test` | Testing-related changes | Purple |
| `ci` | CI/CD pipeline changes | Blue |
| `chore` | Maintenance, dependencies | Yellow |
| `security` | Security-related changes | Red |

### Priority Labels

| Label | Description | Response Time |
|-------|-------------|---------------|
| `P0` | Critical - fix immediately | < 24 hours |
| `P1` | High - fix soon | < 1 week |
| `P2` | Medium priority | < 2 weeks |
| `P3` | Low priority | Backlog |

### Role-Based Labels

Specialized labels for AI agent contributions:
- `repository manager` - Repository management improvements
- `devops-engineer` - DevOps engineering tasks
- `security-engineer` - Security-related changes
- `performance-engineer` - Performance optimization
- `technical-writer` - Documentation and technical writing improvements

## Coding Standards

### TypeScript

- Strict mode enabled
- Explicit return types for exported functions
- Prefer interfaces for object shapes
- Use path aliases: `@components/*`, `@hooks/*`, etc.

### React

- Functional components with hooks
- Named exports
- Use `forwardRef` when needed
- Support dark mode with `dark:` variants

### Testing

- Vitest + React Testing Library
- Test files next to source: `*.test.ts(x)`
- Test user interactions, not implementation

### Git Commits

- Use conventional commit format:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `docs: update documentation`
  - `refactor: improve code structure`
  - `test: add/update tests`
  - `chore: maintenance tasks`

## Questions?

- Open an issue with the `question` label
- Check existing documentation in `/docs`
- Review [AGENTS.md](./AGENTS.md) for detailed conventions
