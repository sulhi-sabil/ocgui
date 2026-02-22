/* eslint-disable react-refresh/only-export-components */
import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ToastProvider } from '@components/ui/Toast'

export interface TestProvidersProps {
  children: ReactNode
}

export function TestProviders({ children }: TestProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestProviders, ...options })
}

export { render }
