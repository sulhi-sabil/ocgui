---
name: react-testing-vitest
description: Best practices for testing React components with Vitest and React Testing Library
license: MIT
compatibility: opencode
metadata:
  frameworks: react,vitest
  audience: frontend-developers
---

# React Testing with Vitest Skill

## When to Use
- Writing unit tests for React components
- Testing hooks and custom hooks
- Integration testing React features
- Setting up test infrastructure

## Test Structure

### File Organization
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx    # Tests next to source
├── hooks/
│   ├── useAgent.ts
│   └── useAgent.test.ts
└── test/
    ├── setup.ts           # Global test setup
    └── utils.tsx          # Test utilities
```

### Test Patterns

#### Component Testing
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

#### Hook Testing
```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

#### Zustand Store Testing
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useAppStore } from './useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ agents: [] })
  })

  it('adds an agent', () => {
    const agent = { id: '1', name: 'Test Agent' }
    
    act(() => {
      useAppStore.getState().addAgent(agent)
    })
    
    expect(useAppStore.getState().agents).toContainEqual(agent)
  })
})
```

## Test Configuration

### Vitest Config
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

## Testing Principles

### 1. Test User Behavior, Not Implementation
```typescript
// Bad: Testing implementation details
expect(component.state.isLoading).toBe(true)

// Good: Testing what user sees
expect(screen.getByRole('button')).toBeDisabled()
expect(screen.getByText('Loading...')).toBeInTheDocument()
```

### 2. Use Accessible Queries
```typescript
// Preferred order:
// 1. getByRole - most accessible
screen.getByRole('button', { name: /submit/i })

// 2. getByLabelText - for form inputs
screen.getByLabelText(/email/i)

// 3. getByPlaceholderText - fallback
screen.getByPlaceholderText(/enter email/i)

// 4. getByText - for non-interactive elements
screen.getByText(/welcome/i)

// Avoid: getByTestId (last resort)
```

### 3. Test Async Behavior
```typescript
import { waitFor, findBy } from '@testing-library/react'

it('loads data', async () => {
  render(<DataComponent />)
  
  // Option 1: findBy (combines waitFor + getBy)
  const data = await screen.findByText('Loaded data')
  expect(data).toBeInTheDocument()
  
  // Option 2: waitFor for assertions
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

## Mocking Strategies

### Mock Functions
```typescript
const mockFn = vi.fn()

// Set return value
mockFn.mockReturnValue('value')
mockFn.mockReturnValueOnce('first call')

// Set implementation
mockFn.mockImplementation((arg) => arg * 2)

// Check calls
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg')
expect(mockFn).toHaveBeenCalledTimes(2)
```

### Mock Modules
```typescript
vi.mock('@/utils/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'mocked' })
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: { id: '1' }, isLoggedIn: true }))
}))
```

### Mock Tauri APIs
```typescript
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue('result')
}))

// In test
import { invoke } from '@tauri-apps/api/core'

it('calls Tauri command', async () => {
  render(<Component />)
  await userEvent.click(screen.getByRole('button'))
  
  expect(invoke).toHaveBeenCalledWith('my_command', { arg: 'value' })
})
```

## Best Practices
- Keep tests focused and isolated
- Use descriptive test names
- Test edge cases and error states
- Clean up after each test
- Avoid testing library internals
- Use data-testid sparingly
- Write tests that fail for the right reasons
