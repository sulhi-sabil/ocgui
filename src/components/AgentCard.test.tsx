import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentCard } from './AgentCard'
import type { Agent } from '../types'

const mockAgent: Agent = {
  id: 'test-agent-1',
  name: 'Test Agent',
  description: 'A test agent for testing',
  model: 'gpt-4',
  tools: { tool1: 'read', tool2: 'write' },
  permissions: { file: 'read' },
  skills: ['skill1', 'skill2', 'skill3'],
  tags: ['test', 'demo'],
  enabled: true,
}

describe('AgentCard', () => {
  it('renders agent name and description', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={() => {}}
      />
    )
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('A test agent for testing')).toBeInTheDocument()
  })

  it('displays enabled status badge when agent is enabled', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={() => {}}
      />
    )
    expect(screen.getByText('Enabled')).toBeInTheDocument()
  })

  it('displays disabled status badge when agent is disabled', () => {
    render(
      <AgentCard
        agent={{ ...mockAgent, enabled: false }}
        isSelected={false}
        onAction={() => {}}
      />
    )
    expect(screen.getByText('Disabled')).toBeInTheDocument()
  })

  it('displays skill count and tool count', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={() => {}}
      />
    )
    expect(screen.getByText('3 skills')).toBeInTheDocument()
    expect(screen.getByText('2 tools')).toBeInTheDocument()
  })

  it('displays model when provided', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={() => {}}
      />
    )
    expect(screen.getByText('gpt-4')).toBeInTheDocument()
  })

  it('does not display model when not provided', () => {
    render(
      <AgentCard
        agent={{ ...mockAgent, model: undefined }}
        isSelected={false}
        onAction={() => {}}
      />
    )
    expect(screen.queryByText('gpt-4')).not.toBeInTheDocument()
  })

  it('calls onAction with "select" when card is clicked', () => {
    const handleAction = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={handleAction}
      />
    )
    fireEvent.click(screen.getByText('Test Agent').closest('div')!)
    expect(handleAction).toHaveBeenCalledWith('select', 'test-agent-1')
  })

  it('calls onAction with "toggle" when status badge is clicked', () => {
    const handleAction = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={handleAction}
      />
    )
    fireEvent.click(screen.getByText('Enabled'))
    expect(handleAction).toHaveBeenCalledWith('toggle', 'test-agent-1')
  })

  it('shows action menu when showDuplicate or showEdit or showDelete is true', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={() => {}}
        showDuplicate
      />
    )
    expect(screen.getByLabelText('Agent actions')).toBeInTheDocument()
  })

  it('does not show action menu when all show props are false', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={() => {}}
        showDuplicate={false}
        showEdit={false}
        showDelete={false}
      />
    )
    expect(screen.queryByLabelText('Agent actions')).not.toBeInTheDocument()
  })

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(
      <AgentCard
        agent={mockAgent}
        isSelected={true}
        onAction={() => {}}
      />
    )
    const card = container.querySelector('.scale-\\[1\\.02\\]')
    expect(card).toBeInTheDocument()
  })

  it('stops propagation when clicking status badge', () => {
    const handleAction = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={handleAction}
      />
    )
    fireEvent.click(screen.getByText('Enabled'))
    expect(handleAction).toHaveBeenCalledTimes(1)
    expect(handleAction).toHaveBeenCalledWith('toggle', 'test-agent-1')
  })

  it('stops propagation when clicking action menu trigger', () => {
    const handleAction = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onAction={handleAction}
        showDuplicate
      />
    )
    fireEvent.click(screen.getByLabelText('Agent actions'))
    expect(handleAction).not.toHaveBeenCalled()
  })
})
