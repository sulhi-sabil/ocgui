import type { Agent } from '../types'
import { cn } from '@utils/cn'
import { colors, spacing, borders, transitions, shadows } from '@styles/tokens'

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onSelect: () => void
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer',
        spacing.card,
        borders.card,
        transitions.default,
        isSelected 
          ? `${colors.primary[500]} ${colors.primary[50]} scale-[1.02] ${shadows.md}` 
          : `${colors.gray[200]} ${colors.white} hover:border-gray-300 dark:hover:border-gray-600 hover:${shadows.md} hover:-translate-y-0.5`
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className={cn('font-medium', colors.gray[900])}>
            {agent.name}
          </h3>
          <p className={cn('text-sm mt-1 line-clamp-2', colors.gray[500])}>
            {agent.description}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            agent.enabled ? colors.status.enabled : colors.status.disabled
          )}
        >
          {agent.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className={cn('flex items-center text-xs space-x-3', colors.gray[500])}>
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
