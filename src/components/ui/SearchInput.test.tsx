import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('should render with placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Search agents..." />)
    
    expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument()
  })

  it('should display the current value', () => {
    render(<SearchInput value="test query" onChange={() => {}} />)
    
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument()
  })

  it('should call onChange when typing', () => {
    const handleChange = vi.fn()
    render(<SearchInput value="" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalledWith('new value')
  })

  it('should show clear button when value is present', () => {
    render(<SearchInput value="test" onChange={() => {}} />)
    
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('should not show clear button when value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('should clear value when clear button is clicked', () => {
    const handleChange = vi.fn()
    render(<SearchInput value="test" onChange={handleChange} />)
    
    const clearButton = screen.getByLabelText('Clear search')
    fireEvent.click(clearButton)
    
    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('should show shortcut hint when value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} shortcutHint="⌘K" />)
    
    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  it('should not show shortcut hint when value is present', () => {
    render(<SearchInput value="test" onChange={() => {}} shortcutHint="⌘K" />)
    
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument()
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<SearchInput ref={(el) => { ref.current = el }} value="" onChange={() => {}} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
