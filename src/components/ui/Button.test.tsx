import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByText('Loading...')).toBeDisabled()
  })

  it('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByText('Primary')).toHaveClass('bg-blue-600')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-gray-100')
    
    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByText('Ghost')).toHaveClass('hover:bg-gray-100')
  })

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByText('Small')).toHaveClass('px-3')
    
    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByText('Medium')).toHaveClass('px-4')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByText('Large')).toHaveClass('px-6')
  })

  it('defaults to type="button" to prevent accidental form submission', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('allows type prop to be overridden', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
