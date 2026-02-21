import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentCard } from './AgentCard'
import type { Agent } from '../types'

const mockAgent: Agent = {
  id: 'test-agent-1',
  name: 'Test Agent',
  description: 'A test agent for unit testing',
  model: 'gpt-4',
  tools: { read: 'allow', write: 'deny' },
  permissions: {},
  skills: ['code-review'],
  enabled: true,
}

describe('AgentCard', () => {
  it('renders agent name and description', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('A test agent for unit testing')).toBeInTheDocument()
  })

  it('displays enabled status correctly', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('Enabled')).toBeInTheDocument()
  })

  it('displays disabled status correctly', () => {
    render(
      <AgentCard
        agent={{ ...mockAgent, enabled: false }}
        isSelected={false}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('Disabled')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    const handleSelect = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={handleSelect}
      />
    )
    fireEvent.click(screen.getByLabelText('Test Agent - Enabled'))
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onSelect when Enter key is pressed', () => {
    const handleSelect = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={handleSelect}
      />
    )
    fireEvent.keyDown(screen.getByLabelText('Test Agent - Enabled'), { key: 'Enter' })
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onSelect when Space key is pressed', () => {
    const handleSelect = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={handleSelect}
      />
    )
    fireEvent.keyDown(screen.getByLabelText('Test Agent - Enabled'), { key: ' ' })
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('is focusable via Tab', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={vi.fn()}
      />
    )
    const card = screen.getByLabelText('Test Agent - Enabled')
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('has correct aria-pressed attribute when selected', () => {
    const { rerender } = render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByLabelText('Test Agent - Enabled')).toHaveAttribute('aria-pressed', 'false')

    rerender(
      <AgentCard
        agent={mockAgent}
        isSelected={true}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByLabelText('Test Agent - Enabled')).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onToggleEnabled when status badge is clicked', () => {
    const handleToggle = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={vi.fn()}
        onToggleEnabled={handleToggle}
      />
    )
    fireEvent.click(screen.getByText('Enabled'))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('displays skill and tool counts', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('1 skills')).toBeInTheDocument()
    expect(screen.getByText('2 tools')).toBeInTheDocument()
  })
})
