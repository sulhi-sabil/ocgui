# Contributing to ocgui

Thank you for your interest in contributing to ocgui! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Be respectful and inclusive. We welcome contributions from everyone regardless of experience level, background, or identity.

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 9.0.0
- **Rust** >= 1.70 (for Tauri builds)
- **OpenCode CLI** >= 1.0.0 (for testing integration)

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ocgui.git
cd ocgui

# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, start Tauri (optional)
npm run tauri:dev
```

### Verify Setup

Run the validation suite to ensure everything works:

```bash
npm run validate
```

This runs linting, type checking, and tests.

## Project Structure

```
ocgui/
├── src/                    # React frontend
│   ├── components/         # React components
│   │   └── ui/            # Reusable UI primitives
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Helper functions
│   └── styles/            # CSS/Tailwind styles
├── src-tauri/              # Rust backend (Tauri)
│   └── src/               # Rust source code
├── .github/               # GitHub configuration
│   ├── workflows/         # CI/CD workflows
│   └── ISSUE_TEMPLATE/    # Issue templates
├── docs/                   # Documentation
├── .opencode/             # OpenCode configuration
├── AGENTS.md              # AI agent conventions
└── blueprint.md           # Project specification
```

## Coding Standards

### TypeScript

- Strict mode is enabled
- Use explicit return types for exported functions
- Prefer `interface` over `type` for object shapes
- Use `const` assertions for literal types

### React

- Use functional components with hooks
- Export components as named exports
- Use `forwardRef` when ref forwarding is needed
- Lazy load heavy components

### Styling

- Use Tailwind CSS utility classes
- Use the `cn()` utility for conditional class merging
- Support dark mode with `dark:` variants

### Testing

- Place test files next to source files (`.test.ts(x)`)
- Use Vitest + React Testing Library
- Test user interactions, not implementation details

### Path Aliases

Use path aliases for clean imports:

```typescript
// Preferred
import { useAppStore } from '@store/index'
import { Button } from '@components/ui/Button'
import { cn } from '@utils/cn'

// Avoid
import { useAppStore } from '../../store/index'
```

Available aliases: `@/*`, `@components/*`, `@hooks/*`, `@store/*`, `@types/*`, `@utils/*`, `@constants/*`, `@styles/*`

## Commit Guidelines

Use conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no code change)
- `refactor`: Code change without fix/feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```
feat(agents): add agent duplication feature
fix(store): resolve state persistence issue
docs(readme): update installation instructions
chore(deps): update dependencies
```

## Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Run validation** before committing:
   ```bash
   npm run validate
   ```

4. **Commit your changes** with a conventional commit message

5. **Push and create a PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out the PR template** completely

7. **Wait for review** - maintainers will review your PR

### PR Requirements

- All CI checks must pass
- No merge conflicts with `main`
- Code follows project conventions
- Tests added for new functionality
- Documentation updated if needed

## Reporting Issues

### Bug Reports

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

### Feature Requests

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml) and include:

- Clear description of the feature
- Use case and motivation
- Proposed solution (optional)

### Security Issues

**Do not open public issues for security vulnerabilities.**

Report security issues through GitHub's private vulnerability reporting:
- Go to [Security tab](https://github.com/sulhi-sabil/ocgui/security)
- Click "Report a vulnerability"

## Questions?

- Check existing [issues](https://github.com/sulhi-sabil/ocgui/issues)
- Review the [Blueprint](./blueprint.md) for project direction
- Consult [AGENTS.md](./AGENTS.md) for AI-assisted development conventions

Thank you for contributing! 🎉
