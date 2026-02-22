# Contributing to ocgui

Thank you for your interest in contributing to ocgui! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

- **OpenCode CLI** >= 1.0.0 - [Install](https://opencode.ai/download)
- **Node.js** >= 18
- **Rust** >= 1.70 (for Tauri builds)
- **Git**

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/ocgui.git
cd ocgui

# Add upstream remote
git remote add upstream https://github.com/sulhi-sabil/ocgui.git
```

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run verification checks
npm run lint && npm run typecheck && npm run test
```

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the issue templates in `.github/` if available
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)

### Suggesting Features

1. Open a discussion or issue describing the feature
2. Explain the use case and expected benefit
3. Reference the [blueprint.md](./blueprint.md) if relevant

### Submitting Code

1. Create a feature branch from `main`
2. Make focused, atomic changes
3. Add/update tests for new functionality
4. Ensure all checks pass
5. Submit a pull request

## Development Workflow

### Branch Naming

- `feature/your-feature` - New features
- `fix/issue-description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run tauri:dev` | Start Tauri in development mode |
| `npm run tauri:build` | Build Tauri application |

## Coding Standards

Please read [AGENTS.md](./AGENTS.md) for detailed coding conventions including:

- TypeScript strict mode requirements
- Path aliases usage
- React component patterns
- State management with Zustand
- Tailwind CSS styling
- Testing patterns

### Quick Reference

- Use functional components with hooks
- Use path aliases (`@components/*`, `@utils/*`, etc.)
- Support both light and dark themes
- Write tests for new components
- Keep components accessible (ARIA, keyboard navigation)

## Commit Guidelines

### Commit Message Format

```
<type>: <description>

[optional body]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: add agent search functionality
fix: resolve theme toggle persistence issue
docs: update README installation steps
refactor: extract button styles to constants
```

## Pull Request Process

1. **Before Submitting**
   - Run `npm run lint && npm run typecheck && npm run test`
   - Update documentation if needed
   - Add tests for new functionality

2. **PR Requirements**
   - Fill out the PR template completely
   - Link related issues
   - Request review from maintainers

3. **Review Process**
   - Address review feedback
   - Keep PRs focused (avoid scope creep)
   - Maintain a clean commit history

4. **After Approval**
   - Squash commits if requested
   - PR will be merged by maintainers

## Questions?

- Open a [GitHub Discussion](https://github.com/sulhi-sabil/ocgui/discussions) for questions
- Check existing documentation in the `docs/` folder

---

Thank you for contributing to ocgui!
