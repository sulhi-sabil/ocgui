import { useEffect, useState, useRef, lazy, Suspense, useCallback } from 'react'
import { useAppStore } from '@store/index'
import { AgentCard } from '@components/AgentCard'
import { ThemeToggle } from '@components/ThemeToggle'
import { Button, SearchInput, EmptyState } from '@components/ui'
import { useAgentSearch } from '@hooks/useAgentSearch'
import { usePlatformShortcut } from '@hooks/useKeyboardShortcut'
import { useToast } from '@components/ui/Toast'
import { cn } from '@utils/cn'
import { iconSize, strokeWidth, grid, colors } from '@styles/tokens'

const CreateAgentModal = lazy(() => import('@components/CreateAgentModal'))

function App() {
  const agents = useAppStore((state) => state.agents)
  const selectedAgentId = useAppStore((state) => state.selectedAgentId)
  const selectAgent = useAppStore((state) => state.selectAgent)
  const theme = useAppStore((state) => state.theme)
  const lastSearchQuery = useAppStore((state) => state.lastSearchQuery)
  const setLastSearchQuery = useAppStore((state) => state.setLastSearchQuery)
  const updateAgent = useAppStore((state) => state.updateAgent)
  const duplicateAgent = useAppStore((state) => state.duplicateAgent)
  const { addToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(lastSearchQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  usePlatformShortcut('k', () => {
    searchInputRef.current?.focus()
  })

  const { filteredAgents, hasResults, resultCount } = useAgentSearch(agents, searchQuery)

  useEffect(() => {
    setLastSearchQuery(searchQuery)
  }, [searchQuery, setLastSearchQuery])

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])
  
  const handleDuplicate = useCallback((id: string) => {
    const duplicated = duplicateAgent(id)
    if (duplicated) {
      addToast(`Agent "${duplicated.name}" created from duplicate`, 'success')
    }
  }, [duplicateAgent, addToast])

  const handleSelectAgent = useCallback((id: string) => selectAgent(id), [selectAgent])
  const handleToggleEnabled = useCallback((id: string) => {
    const agent = agents.find(a => a.id === id)
    if (agent) {
      updateAgent(id, { enabled: !agent.enabled })
    }
  }, [agents, updateAgent])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              OpenCode GUI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Desktop Control Center for OpenCode CLI
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={openModal} size="sm">
              <svg className={cn(iconSize.sm, 'mr-2')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Agent
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Agents ({resultCount})
              {searchQuery && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  filtered from {agents.length}
                </span>
              )}
            </h2>
            
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search agents..."
              className="w-full sm:w-72"
              shortcutHint="⌘K"
            />
          </div>
          
          {!hasResults ? (
            <EmptyState
              title={searchQuery ? 'No matching agents found' : 'No agents yet'}
              description={
                searchQuery
                  ? 'Try adjusting your search terms or clear the filter to see all agents.'
                  : 'Get started by creating your first agent. Agents help you automate tasks and orchestrate workflows.'
              }
              icon={
                <svg className={cn(iconSize.xl, colors.primary.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              actionLabel={searchQuery ? undefined : 'Create Your First Agent'}
              onAction={searchQuery ? undefined : openModal}
              secondaryActionLabel={searchQuery ? 'Clear Search' : undefined}
              onSecondaryAction={searchQuery ? () => setSearchQuery('') : undefined}
            />
          ) : (
            <div className={grid.cards}>
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgentId === agent.id}
                  onSelect={() => handleSelectAgent(agent.id)}
                  onToggleEnabled={() => handleToggleEnabled(agent.id)}
                  onDuplicate={() => handleDuplicate(agent.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Getting Started
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc list-inside space-y-1">
            <li>Configure your OpenCode CLI workspace</li>
            <li>Import existing agents from AGENTS.md</li>
            <li>Set up skill compositions and tool permissions</li>
            <li>Execute and monitor agent runs</li>
          </ul>
        </div>
      </main>

      <Suspense fallback={null}>
        <CreateAgentModal isOpen={isModalOpen} onClose={closeModal} />
      </Suspense>
    </div>
  )
}

export default App
