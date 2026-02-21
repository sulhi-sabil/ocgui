import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider, ToastContainer } from './components/ui/Toast'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Failed to find root element. The application cannot mount.')
  throw new Error('Root element not found. Ensure index.html contains an element with id="root"')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
        <ToastContainer />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
