import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from './App'
import { useAppStore } from '@store/index'
import { ToastProvider } from '@components/ui/Toast'
import type { Agent } from './types'

const renderWithProviders = () => {
  return render(
    <ToastProvider>
      <App />
    </ToastProvider>
  )
}

const mockAgent: Agent = {
  id: 'agent-1',
  name: 'Test Agent',
  description: 'A test agent for testing',
  model: 'gpt-4',
  tools: { read: 'allow', write: 'allow' },
  permissions: { file: 'read' },
  skills: ['skill-1', 'skill-2'],
  tags: ['testing', 'automation'],
  enabled: true,
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
    act(() => {
      useAppStore.getState().reset()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('rendering', () => {
    it('renders app title and description', () => {
      renderWithProviders()
      expect(screen.getByText('OpenCode GUI')).toBeInTheDocument()
      expect(screen.getByText('Desktop Control Center for OpenCode CLI')).toBeInTheDocument()
    })

    it('renders Add Agent button', () => {
      renderWithProviders()
      expect(screen.getByText('Add Agent')).toBeInTheDocument()
    })

    it('renders theme toggle', () => {
      renderWithProviders()
      expect(screen.getByLabelText(/Switch to/)).toBeInTheDocument()
    })

    it('renders Getting Started section', () => {
      renderWithProviders()
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Configure your OpenCode CLI workspace')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows empty state when no agents exist', () => {
      renderWithProviders()
      expect(screen.getByText('No agents yet')).toBeInTheDocument()
      expect(screen.getByText('Create Your First Agent')).toBeInTheDocument()
    })

    it('opens create modal when Create Your First Agent is clicked', async () => {
      renderWithProviders()
      fireEvent.click(screen.getByText('Create Your First Agent'))
      await waitFor(() => {
        expect(screen.getByText('Create New Agent')).toBeInTheDocument()
      })
    })

    it('opens create modal when Add Agent button is clicked', async () => {
      renderWithProviders()
      fireEvent.click(screen.getByText('Add Agent'))
      await waitFor(() => {
        expect(screen.getByText('Create New Agent')).toBeInTheDocument()
      })
    })
  })

  describe('agent list', () => {
    it('displays agent count', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
      renderWithProviders()
      expect(screen.getByText('Agents (1)')).toBeInTheDocument()
    })

    it('displays multiple agents', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
        useAppStore.getState().addAgent({ ...mockAgent, id: 'agent-2', name: 'Second Agent' })
      })
      renderWithProviders()
      expect(screen.getByText('Agents (2)')).toBeInTheDocument()
      expect(screen.getByText('Test Agent')).toBeInTheDocument()
      expect(screen.getByText('Second Agent')).toBeInTheDocument()
    })

    it('shows agent details', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
      renderWithProviders()
      expect(screen.getByText('Test Agent')).toBeInTheDocument()
      expect(screen.getByText('A test agent for testing')).toBeInTheDocument()
      expect(screen.getByText('testing')).toBeInTheDocument()
      expect(screen.getByText('automation')).toBeInTheDocument()
    })
  })

  describe('search functionality', () => {
    beforeEach(() => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
        useAppStore.getState().addAgent({
          ...mockAgent,
          id: 'agent-2',
          name: 'Code Reviewer',
          description: 'Reviews code',
          tags: ['code-quality'],
        })
      })
    })

    it('renders search input', () => {
      renderWithProviders()
      expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument()
    })

    it('filters agents by name', () => {
      renderWithProviders()
      const searchInput = screen.getByPlaceholderText('Search agents...')
      fireEvent.change(searchInput, { target: { value: 'Code' } })
      expect(screen.getByText('Code Reviewer')).toBeInTheDocument()
      expect(screen.queryByText('Test Agent')).not.toBeInTheDocument()
    })

    it('shows filtered count when searching', () => {
      renderWithProviders()
      const searchInput = screen.getByPlaceholderText('Search agents...')
      fireEvent.change(searchInput, { target: { value: 'Code' } })
      expect(screen.getByText('filtered from 2')).toBeInTheDocument()
    })

    it('shows no matches state when search has no results', () => {
      renderWithProviders()
      const searchInput = screen.getByPlaceholderText('Search agents...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
      expect(screen.getByText('No matching agents found')).toBeInTheDocument()
      expect(screen.getByText('Clear Search')).toBeInTheDocument()
    })

    it('clears search when Clear Search is clicked', () => {
      renderWithProviders()
      const searchInput = screen.getByPlaceholderText('Search agents...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
      fireEvent.click(screen.getByText('Clear Search'))
      expect(searchInput).toHaveValue('')
      expect(screen.getByText('Agents (2)')).toBeInTheDocument()
    })

    it('persists search query to store', () => {
      renderWithProviders()
      const searchInput = screen.getByPlaceholderText('Search agents...')
      fireEvent.change(searchInput, { target: { value: 'test query' } })
      expect(useAppStore.getState().lastSearchQuery).toBe('test query')
    })
  })

  describe('agent actions', () => {
    beforeEach(() => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
    })

    it('selects an agent when card is clicked', () => {
      renderWithProviders()
      const card = screen.getByRole('button', { name: /Select agent Test Agent/ })
      fireEvent.click(card)
      expect(useAppStore.getState().selectedAgentId).toBe('agent-1')
    })

    it('toggles agent enabled state', async () => {
      renderWithProviders()
      fireEvent.click(screen.getByText('Enabled'))
      await waitFor(() => {
        expect(useAppStore.getState().agents[0].enabled).toBe(false)
      })
    })

    it('renders action menu trigger', () => {
      renderWithProviders()
      expect(screen.getByLabelText('Agent actions')).toBeInTheDocument()
    })
  })

  describe('create agent modal', () => {
    it('opens and closes create modal', async () => {
      renderWithProviders()
      fireEvent.click(screen.getByText('Add Agent'))
      await waitFor(() => {
        expect(screen.getByText('Create New Agent')).toBeInTheDocument()
      })
      fireEvent.click(screen.getByText('Cancel'))
      await waitFor(() => {
        expect(screen.queryByText('Create New Agent')).not.toBeInTheDocument()
      })
    })

    it('creates a new agent through the modal', async () => {
      renderWithProviders()
      fireEvent.click(screen.getByText('Add Agent'))
      await waitFor(() => {
        expect(screen.getByText('Create New Agent')).toBeInTheDocument()
      })
      fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'New Agent' } })
      fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'New description' } })
      fireEvent.click(screen.getByText('Create Agent'))
      await waitFor(() => {
        const agents = useAppStore.getState().agents
        expect(agents).toHaveLength(1)
        expect(agents[0].name).toBe('New Agent')
      })
    })
  })

  describe('keyboard shortcuts', () => {
    it('focuses search input when Cmd+K is pressed', () => {
      renderWithProviders()
      const searchInput = screen.getByPlaceholderText('Search agents...')
      expect(searchInput).not.toHaveFocus()
      fireEvent.keyDown(document, { key: 'k', metaKey: true })
      expect(searchInput).toHaveFocus()
    })

    it('focuses search input when Ctrl+K is pressed', () => {
      renderWithProviders()
      const searchInput = screen.getByPlaceholderText('Search agents...')
      expect(searchInput).not.toHaveFocus()
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
      expect(searchInput).toHaveFocus()
    })
  })
})
