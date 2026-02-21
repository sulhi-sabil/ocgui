import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ToastContainer } from './ToastContainer'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function ToastContainerTestHarness() {
  return (
    <ToastProvider>
      <ToastContainer />
      <TestAddToastButtons />
    </ToastProvider>
  )
}

function TestAddToastButtons() {
  const { addToast } = useToast()
  return (
    <>
      <button onClick={() => addToast('Success message', 'success')}>Add Success</button>
      <button onClick={() => addToast('Error message', 'error')}>Add Error</button>
      <button onClick={() => addToast('Warning message', 'warning')}>Add Warning</button>
      <button onClick={() => addToast('Info message', 'info')}>Add Info</button>
    </>
  )
}

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when no toasts', () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    )
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders toast with message', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Success'))
    
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders success toast with correct styling', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Success'))
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-green-500')
    expect(screen.getByText('Success message')).toBeInTheDocument()
  })

  it('renders error toast with correct styling', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Error'))
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-red-500')
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('renders warning toast with correct styling', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Warning'))
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-yellow-500')
    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })

  it('renders info toast with correct styling', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Info'))
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-blue-500')
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('removes toast when close button is clicked', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Success'))
    expect(screen.getByText('Success message')).toBeInTheDocument()
    
    fireEvent.click(screen.getByLabelText('Close notification'))
    expect(screen.queryByText('Success message')).not.toBeInTheDocument()
  })

  it('renders multiple toasts', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Success'))
    fireEvent.click(screen.getByText('Add Error'))
    
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.getAllByRole('alert')).toHaveLength(2)
  })

  it('removes specific toast without affecting others', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Success'))
    fireEvent.click(screen.getByText('Add Error'))
    
    const alerts = screen.getAllByRole('alert')
    const closeButton = alerts[0].querySelector('button')
    
    fireEvent.click(closeButton!)
    
    expect(screen.getAllByRole('alert')).toHaveLength(1)
  })

  it('auto-removes toast after 5 seconds', () => {
    render(<ToastContainerTestHarness />)
    
    fireEvent.click(screen.getByText('Add Success'))
    expect(screen.getByText('Success message')).toBeInTheDocument()
    
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    
    expect(screen.queryByText('Success message')).not.toBeInTheDocument()
  })
})
