import type { Agent } from '../types'

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onSelect: () => void
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-md' 
          : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {agent.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {agent.description}
          </p>
        </div>
        <span
          className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${agent.enabled
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }
          `}
        >
          {agent.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
          <span>{agent.skills.length} skills</span>
          <span>•</span>
          <span>{Object.keys(agent.tools).length} tools</span>
          {agent.model && (
            <>
              <span>•</span>
              <span className="truncate max-w-[100px]">{agent.model}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
