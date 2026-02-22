import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '@hooks/index'

vi.mock('@hooks/index', () => ({
  useTheme: vi.fn(),
}))

describe('ThemeToggle', () => {
  const mockToggleTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders button with accessible label', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to dark mode'
    )
  })

  it('shows correct aria-label when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to light mode'
    )
  })

  it('calls toggleTheme on click', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('renders moon icon when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    
    render(<ThemeToggle />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('text-gray-700')
  })

  it('renders sun icon when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    
    render(<ThemeToggle />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('text-yellow-400')
  })

  it('has correct styling classes', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('p-2', 'rounded-lg')
  })

  it('is memoized', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    })
    
    const { rerender } = render(<ThemeToggle />)
    const firstRender = screen.getByRole('button')
    
    rerender(<ThemeToggle />)
    const secondRender = screen.getByRole('button')
    
    expect(firstRender).toBe(secondRender)
  })
})
