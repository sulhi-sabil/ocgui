import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No agents" description="Create your first agent to get started" />)
    expect(screen.getByText('No agents')).toBeInTheDocument()
    expect(screen.getByText('Create your first agent to get started')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        icon={<span data-testid="test-icon">Icon</span>}
      />
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('does not render icon element when not provided', () => {
    render(<EmptyState title="No agents" description="Create your first agent" />)
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
  })

  it('renders primary action button when actionLabel and onAction are provided', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        actionLabel="Create Agent"
        onAction={handleAction}
      />
    )
    expect(screen.getByText('Create Agent')).toBeInTheDocument()
  })

  it('calls onAction when primary action button is clicked', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        actionLabel="Create Agent"
        onAction={handleAction}
      />
    )
    fireEvent.click(screen.getByText('Create Agent'))
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('does not render action button when only actionLabel is provided', () => {
    render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        actionLabel="Create Agent"
      />
    )
    expect(screen.queryByText('Create Agent')).not.toBeInTheDocument()
  })

  it('does not render action button when only onAction is provided', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        onAction={handleAction}
      />
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders secondary action button when provided', () => {
    const handlePrimary = vi.fn()
    const handleSecondary = vi.fn()
    render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        actionLabel="Create Agent"
        onAction={handlePrimary}
        secondaryActionLabel="Import Agent"
        onSecondaryAction={handleSecondary}
      />
    )
    expect(screen.getByText('Create Agent')).toBeInTheDocument()
    expect(screen.getByText('Import Agent')).toBeInTheDocument()
  })

  it('calls onSecondaryAction when secondary action button is clicked', () => {
    const handlePrimary = vi.fn()
    const handleSecondary = vi.fn()
    render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        actionLabel="Create Agent"
        onAction={handlePrimary}
        secondaryActionLabel="Import Agent"
        onSecondaryAction={handleSecondary}
      />
    )
    fireEvent.click(screen.getByText('Import Agent'))
    expect(handleSecondary).toHaveBeenCalledTimes(1)
    expect(handlePrimary).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState 
        title="No agents" 
        description="Create your first agent" 
        className="custom-class"
      />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
