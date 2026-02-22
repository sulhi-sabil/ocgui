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
  tags: ['tag1', 'tag2'],
  enabled: true,
}

describe('AgentCard', () => {
  it('renders agent name and description', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
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
        onSelect={() => {}}
      />
    )
    expect(screen.getByText('Enabled')).toBeInTheDocument()
  })

  it('displays disabled status badge when agent is disabled', () => {
    render(
      <AgentCard
        agent={{ ...mockAgent, enabled: false }}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    expect(screen.getByText('Disabled')).toBeInTheDocument()
  })

  it('displays skill count and tool count', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
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
        onSelect={() => {}}
      />
    )
    expect(screen.getByText('gpt-4')).toBeInTheDocument()
  })

  it('does not display model when not provided', () => {
    render(
      <AgentCard
        agent={{ ...mockAgent, model: undefined }}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    expect(screen.queryByText('gpt-4')).not.toBeInTheDocument()
  })

  it('calls onSelect when card is clicked', () => {
    const handleSelect = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={handleSelect}
      />
    )
    fireEvent.click(screen.getByText('Test Agent').closest('div')!)
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onToggleEnabled when status badge is clicked', () => {
    const handleToggle = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
        onToggleEnabled={handleToggle}
      />
    )
    fireEvent.click(screen.getByText('Enabled'))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('does not call onToggleEnabled when status badge is clicked without handler', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    const badge = screen.getByText('Enabled')
    expect(badge).toBeDisabled()
  })

  it('shows duplicate button when onDuplicate is provided', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
        onDuplicate={() => {}}
      />
    )
    expect(screen.getByLabelText('Agent actions')).toBeInTheDocument()
  })

  it('does not show duplicate button when onDuplicate is not provided', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    expect(screen.queryByLabelText('Agent actions')).not.toBeInTheDocument()
  })

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(
      <AgentCard
        agent={mockAgent}
        isSelected={true}
        onSelect={() => {}}
      />
    )
    const card = container.querySelector('.scale-\\[1\\.02\\]')
    expect(card).toBeInTheDocument()
  })

  it('stops propagation when clicking status badge', () => {
    const handleSelect = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={handleSelect}
        onToggleEnabled={() => {}}
      />
    )
    fireEvent.click(screen.getByText('Enabled'))
    expect(handleSelect).not.toHaveBeenCalled()
  })

  it('stops propagation when clicking action menu trigger', () => {
    const handleSelect = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={handleSelect}
        onDuplicate={() => {}}
      />
    )
    fireEvent.click(screen.getByLabelText('Agent actions'))
    expect(handleSelect).not.toHaveBeenCalled()
  })
})
