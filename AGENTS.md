# AGENTS.md - Project Conventions & Guidelines

This document defines the coding conventions, architectural patterns, and development guidelines for ocgui. Following these conventions ensures consistency across the codebase and smooth collaboration.

## Project Overview

**ocgui** is a native desktop GUI for OpenCode CLI, built with Tauri v2 and React. It provides visual orchestration for agents, skills, tools, and configurations.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop Framework**: Tauri v2 (Rust)
- **State Management**: Zustand with persist middleware
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with TypeScript plugin
- **Build Tool**: Vite

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Run type checking
npm run typecheck

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## Verification Requirements

Before submitting any changes, ensure all checks pass:

```bash
npm run lint && npm run typecheck && npm run test
```

## Code Conventions

### TypeScript

- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Use explicit return types for exported functions
- Prefer interfaces over types for object shapes
- Use `const` assertions for literal types

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

Available aliases:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@store/*` → `src/store/*`
- `@styles/*` → `src/styles/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`

### React Components

- Use functional components with hooks
- Export components as named exports
- Use `forwardRef` when component needs ref forwarding
- Lazy load heavy components (modals, editors)

```typescript
// Component pattern
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({ children, variant = 'primary', ... }: ButtonProps) {
  // Implementation
}
```

### State Management (Zustand)

- Store state in `src/store/index.ts`
- Use TypeScript interfaces for state shape
- Use `persist` middleware for persistence needs
- Actions should be named as verbs (`setAgents`, `addAgent`, `updateAgent`)

### Styling (Tailwind CSS)

- Use Tailwind utility classes directly in JSX
- Use `cn()` utility for conditional class merging
- Support dark mode with `dark:` variants
- Extract repeated styles to constants when needed

### Testing

- Place test files next to source files with `.test.ts(x)` extension
- Use `describe`/`it` blocks for organization
- Test user interactions, not implementation details
- Use `@testing-library/react` for component testing

```typescript
// Test pattern
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

## File Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components (Button, Input, etc.)
│   └── index.ts     # Barrel exports
├── hooks/           # Custom React hooks
├── store/           # Zustand store
├── styles/          # Style tokens and theme
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── test/            # Test setup and utilities
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Component Guidelines

### UI Components (`src/components/ui/`)

- Keep components pure and reusable
- Extend native HTML element props where applicable
- Support className prop for customization
- Include loading/error states when relevant
- Export both component and props interface

### Feature Components (`src/components/`)

- Can contain business logic
- Connect to store when needed
- Handle user interactions
- Compose UI components

## Key Patterns

### Lazy Loading

```typescript
const CreateAgentModal = lazy(() => import('@components/CreateAgentModal'))

// Usage with Suspense
<Suspense fallback={null}>
  <CreateAgentModal isOpen={isModalOpen} onClose={closeModal} />
</Suspense>
```

### Custom Hooks

```typescript
// Hook pattern for reusable logic
export function useAgentSearch(agents: Agent[], query: string) {
  return useMemo(() => {
    if (!query.trim()) return { filteredAgents: agents, hasResults: agents.length > 0 }
    // Filter logic
  }, [agents, query])
}
```

### Utility Functions

```typescript
// cn utility for class merging
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## PR Guidelines

1. Run all verification commands before pushing
2. Keep changes focused and atomic
3. Update tests for new functionality
4. Follow existing code patterns
5. Ensure dark mode compatibility

## Notes for AI Contributors

- Always verify changes with `npm run lint && npm run typecheck && npm run test`
- Follow existing patterns in the codebase
- Use path aliases for imports
- Support both light and dark themes
- Keep components accessible (proper ARIA attributes, keyboard navigation)
