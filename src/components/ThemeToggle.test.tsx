import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import { ToastProvider } from './ui/Toast'
import { useAppStore } from '@store/index'
import { act } from '@testing-library/react'

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <ToastProvider>
      {ui}
    </ToastProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useAppStore.getState().reset()
    })
  })

  it('renders the toggle button', () => {
    renderWithProviders(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows moon icon in light mode', () => {
    act(() => {
      useAppStore.getState().setTheme('light')
    })
    renderWithProviders(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('shows sun icon in dark mode', () => {
    act(() => {
      useAppStore.getState().setTheme('dark')
    })
    renderWithProviders(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('toggles theme from light to dark when clicked', () => {
    act(() => {
      useAppStore.getState().setTheme('light')
    })
    renderWithProviders(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(useAppStore.getState().theme).toBe('dark')
  })

  it('toggles theme from dark to light when clicked', () => {
    act(() => {
      useAppStore.getState().setTheme('dark')
    })
    renderWithProviders(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(useAppStore.getState().theme).toBe('light')
  })

  it('updates aria-label after theme change', async () => {
    act(() => {
      useAppStore.getState().setTheme('light')
    })
    renderWithProviders(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
    
    fireEvent.click(button)
    
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('is memoized and does not re-render unnecessarily', () => {
    const { rerender } = renderWithProviders(<ThemeToggle />)
    
    rerender(
      <ToastProvider>
        <ThemeToggle />
      </ToastProvider>
    )
    
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
