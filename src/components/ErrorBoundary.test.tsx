import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Normal content</div>
}

describe('ErrorBoundary', () => {
  const originalError = console.error
  let consoleErrorMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    consoleErrorMock = vi.fn()
    console.error = consoleErrorMock
  })

  afterEach(() => {
    console.error = originalError
  })

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders fallback UI when an error is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/The application encountered an unexpected error/)).toBeInTheDocument()
  })

  it('displays the error message in the fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('has a reload button that reloads the page', () => {
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('Reload Application'))
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('has a try again button that resets the error boundary', () => {
    const onReset = vi.fn()
    
    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Try Again'))
    
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('shows stack trace toggle button when component stack exists', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Show stack trace/)).toBeInTheDocument()
  })

  it('toggles stack trace visibility', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const toggleButton = screen.getByText(/Show stack trace/)
    expect(screen.queryByText(/Hide stack trace/)).not.toBeInTheDocument()
    
    fireEvent.click(toggleButton)
    
    expect(screen.getByText(/Hide stack trace/)).toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/Hide stack trace/))
    
    expect(screen.getByText(/Show stack trace/)).toBeInTheDocument()
  })

  it('logs the error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    )
  })

  it('logs error context to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error context:',
      expect.objectContaining({
        message: 'Test error',
        name: 'Error',
        timestamp: expect.any(String),
        componentStack: expect.any(String),
      })
    )
  })

  it('does not show error message when error is null', () => {
    class TestErrorBoundary extends ErrorBoundary {
      public state = { 
        hasError: true, 
        error: null, 
        errorInfo: null, 
        errorContext: null, 
        showStackTrace: false 
      }
    }

    render(
      <TestErrorBoundary>
        <div>Child</div>
      </TestErrorBoundary>
    )

    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })

  it('renders complex children tree correctly', () => {
    render(
      <ErrorBoundary>
        <div>
          <span>Nested</span>
          <span>Content</span>
        </div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Nested')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('displays error timestamp', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Error occurred at/)).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error UI')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})
