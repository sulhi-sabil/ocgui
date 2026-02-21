import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useToast } from './useToast'
import { ToastProvider } from './ToastProvider'

describe('useToast', () => {
  it('returns context when used inside ToastProvider', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
    })
    
    expect(result.current).toBeDefined()
    expect(result.current.toasts).toEqual([])
    expect(typeof result.current.addToast).toBe('function')
    expect(typeof result.current.removeToast).toBe('function')
  })

  it('throws error when used outside ToastProvider', () => {
    const consoleError = console.error
    console.error = () => {}
    
    expect(() => {
      renderHook(() => useToast())
    }).toThrow("useToast must be used within ToastProvider")
    
    console.error = consoleError
  })
})
