import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    mockOnConfirm.mockClear()
    mockOnCancel.mockClear()
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Confirm Delete"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument()
  })

  it('renders title and message when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument()
  })

  it('renders default button labels', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders custom button labels', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        message="This cannot be undone"
        confirmLabel="Delete"
        cancelLabel="Keep It"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Keep It')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('calls onCancel when clicking backdrop', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    fireEvent.click(screen.getByRole('alertdialog'))
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when pressing Escape', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll when open', () => {
    const { unmount } = render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    expect(document.body.style.overflow).toBe('hidden')
    
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('applies danger variant styling', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete"
        message="Are you sure?"
        variant="danger"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('bg-red-600')
  })

  it('applies warning variant styling', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Warning"
        message="Are you sure?"
        variant="warning"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('bg-yellow-500')
  })

  it('applies default variant styling', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        message="Are you sure?"
        variant="default"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })
    expect(confirmButton).toHaveClass('bg-blue-600')
  })

  it('has correct ARIA attributes', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Delete"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-message')
  })
})
