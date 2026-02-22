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
  id: 'test-agent-id',
  name: 'Test Agent',
  description: 'A test agent description',
  enabled: true,
  tools: {},
  permissions: {},
  skills: [],
  tags: ['testing', 'automation'],
}

const mockAgentWithModel: Agent = {
  id: 'test-agent-with-model',
  name: 'Model Agent',
  description: 'An agent with model',
  enabled: true,
  model: 'gpt-4',
  tools: {},
  permissions: {},
  skills: [],
  tags: ['ai'],
}

const createTestAgent = (overrides: Partial<Agent> = {}): Agent => ({
  id: `test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: 'Test Agent',
  description: 'Test description',
  enabled: true,
  tools: {},
  permissions: {},
  skills: [],
  tags: [],
  ...overrides,
})

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
    
    expect(screen.getByLabelText('Name *')).toHaveValue('Test Agent')
    expect(screen.getByLabelText('Description *')).toHaveValue('A test agent description')
    expect(screen.getByLabelText('Tags (optional)')).toHaveValue('testing, automation')
  })

  it('populates form with model when agent has model', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgentWithModel} />)
    
    expect(screen.getByLabelText('Model Override (optional)')).toHaveValue('gpt-4')
  })

  it('has empty model field when agent has no model', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    expect(screen.getByLabelText('Model Override (optional)')).toHaveValue('')
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

  it('updates agent with new values', async () => {
    const agent = createTestAgent()
    act(() => {
      useAppStore.getState().addAgent(agent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={agent} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Updated Agent' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Updated description' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const updatedAgent = useAppStore.getState().agents.find(a => a.id === agent.id)
    expect(updatedAgent?.name).toBe('Updated Agent')
    expect(updatedAgent?.description).toBe('Updated description')
  })

  it('updates agent model', async () => {
    const agent = createTestAgent()
    act(() => {
      useAppStore.getState().addAgent(agent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={agent} />)
    
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: 'claude-3-opus' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const updatedAgent = useAppStore.getState().agents.find(a => a.id === agent.id)
    expect(updatedAgent?.model).toBe('claude-3-opus')
  })

  it('clears model when field is emptied', async () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgentWithModel} />)
    
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: '' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('updates tags correctly', async () => {
    const agent = createTestAgent()
    act(() => {
      useAppStore.getState().addAgent(agent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={agent} />)
    
    fireEvent.change(screen.getByLabelText('Tags (optional)'), { target: { value: 'new-tag-1, new-tag-2' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const updatedAgent = useAppStore.getState().agents.find(a => a.id === agent.id)
    expect(updatedAgent?.tags).toEqual(['new-tag-1', 'new-tag-2'])
  })

  it('trims whitespace from input values', async () => {
    const agent = createTestAgent()
    act(() => {
      useAppStore.getState().addAgent(agent)
    })

    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={agent} />)
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: '  Trimmed Name  ' } })
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: '  Trimmed description  ' } })
    fireEvent.change(screen.getByLabelText('Model Override (optional)'), { target: { value: '  gpt-4  ' } })
    fireEvent.change(screen.getByLabelText('Tags (optional)'), { target: { value: '  tag1 , tag2  ' } })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })

    const updatedAgent = useAppStore.getState().agents.find(a => a.id === agent.id)
    expect(updatedAgent?.name).toBe('Trimmed Name')
    expect(updatedAgent?.description).toBe('Trimmed description')
    expect(updatedAgent?.model).toBe('gpt-4')
    expect(updatedAgent?.tags).toEqual(['tag1', 'tag2'])
  })

  it('closes on Escape key press', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('has proper accessibility attributes', () => {
    renderWithProviders(<EditAgentModal isOpen={true} onClose={mockOnClose} agent={mockAgent} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'edit-modal-title')
  })
})
