import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorContext {
  timestamp: number
  componentStack: string | null
  error: Error | null
}

interface Props {
  children: ReactNode
  onReset?: () => void
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorContext: ErrorContext | null
  showStackTrace: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorContext: null,
    showStackTrace: false,
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorContext: {
        timestamp: Date.now(),
        componentStack: null,
        error,
      },
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorContext: ErrorContext = {
      timestamp: Date.now(),
      componentStack: errorInfo.componentStack || null,
      error,
    }
    
    this.setState({ errorInfo, errorContext })
    
    console.error('Uncaught error:', error, errorInfo)
    console.error('Error context:', {
      message: error.message,
      name: error.name,
      timestamp: new Date(errorContext.timestamp).toISOString(),
      componentStack: errorInfo.componentStack,
    })
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorContext: null,
      showStackTrace: false,
    })
    this.props.onReset?.()
  }

  private handleReload = () => {
    window.location.reload()
  }

  private toggleStackTrace = () => {
    this.setState(prevState => ({ showStackTrace: !prevState.showStackTrace }))
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-8 max-w-lg w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-red-600 dark:text-red-400">
                Something went wrong
              </h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The application encountered an unexpected error. You can try to continue or refresh the page.
            </p>
            
            {this.state.error && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 mb-4">
                <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {this.state.errorInfo?.componentStack && (
              <div className="mb-4">
                <button
                  onClick={this.toggleStackTrace}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline flex items-center gap-1"
                  aria-expanded={this.state.showStackTrace}
                >
                  <svg 
                    className={`w-4 h-4 transition-transform ${this.state.showStackTrace ? 'rotate-90' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {this.state.showStackTrace ? 'Hide' : 'Show'} stack trace
                </button>
                
                {this.state.showStackTrace && (
                  <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-auto max-h-48 border border-gray-200 dark:border-gray-600">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {this.state.errorContext && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Error occurred at {new Date(this.state.errorContext.timestamp).toLocaleString()}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-medium py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
