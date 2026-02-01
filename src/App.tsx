import { useAppStore } from '@store/index'
import { AgentCard } from '@components/AgentCard'

function App() {
  const { agents, selectedAgentId, selectAgent } = useAppStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            OpenCode GUI
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Desktop Control Center for OpenCode CLI
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Agents ({agents.length})
          </h2>
          
          {agents.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400">
                No agents configured yet. Add your first agent to get started.
              </p>
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
    </div>
  )
}

export default App
