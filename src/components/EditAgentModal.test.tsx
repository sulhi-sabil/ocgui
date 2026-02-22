import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EditAgentModal } from './EditAgentModal'
import { ToastProvider } from './ui/Toast'
import { useAppStore } from '@store/index'
import { act } from '@testing-library/react'
import type { Agent } from '../types'

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <ToastProvider>
      {ui}
    </ToastProvider>
  )
}

const mockAgent: Agent = {
  id: 'test-agent-1',
  name: 'Test Agent',
  description: 'A test agent description',
  model: 'gpt-4',
  tools: { tool1: 'read', tool2: 'write' },
  permissions: { file: 'read' },
  skills: ['skill1', 'skill2'],
  tags: ['testing', 'automation'],
  enabled: true,
}

describe('EditAgentModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    act(() => {
      useAppStore.getState().reset()
    })
  })

  it('does not render when isOpen is false', () => {
    renderWithProviders(<EditAgentModal isOpen={false} onClose={mockOnClose} agent={mockAgent} />)
    expect(screen.queryByText('Edit Agent')).not.toBeInTheDocument()
  })

  it('does not render when agent is null', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={null} />)
    expect(screen.queryByText('Edit Agent')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true and agent is provided', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    expect(screen.getByText('Edit Agent')).toBeInTheDocument()
    expect(screen.getByLabelText('Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Description *')).toBeInTheDocument()
    expect(screen.getByLabelText('Model Override (optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Tags (optional)')).toBeInTheDocument()
  })

  it('populates form with agent data', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    expect(screen.getByLabelText('Name *')).toHaveValue(mockAgent.name)
    expect(screen.getByLabelText('Description *')).toHaveValue(mockAgent.description)
    expect(screen.getByLabelText('Model Override (optional)')).toHaveValue(mockAgent.model)
    expect(screen.getByLabelText('Tags (optional)')).toHaveValue('testing, automation')
  })

  it('calls onClose when Cancel button is clicked', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const { container } = renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    const backdrop = container.querySelector('[role="dialog"]')
    fireEvent.click(backdrop!)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    fireEvent.click(screen.getByText('Edit Agent'))
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('shows validation error when name is cleared', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: '' } })
    fireEvent.click(screen.getByText('Save Changes'))
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('shows validation error when description is cleared', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: '' } })
    fireEvent.click(screen.getByText('Save Changes'))
    expect(screen.getByText('Description is required')).toBeInTheDocument()
  })

  it('updates agent with modified values', async () => {
    act(() => {
      useAppStore.getState().addAgent(mockAgent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Updated Agent' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Updated description' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents).toHaveLength(1)
    expect(agents[0].name).toBe('Updated Agent')
    expect(agents[0].description).toBe('Updated description')
  })

  it('updates agent with new model', async () => {
    act(() => {
      useAppStore.getState().addAgent(mockAgent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: 'claude-3-opus' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].model).toBe('claude-3-opus')
  })

  it('clears model when field is emptied', async () => {
    act(() => {
      useAppStore.getState().addAgent(mockAgent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: '' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].model).toBeUndefined()
  })

  it('updates tags correctly', async () => {
    act(() => {
      useAppStore.getState().addAgent(mockAgent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    fireEvent.change(screen.getByLabelText('Tags (optional)'), { target: { value: 'new-tag, another-tag' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].tags).toEqual(['new-tag', 'another-tag'])
  })

  it('handles agent without model', async () => {
    const agentWithoutModel: Agent = { ...mockAgent, model: undefined }
    act(() => {
      useAppStore.getState().addAgent(agentWithoutModel)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={agentWithoutModel} />)
    
    expect(screen.getByLabelText('Model Override (optional)')).toHaveValue('')
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Updated Name' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].name).toBe('Updated Name')
  })

  it('handles agent without tags', async () => {
    const agentWithoutTags: Agent = { ...mockAgent, tags: [] }
    act(() => {
      useAppStore.getState().addAgent(agentWithoutTags)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={agentWithoutTags} />)
    
    expect(screen.getByLabelText('Tags (optional)')).toHaveValue('')
  })

  it('trims whitespace from input values', async () => {
    act(() => {
      useAppStore.getState().addAgent(mockAgent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: '  Trimmed Name  ' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: '  Trimmed description  ' } })
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: '  gpt-4-turbo  ' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const agents = useAppStore.getState().agents
    expect(agents[0].name).toBe('Trimmed Name')
    expect(agents[0].description).toBe('Trimmed description')
    expect(agents[0].model).toBe('gpt-4-turbo')
  })

  it('has proper accessibility attributes', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'edit-modal-title')
  })
})
