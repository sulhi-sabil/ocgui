import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useToast } from './useToast'
import { ToastContext } from './ToastProvider'
import type { ToastContextType } from './ToastProvider'

const createMockContext = (): ToastContextType => ({
  toasts: [],
  addToast: vi.fn(),
  removeToast: vi.fn(),
})

describe('useToast', () => {
  it('should return context value when used within ToastProvider', () => {
    const mockContext = createMockContext()
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastContext.Provider value={mockContext}>
        {children}
      </ToastContext.Provider>
    )
    
    const { result } = renderHook(() => useToast(), { wrapper })
    
    expect(result.current).toEqual(mockContext)
    expect(result.current.toasts).toEqual([])
    expect(typeof result.current.addToast).toBe('function')
    expect(typeof result.current.removeToast).toBe('function')
  })

  it('should return same functions across re-renders', () => {
    const mockContext = createMockContext()
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastContext.Provider value={mockContext}>
        {children}
      </ToastContext.Provider>
    )
    
    const { result, rerender } = renderHook(() => useToast(), { wrapper })
    
    const firstAddToast = result.current.addToast
    const firstRemoveToast = result.current.removeToast
    
    rerender()
    
    expect(result.current.addToast).toBe(firstAddToast)
    expect(result.current.removeToast).toBe(firstRemoveToast)
  })
})
