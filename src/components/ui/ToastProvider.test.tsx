import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ToastProvider, ToastContext } from './ToastProvider'

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders children', () => {
    render(
      <ToastProvider>
        <div>Child content</div>
      </ToastProvider>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('provides empty toasts array initially', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    expect(contextValue).not.toBeNull()
    expect(contextValue!.toasts).toEqual([])
  })

  it('addToast adds a toast to the list', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Test message', 'success')
    })
    
    expect(contextValue!.toasts).toHaveLength(1)
    expect(contextValue!.toasts[0].message).toBe('Test message')
    expect(contextValue!.toasts[0].type).toBe('success')
    expect(contextValue!.toasts[0].id).toBeDefined()
  })

  it('addToast defaults to info type', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Test message')
    })
    
    expect(contextValue!.toasts[0].type).toBe('info')
  })

  it('removeToast removes a toast from the list', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Test message')
    })
    
    const toastId = contextValue!.toasts[0].id
    
    act(() => {
      contextValue!.removeToast(toastId)
    })
    
    expect(contextValue!.toasts).toHaveLength(0)
  })

  it('auto-removes toast after 5 seconds', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Auto remove test')
    })
    
    expect(contextValue!.toasts).toHaveLength(1)
    
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    expect(contextValue!.toasts).toHaveLength(0)
  })

  it('supports multiple toasts', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('First', 'success')
      contextValue!.addToast('Second', 'error')
      contextValue!.addToast('Third', 'warning')
    })
    
    expect(contextValue!.toasts).toHaveLength(3)
    expect(contextValue!.toasts.map(t => t.message)).toEqual(['First', 'Second', 'Third'])
  })

  it('enforces MAX_VISIBLE limit (5 toasts)', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Toast 1')
      contextValue!.addToast('Toast 2')
      contextValue!.addToast('Toast 3')
      contextValue!.addToast('Toast 4')
      contextValue!.addToast('Toast 5')
      contextValue!.addToast('Toast 6')
      contextValue!.addToast('Toast 7')
    })
    
    expect(contextValue!.toasts).toHaveLength(5)
    expect(contextValue!.toasts.map(t => t.message)).toEqual([
      'Toast 3', 'Toast 4', 'Toast 5', 'Toast 6', 'Toast 7'
    ])
  })

  it('clears timeout when removing overflow toasts', () => {
    let contextValue: typeof ToastContext extends React.Context<infer T> ? T : never = null
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      for (let i = 1; i <= 7; i++) {
        contextValue!.addToast(`Toast ${i}`)
      }
    })
    
    expect(contextValue!.toasts).toHaveLength(5)
    
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    expect(contextValue!.toasts).toHaveLength(0)
  })
})
