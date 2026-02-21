---
name: tauri-react-patterns
description: Best practices and patterns for Tauri v2 + React desktop application development
license: MIT
compatibility: opencode
metadata:
  frameworks: tauri,react
  audience: frontend-developers
---

# Tauri React Patterns Skill

## When to Use
- Building Tauri v2 desktop applications
- Implementing React components for desktop
- IPC communication between Rust and frontend
- State management with Zustand in Tauri

## Architecture Patterns

### Project Structure
```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI primitives
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── store/           # Zustand state management
├── types/           # TypeScript definitions
├── utils/           # Utility functions
└── invoke/          # Tauri command wrappers
```

### IPC Communication
```typescript
// Frontend: invoke Tauri commands
import { invoke } from '@tauri-apps/api/core';

async function saveFile(content: string): Promise<void> {
  await invoke('save_file', { content });
}

// Backend: Rust command
#[tauri::command]
fn save_file(content: String) -> Result<(), String> {
    // Implementation
    Ok(())
}
```

## State Management (Zustand)

### Store Pattern
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  agents: Agent[];
  addAgent: (agent: Agent) => void;
  removeAgent: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      agents: [],
      addAgent: (agent) => set((s) => ({ 
        agents: [...s.agents, agent] 
      })),
      removeAgent: (id) => set((s) => ({ 
        agents: s.agents.filter(a => a.id !== id) 
      })),
    }),
    { name: 'app-storage' }
  )
);
```

## Component Patterns

### UI Component with Variants
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  isLoading,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={cn(
        'rounded-md font-medium transition-colors',
        variants[variant],
        sizes[size]
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

## Security Best Practices

### CSP Configuration
```json
{
  "security": {
    "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  }
}
```

### Secure IPC
```rust
#[tauri::command]
async fn secure_operation(app: AppHandle) -> Result<(), String> {
    // Validate permissions
    // Sanitize inputs
    // Handle errors gracefully
    Ok(())
}
```

## Performance Tips
- Lazy load heavy components
- Use React.memo for expensive renders
- Debounce IPC calls
- Minimize re-renders with proper state structure
