import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ToastProvider, ToastContext } from './ToastProvider'
import type { ToastContextType } from './ToastProvider'

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render children', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Child Content</div>
      </ToastProvider>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should provide toast context', () => {
    let contextValue: ToastContextType | undefined
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value ?? undefined
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    expect(contextValue).toBeDefined()
    expect(contextValue!.toasts).toEqual([])
    expect(typeof contextValue!.addToast).toBe('function')
    expect(typeof contextValue!.removeToast).toBe('function')
  })

  it('should add a toast', () => {
    let contextValue: ToastContextType | undefined
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value ?? undefined
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
  })

  it('should default to info type', () => {
    let contextValue: ToastContextType | undefined
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value ?? undefined
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

  it('should generate unique ids for toasts', () => {
    let contextValue: ToastContextType | undefined
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value ?? undefined
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Message 1')
      contextValue!.addToast('Message 2')
    })
    
    expect(contextValue!.toasts).toHaveLength(2)
    expect(contextValue!.toasts[0].id).not.toBe(contextValue!.toasts[1].id)
  })

  it('should remove a toast', () => {
    let contextValue: ToastContextType | undefined
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value ?? undefined
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Test message')
    })
    
    expect(contextValue!.toasts).toHaveLength(1)
    
    const toastId = contextValue!.toasts[0].id
    
    act(() => {
      contextValue!.removeToast(toastId)
    })
    
    expect(contextValue!.toasts).toHaveLength(0)
  })

  it('should auto-remove toast after 5 seconds', () => {
    let contextValue: ToastContextType | undefined
    
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(value) => {
            contextValue = value ?? undefined
            return null
          }}
        </ToastContext.Consumer>
      </ToastProvider>
    )
    
    act(() => {
      contextValue!.addToast('Test message')
    })
    
    expect(contextValue!.toasts).toHaveLength(1)
    
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    expect(contextValue!.toasts).toHaveLength(0)
  })
})
