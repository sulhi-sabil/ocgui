import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

const mockSetTheme = vi.fn()
const mockTheme = { value: 'light' }

vi.mock('../store', () => ({
  useAppStore: () => ({
    theme: mockTheme.value,
    setTheme: mockSetTheme,
  }),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTheme.value = 'light'
    document.documentElement.classList.remove('dark')
  })

  it('should render a button', () => {
    render(<ThemeToggle />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should show moon icon in light mode', () => {
    render(<ThemeToggle />)
    
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('should show sun icon in dark mode', () => {
    mockTheme.value = 'dark'
    render(<ThemeToggle />)
    
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
  })

  it('should toggle theme on click', () => {
    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should toggle to light mode from dark', () => {
    mockTheme.value = 'dark'
    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should add dark class to document when switching to dark', () => {
    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should remove dark class from document when switching to light', () => {
    mockTheme.value = 'dark'
    document.documentElement.classList.add('dark')
    
    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should have accessible label', () => {
    render(<ThemeToggle />)
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label')
  })
})
