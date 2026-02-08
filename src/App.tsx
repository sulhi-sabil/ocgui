import { useEffect, useState } from 'react'
import { useAppStore } from '@store/index'
import { AgentCard } from '@components/AgentCard'
import { CreateAgentModal } from '@components/CreateAgentModal'
import { ThemeToggle } from '@components/ThemeToggle'
import { Button } from '@components/ui/Button'

function App() {
  const { agents, selectedAgentId, selectAgent, theme } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

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
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Agent
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Agents ({agents.length})
          </h2>
          
          {agents.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-dashed border-gray-300 dark:border-gray-600">
              <div className="mx-auto w-16 h-16 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No agents yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Get started by creating your first agent. Agents help you automate tasks and orchestrate workflows.
              </p>
              <Button onClick={openModal}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Agent
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgentId === agent.id}
                  onSelect={() => selectAgent(agent.id)}
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

      <CreateAgentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default App
