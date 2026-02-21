import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentCard } from './AgentCard'
import type { Agent } from '../types'

describe('AgentCard', () => {
  const mockAgent: Agent = {
    id: 'agent-1',
    name: 'Test Agent',
    description: 'A test agent description',
    model: 'gpt-4',
    tools: { read: 'allow', write: 'deny' },
    permissions: { file: 'ask' },
    skills: ['skill-1', 'skill-2', 'skill-3'],
    enabled: true,
  }

  it('should render agent name and description', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('A test agent description')).toBeInTheDocument()
  })

  it('should display enabled status when agent is enabled', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.getByText('Enabled')).toBeInTheDocument()
  })

  it('should display disabled status when agent is disabled', () => {
    render(
      <AgentCard
        agent={{ ...mockAgent, enabled: false }}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.getByText('Disabled')).toBeInTheDocument()
  })

  it('should show skill count', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.getByText('3 skills')).toBeInTheDocument()
  })

  it('should show tool count', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.getByText('2 tools')).toBeInTheDocument()
  })

  it('should show model when present', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.getByText('gpt-4')).toBeInTheDocument()
  })

  it('should not show model section when absent', () => {
    render(
      <AgentCard
        agent={{ ...mockAgent, model: undefined }}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.queryByText('gpt-4')).not.toBeInTheDocument()
  })

  it('should call onSelect when clicked', () => {
    const handleSelect = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={handleSelect}
      />
    )
    
    fireEvent.click(screen.getByText('Test Agent'))
    
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('should call onToggleEnabled when status button is clicked', () => {
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

  it('should not call onToggleEnabled when not provided', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    const statusButton = screen.getByText('Enabled')
    expect(statusButton).toBeDisabled()
  })

  it('should show duplicate menu when onDuplicate is provided', () => {
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

  it('should not show duplicate menu when onDuplicate is not provided', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
      />
    )
    
    expect(screen.queryByLabelText('Agent actions')).not.toBeInTheDocument()
  })

  it('should have duplicate menu trigger when onDuplicate is provided', () => {
    const handleDuplicate = vi.fn()
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
        onDuplicate={handleDuplicate}
      />
    )
    
    const menuTrigger = screen.getByLabelText('Agent actions')
    expect(menuTrigger).toBeInTheDocument()
    expect(menuTrigger).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('should have title attribute when onToggleEnabled is provided', () => {
    render(
      <AgentCard
        agent={mockAgent}
        isSelected={false}
        onSelect={() => {}}
        onToggleEnabled={() => {}}
      />
    )
    
    expect(screen.getByText('Enabled')).toHaveAttribute('title', 'Click to disable agent')
  })
})
