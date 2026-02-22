import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateAgentModal } from './CreateAgentModal'
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

describe('CreateAgentModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    act(() => {
      useAppStore.getState().reset()
    })
  })

  it('does not render when isOpen is false', () => {
    renderWithProviders(<CreateAgentModal isOpen={false} onClose={mockOnClose} />)
    expect(screen.queryByText('Create New Agent')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Create New Agent')).toBeInTheDocument()
    expect(screen.getByLabelText('Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Description *')).toBeInTheDocument()
    expect(screen.getByLabelText('Model Override (optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Tags (optional)')).toBeInTheDocument()
  })

  it('calls onClose when Cancel button is clicked', () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const { container } = renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    const backdrop = container.querySelector('[role="dialog"]')
    fireEvent.click(backdrop!)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Create New Agent'))
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('shows validation error when name is empty', () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Create Agent'))
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('shows validation error when description is empty', () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Create Agent'))
    expect(screen.getByText('Description is required')).toBeInTheDocument()
  })

  it('shows both validation errors when both fields are empty', () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Create Agent'))
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Description is required')).toBeInTheDocument()
  })

  it('creates agent with required fields only', async () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test Agent' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'A test agent' } })
    fireEvent.click(screen.getByText('Create Agent'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents).toHaveLength(1)
    expect(agents[0].name).toBe('Test Agent')
    expect(agents[0].description).toBe('A test agent')
    expect(agents[0].enabled).toBe(true)
  })

  it('creates agent with all fields', async () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Full Agent' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'A full agent' } })
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: 'gpt-4' } })
    fireEvent.change(screen.getByLabelText('Tags (optional)'), { target: { value: 'testing, automation' } })
    fireEvent.click(screen.getByText('Create Agent'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents).toHaveLength(1)
    expect(agents[0].name).toBe('Full Agent')
    expect(agents[0].description).toBe('A full agent')
    expect(agents[0].model).toBe('gpt-4')
    expect(agents[0].tags).toEqual(['testing', 'automation'])
  })

  it('trims whitespace from input values', async () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: '  Trimmed Agent  ' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: '  Trimmed description  ' } })
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: '  gpt-4  ' } })
    fireEvent.click(screen.getByText('Create Agent'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].name).toBe('Trimmed Agent')
    expect(agents[0].description).toBe('Trimmed description')
    expect(agents[0].model).toBe('gpt-4')
  })

  it('does not set model when model field is empty', async () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'No Model Agent' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'An agent without model' } })
    fireEvent.click(screen.getByText('Create Agent'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].model).toBeUndefined()
  })

  it('parses tags correctly', async () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Tagged Agent' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'An agent with tags' } })
    fireEvent.change(screen.getByLabelText('Tags (optional)'), { target: { value: 'tag1,  tag2 , tag3' } })
    fireEvent.click(screen.getByText('Create Agent'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].tags).toEqual(['tag1', 'tag2', 'tag3'])
  })

  it('resets form after successful submission', async () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test Agent' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'A test agent' } })
    fireEvent.click(screen.getByText('Create Agent'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    expect(screen.getByLabelText('Name *')).toHaveValue('')
    expect(screen.getByLabelText('Description *')).toHaveValue('')
  })

  it('has proper accessibility attributes', () => {
    renderWithProviders(<CreateAgentModal isOpen={true} onClose={mockOnClose} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })
})
