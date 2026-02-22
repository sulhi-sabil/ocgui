import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppTabs } from './AppTabs'

describe('AppTabs', () => {
  it('renders tabs with triggers', () => {
    render(
      <AppTabs defaultValue="agents">
        <AppTabs.List>
          <AppTabs.Trigger value="agents">Agents</AppTabs.Trigger>
          <AppTabs.Trigger value="skills">Skills</AppTabs.Trigger>
        </AppTabs.List>
        <AppTabs.Content value="agents">Agents Content</AppTabs.Content>
        <AppTabs.Content value="skills">Skills Content</AppTabs.Content>
      </AppTabs>
    )

    expect(screen.getByRole('tab', { name: /agents/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByText('Agents Content')).toBeInTheDocument()
  })

  it('switches content when tab is clicked in uncontrolled mode', () => {
    render(
      <AppTabs defaultValue="agents">
        <AppTabs.List>
          <AppTabs.Trigger value="agents">Agents</AppTabs.Trigger>
          <AppTabs.Trigger value="skills">Skills</AppTabs.Trigger>
        </AppTabs.List>
        <AppTabs.Content value="agents">Agents Content</AppTabs.Content>
        <AppTabs.Content value="skills">Skills Content</AppTabs.Content>
      </AppTabs>
    )

    expect(screen.getByText('Agents Content')).toBeInTheDocument()
  })

  it('renders triggers with icons', () => {
    render(
      <AppTabs defaultValue="agents">
        <AppTabs.List>
          <AppTabs.Trigger value="agents" icon={<span data-testid="agent-icon" />}>
            Agents
          </AppTabs.Trigger>
        </AppTabs.List>
      </AppTabs>
    )

    expect(screen.getByTestId('agent-icon')).toBeInTheDocument()
  })
})
