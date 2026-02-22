import { useEffect, useState, useRef, lazy, Suspense, useCallback } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAppStore } from '@store/index'
import { AgentCard, type AgentAction } from '@components/AgentCard'
import { ThemeToggle } from '@components/ThemeToggle'
import { Button, SearchInput, EmptyState, ConfirmDialog } from '@components/ui'
import { useAgentSearch, useAgentSort, useTheme } from '@hooks/index'
import { usePlatformShortcut } from '@hooks/useKeyboardShortcut'
import { useToast } from '@components/ui/Toast'
import { cn } from '@utils/cn'
import { iconSize, strokeWidth, grid, colors } from '@styles/tokens'
import { UI_TEXT, APP } from '@constants/index'
import type { Agent, AgentSortBy } from './types'

const CreateAgentModal = lazy(() => import('@components/CreateAgentModal'))
const EditAgentModal = lazy(() => import('@components/EditAgentModal'))

function useAgentCallbacks(agents: Agent[]) {
  const selectAgent = useAppStore((state) => state.selectAgent)
  const updateAgent = useAppStore((state) => state.updateAgent)
  const duplicateAgent = useAppStore((state) => state.duplicateAgent)
  const deleteAgent = useAppStore((state) => state.deleteAgent)
  const { addToast } = useToast()
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null)
  
  const agentsRef = useRef(agents)
  agentsRef.current = agents

  const handleAgentAction = useCallback((action: AgentAction, agentId: string) => {
    const agent = agentsRef.current.find(a => a.id === agentId)
    
    switch (action) {
      case 'select':
        selectAgent(agentId)
        break
      case 'toggle':
        if (agent) {
          updateAgent(agentId, { enabled: !agent.enabled })
        }
        break
      case 'duplicate': {
        const duplicated = duplicateAgent(agentId)
        if (duplicated) {
          addToast(`Agent "${duplicated.name}" created from duplicate`, 'success')
        }
        break
      }
      case 'edit':
        if (agent) {
          setEditingAgent(agent)
          setIsEditModalOpen(true)
        }
        break
      case 'delete':
        if (agent) {
          setAgentToDelete(agent)
        }
        break
    }
  }, [selectAgent, updateAgent, duplicateAgent, addToast])

  const handleDeleteConfirm = useCallback(() => {
    if (agentToDelete) {
      deleteAgent(agentToDelete.id)
      addToast(`Agent "${agentToDelete.name}" deleted`, 'success')
      setAgentToDelete(null)
    }
  }, [agentToDelete, deleteAgent, addToast])

  const handleDeleteCancel = useCallback(() => {
    setAgentToDelete(null)
  }, [])

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setEditingAgent(null)
  }, [])

  return {
    handleAgentAction,
    editingAgent,
    isEditModalOpen,
    closeEditModal,
    agentToDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
  }
}

function App() {
  const agents = useAppStore((state) => state.agents)
  const selectedAgentId = useAppStore((state) => state.selectedAgentId)
  const lastSearchQuery = useAppStore((state) => state.lastSearchQuery)
  const setLastSearchQuery = useAppStore((state) => state.setLastSearchQuery)
  const agentSortBy = useAppStore((state) => state.agentSortBy)
  const agentSortOrder = useAppStore((state) => state.agentSortOrder)
  const setAgentSortBy = useAppStore((state) => state.setAgentSortBy)
  const setAgentSortOrder = useAppStore((state) => state.setAgentSortOrder)
  useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(lastSearchQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { filteredAgents, hasResults, resultCount } = useAgentSearch(agents, searchQuery)
  const { sortedAgents } = useAgentSort(filteredAgents, agentSortBy, agentSortOrder)
  
  const {
    handleAgentAction,
    editingAgent,
    isEditModalOpen,
    closeEditModal,
    agentToDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useAgentCallbacks(sortedAgents)

  usePlatformShortcut('k', () => {
    searchInputRef.current?.focus()
  })

  useEffect(() => {
    setLastSearchQuery(searchQuery)
  }, [searchQuery, setLastSearchQuery])

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])
  
  const handleSortChange = useCallback((sortBy: AgentSortBy) => {
    if (agentSortBy === sortBy) {
      setAgentSortOrder(agentSortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setAgentSortBy(sortBy)
      setAgentSortOrder('asc')
    }
  }, [agentSortBy, agentSortOrder, setAgentSortBy, setAgentSortOrder])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {APP.NAME}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {APP.DESCRIPTION}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={openModal} size="sm">
              <svg className={cn(iconSize.sm, 'mr-2')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {UI_TEXT.BUTTONS.ADD_AGENT}
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
            
            <div className="flex items-center gap-3">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    aria-label={UI_TEXT.LABELS.SORT_BY}
                  >
                    <svg className={iconSize.sm} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    {UI_TEXT.SORT[agentSortBy.toUpperCase() as keyof typeof UI_TEXT.SORT]}
                    <svg className={cn(iconSize.xs, agentSortOrder === 'desc' && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[140px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
                    sideOffset={5}
                    align="end"
                  >
                    {(['name', 'status', 'skills', 'tools'] as AgentSortBy[]).map((sortBy) => (
                      <DropdownMenu.Item
                        key={sortBy}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700',
                          agentSortBy === sortBy ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        )}
                        onSelect={() => handleSortChange(sortBy)}
                      >
                        {UI_TEXT.SORT[sortBy.toUpperCase() as keyof typeof UI_TEXT.SORT]}
                        {agentSortBy === sortBy && (
                          <svg className={cn(iconSize.xs, 'ml-auto', agentSortOrder === 'desc' && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              
              <SearchInput
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={UI_TEXT.PLACEHOLDERS.SEARCH_AGENTS}
                className="w-full sm:w-72"
                shortcutHint="⌘K"
              />
            </div>
          </div>
          
          {!hasResults ? (
            <EmptyState
              title={searchQuery ? UI_TEXT.EMPTY_STATE.NO_MATCHES_TITLE : UI_TEXT.EMPTY_STATE.NO_AGENTS_TITLE}
              description={
                searchQuery
                  ? UI_TEXT.EMPTY_STATE.NO_MATCHES_DESCRIPTION
                  : UI_TEXT.EMPTY_STATE.NO_AGENTS_DESCRIPTION
              }
              icon={
                <svg className={cn(iconSize.xl, colors.primary.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              actionLabel={searchQuery ? undefined : UI_TEXT.BUTTONS.CREATE_FIRST_AGENT}
              onAction={searchQuery ? undefined : openModal}
              secondaryActionLabel={searchQuery ? UI_TEXT.BUTTONS.CLEAR_SEARCH : undefined}
              onSecondaryAction={searchQuery ? () => setSearchQuery('') : undefined}
            />
          ) : (
            <div className={grid.cards}>
              {sortedAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgentId === agent.id}
                  onAction={handleAgentAction}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            {UI_TEXT.GETTING_STARTED.TITLE}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc list-inside space-y-1">
            {UI_TEXT.GETTING_STARTED.STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </main>

      <Suspense fallback={null}>
        <CreateAgentModal isOpen={isModalOpen} onClose={closeModal} />
        <EditAgentModal isOpen={isEditModalOpen} onClose={closeEditModal} agent={editingAgent} />
      </Suspense>

      <ConfirmDialog
        isOpen={agentToDelete !== null}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={UI_TEXT.DIALOG.DELETE_AGENT_TITLE}
        message={UI_TEXT.DIALOG.DELETE_AGENT_MESSAGE.replace('{name}', agentToDelete?.name || '')}
        confirmLabel={UI_TEXT.BUTTONS.DELETE}
        cancelLabel={UI_TEXT.BUTTONS.CANCEL}
        variant="danger"
      />
    </div>
  )
}

export default App
