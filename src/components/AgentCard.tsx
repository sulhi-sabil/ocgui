import { memo } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { Agent } from '../types'
import { cn } from '@utils/cn'
import { formatRelativeTime } from '@utils/index'
import { colors, spacing, borders, transitions, shadows, iconSize, strokeWidth } from '@styles/tokens'

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onSelect: () => void
  onToggleEnabled?: () => void
  onDuplicate?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function AgentCardComponent({ agent, isSelected, onSelect, onToggleEnabled, onDuplicate, onEdit, onDelete }: AgentCardProps) {
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
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-medium truncate', colors.gray[900])}>
            {agent.name}
          </h3>
          <p className={cn('text-sm mt-1 line-clamp-2', colors.gray[500])}>
            {agent.description}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleEnabled?.()
            }}
            className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors',
              agent.enabled ? colors.status.enabled : colors.status.disabled,
              onToggleEnabled && 'hover:opacity-80 cursor-pointer'
            )}
            disabled={!onToggleEnabled}
            title={onToggleEnabled ? `Click to ${agent.enabled ? 'disable' : 'enable'} agent` : undefined}
          >
            <span className={cn(
              'w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0',
              agent.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            )} />
            {agent.enabled ? 'Enabled' : 'Disabled'}
          </button>
          
          {(onDuplicate || onEdit || onDelete) && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Agent actions"
                >
                  <svg className={cn(iconSize.sm, colors.gray[500])} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[140px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
                  sideOffset={5}
                  align="end"
                >
                  {onEdit && (
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                      onSelect={(e) => {
                        e.preventDefault()
                        onEdit()
                      }}
                    >
                      <svg className={iconSize.sm} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </DropdownMenu.Item>
                  )}
                  {onDuplicate && (
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                      onSelect={(e) => {
                        e.preventDefault()
                        onDuplicate()
                      }}
                    >
                      <svg className={iconSize.sm} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicate
                    </DropdownMenu.Item>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded cursor-pointer outline-none hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                        onSelect={(e) => {
                          e.preventDefault()
                          onDelete()
                        }}
                      >
                        <svg className={iconSize.sm} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth.default} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </DropdownMenu.Item>
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
      </div>
      
      {agent.tags && agent.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {agent.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{agent.tags.length - 3} more
            </span>
          )}
        </div>
      )}
      
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
          {agent.createdAt && (
            <>
              <span>•</span>
              <span title={new Date(agent.createdAt).toLocaleString()}>
                Created {formatRelativeTime(agent.createdAt)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const AgentCard = memo(AgentCardComponent)
