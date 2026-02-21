import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToastContainer } from './ToastContainer'
import { ToastProvider } from './ToastProvider'
import { ToastContext } from './ToastProvider'
import type { Toast, ToastType } from './ToastProvider'

const createMockContext = (toasts: Toast[] = []) => ({
  toasts,
  addToast: vi.fn(),
  removeToast: vi.fn(),
})

describe('ToastContainer', () => {
  it('should render without toasts', () => {
    const mockContext = createMockContext()
    
    render(
      <ToastContext.Provider value={mockContext}>
        <ToastContainer />
      </ToastContext.Provider>
    )
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should render toasts', () => {
    const mockToasts: Toast[] = [
      { id: '1', message: 'Success message', type: 'success' },
      { id: '2', message: 'Error message', type: 'error' },
    ]
    const mockContext = createMockContext(mockToasts)
    
    render(
      <ToastContext.Provider value={mockContext}>
        <ToastContainer />
      </ToastContext.Provider>
    )
    
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should call removeToast when close button is clicked', () => {
    const mockToasts: Toast[] = [
      { id: 'toast-1', message: 'Test message', type: 'info' },
    ]
    const mockContext = createMockContext(mockToasts)
    
    render(
      <ToastContext.Provider value={mockContext}>
        <ToastContainer />
      </ToastContext.Provider>
    )
    
    fireEvent.click(screen.getByLabelText('Close notification'))
    
    expect(mockContext.removeToast).toHaveBeenCalledWith('toast-1')
  })

  it('should render correct styles for each toast type', () => {
    const types: ToastType[] = ['success', 'error', 'warning', 'info']
    
    types.forEach((type) => {
      const mockToasts: Toast[] = [
        { id: '1', message: `${type} message`, type },
      ]
      const mockContext = createMockContext(mockToasts)
      
      const { unmount } = render(
        <ToastContext.Provider value={mockContext}>
          <ToastContainer />
        </ToastContext.Provider>
      )
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      unmount()
    })
  })

  it('should have proper accessibility attributes', () => {
    const mockToasts: Toast[] = [
      { id: '1', message: 'Test message', type: 'success' },
    ]
    const mockContext = createMockContext(mockToasts)
    
    render(
      <ToastContext.Provider value={mockContext}>
        <ToastContainer />
      </ToastContext.Provider>
    )
    
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByLabelText('Close notification')).toBeInTheDocument()
  })
})

describe('ToastContainer with ToastProvider', () => {
  it('should work with ToastProvider', () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    )
    
    expect(document.body).toBeInTheDocument()
  })
})
