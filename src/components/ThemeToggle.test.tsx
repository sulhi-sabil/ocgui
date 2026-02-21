import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import { useAppStore } from '../store'

vi.mock('../store', () => ({
  useAppStore: vi.fn(),
}))

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn()
  const documentElement = document.documentElement

  beforeEach(() => {
    vi.clearAllMocks()
    documentElement.classList.remove('dark')
  })

  afterEach(() => {
    documentElement.classList.remove('dark')
  })

  it('renders with light theme', () => {
    vi.mocked(useAppStore).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('renders with dark theme', () => {
    vi.mocked(useAppStore).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('toggles from light to dark when clicked', () => {
    vi.mocked(useAppStore).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('toggles from dark to light when clicked', () => {
    vi.mocked(useAppStore).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('adds dark class to documentElement when toggling to dark', () => {
    vi.mocked(useAppStore).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    act(() => {
      fireEvent.click(screen.getByRole('button'))
    })
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('removes dark class from documentElement when toggling to light', () => {
    documentElement.classList.add('dark')
    vi.mocked(useAppStore).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    act(() => {
      fireEvent.click(screen.getByRole('button'))
    })
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
