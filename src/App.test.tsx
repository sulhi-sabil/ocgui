import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from '@testing-library/react'
import App from './App'
import { useAppStore } from '@store/index'
import { ToastProvider, ToastContainer } from '@components/ui/Toast'

const renderApp = () => {
  return render(
    <ToastProvider>
      <App />
      <ToastContainer />
    </ToastProvider>
  )
}

describe('App', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().reset()
    })
    window.localStorage.clear()
  })

  describe('rendering', () => {
    it('renders the app title', () => {
      renderApp()
      expect(screen.getByText('OpenCode GUI')).toBeInTheDocument()
    })

    it('renders the app description', () => {
      renderApp()
      expect(screen.getByText('Desktop Control Center for OpenCode CLI')).toBeInTheDocument()
    })

    it('renders the Add Agent button', () => {
      renderApp()
      expect(screen.getByText('Add Agent')).toBeInTheDocument()
    })

    it('renders the search input', () => {
      renderApp()
      expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument()
    })

    it('renders the theme toggle', () => {
      renderApp()
      expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument()
    })

    it('renders getting started section', () => {
      renderApp()
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows empty state when no agents exist', () => {
      renderApp()
      expect(screen.getByText('No agents yet')).toBeInTheDocument()
    })

    it('shows create first agent button when no agents exist', () => {
      renderApp()
      expect(screen.getByText('Create Your First Agent')).toBeInTheDocument()
    })
  })

  describe('agent list', () => {
    const mockAgent = {
      id: 'test-agent-1',
      name: 'Test Agent',
      description: 'A test agent',
      model: 'gpt-4',
      tools: { read: 'allow' },
      permissions: { file: 'read' },
      skills: ['skill1'],
      tags: ['test'],
      enabled: true,
    }

    it('displays agents when they exist', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
      renderApp()
      expect(screen.getByText('Test Agent')).toBeInTheDocument()
      expect(screen.getByText('A test agent')).toBeInTheDocument()
    })

    it('displays agent count', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
      renderApp()
      expect(screen.getByText('Agents (1)')).toBeInTheDocument()
    })

    it('does not show empty state when agents exist', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
      renderApp()
      expect(screen.queryByText('No agents yet')).not.toBeInTheDocument()
    })
  })

  describe('search functionality', () => {
    const mockAgents = [
      {
        id: 'agent-1',
        name: 'Code Reviewer',
        description: 'Reviews code',
        tools: {},
        permissions: {},
        skills: [],
        tags: ['code'],
        enabled: true,
      },
      {
        id: 'agent-2',
        name: 'Test Writer',
        description: 'Writes tests',
        tools: {},
        permissions: {},
        skills: [],
        tags: ['test'],
        enabled: true,
      },
    ]

    it('filters agents by name', async () => {
      act(() => {
        mockAgents.forEach(agent => useAppStore.getState().addAgent(agent))
      })
      renderApp()

      const searchInput = screen.getByPlaceholderText('Search agents...')
      await userEvent.type(searchInput, 'Code')

      expect(screen.getByText('Code Reviewer')).toBeInTheDocument()
      expect(screen.queryByText('Test Writer')).not.toBeInTheDocument()
    })

    it('filters agents by description', async () => {
      act(() => {
        mockAgents.forEach(agent => useAppStore.getState().addAgent(agent))
      })
      renderApp()

      const searchInput = screen.getByPlaceholderText('Search agents...')
      await userEvent.type(searchInput, 'tests')

      expect(screen.queryByText('Code Reviewer')).not.toBeInTheDocument()
      expect(screen.getByText('Test Writer')).toBeInTheDocument()
    })

    it('shows no matches state when search has no results', async () => {
      act(() => {
        mockAgents.forEach(agent => useAppStore.getState().addAgent(agent))
      })
      renderApp()

      const searchInput = screen.getByPlaceholderText('Search agents...')
      await userEvent.type(searchInput, 'nonexistent')

      expect(screen.getByText('No matching agents found')).toBeInTheDocument()
    })

    it('shows clear search button when search has no results', async () => {
      act(() => {
        mockAgents.forEach(agent => useAppStore.getState().addAgent(agent))
      })
      renderApp()

      const searchInput = screen.getByPlaceholderText('Search agents...')
      await userEvent.type(searchInput, 'nonexistent')

      expect(screen.getByText('Clear Search')).toBeInTheDocument()
    })

    it('clears search when clear button is clicked', async () => {
      act(() => {
        mockAgents.forEach(agent => useAppStore.getState().addAgent(agent))
      })
      renderApp()

      const searchInput = screen.getByPlaceholderText('Search agents...') as HTMLInputElement
      await userEvent.type(searchInput, 'nonexistent')
      
      fireEvent.click(screen.getByText('Clear Search'))

      expect(searchInput.value).toBe('')
    })

    it('shows filtered count in header', async () => {
      act(() => {
        mockAgents.forEach(agent => useAppStore.getState().addAgent(agent))
      })
      renderApp()

      const searchInput = screen.getByPlaceholderText('Search agents...')
      await userEvent.type(searchInput, 'Code')

      expect(screen.getByText('Agents (1)')).toBeInTheDocument()
      expect(screen.getByText('filtered from 2')).toBeInTheDocument()
    })
  })

  describe('create agent modal', () => {
    it('opens create modal when Add Agent button is clicked', async () => {
      renderApp()
      
      fireEvent.click(screen.getByText('Add Agent'))
      
      await waitFor(() => {
        expect(screen.getByText('Create New Agent')).toBeInTheDocument()
      })
    })

    it('opens create modal when Create Your First Agent button is clicked', async () => {
      renderApp()
      
      fireEvent.click(screen.getByText('Create Your First Agent'))
      
      await waitFor(() => {
        expect(screen.getByText('Create New Agent')).toBeInTheDocument()
      })
    })

    it('closes modal when Cancel is clicked', async () => {
      renderApp()
      
      fireEvent.click(screen.getByText('Add Agent'))
      
      await waitFor(() => {
        expect(screen.getByText('Create New Agent')).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByText('Cancel'))
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Agent')).not.toBeInTheDocument()
      })
    })
  })

  describe('agent actions', () => {
    const mockAgent = {
      id: 'test-agent-1',
      name: 'Test Agent',
      description: 'A test agent',
      tools: {},
      permissions: {},
      skills: [],
      tags: [],
      enabled: true,
    }

    it('selects an agent when clicked', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
      renderApp()

      fireEvent.click(screen.getByText('Test Agent'))
      
      expect(useAppStore.getState().selectedAgentId).toBe('test-agent-1')
    })

    it('toggles agent enabled state when status badge is clicked', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })
      renderApp()

      fireEvent.click(screen.getByText('Enabled'))
      
      expect(useAppStore.getState().agents[0].enabled).toBe(false)
    })

  })
})
