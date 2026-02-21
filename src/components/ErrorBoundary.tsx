import { Component, ErrorInfo, ReactNode } from 'react'
import { colors, spacing, borders, shadows, typography } from '@styles/tokens'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={`min-h-screen flex items-center justify-center ${colors.gray[50]} p-4`}>
          <div className={`${colors.white} ${borders.default} ${shadows.lg} ${spacing.cardLarge} max-w-md w-full`}>
            <h1 className={`${typography.h1} ${colors.error.text} mb-4`}>
              Something went wrong
            </h1>
            <p className={`${colors.gray[600]} mb-4`}>
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <pre className={`${colors.gray[100]} p-4 rounded ${typography.body} ${colors.gray[800]} overflow-auto`}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className={`mt-4 w-full ${colors.primary[600]} text-white font-medium py-2 px-4 rounded transition-colors`}
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
