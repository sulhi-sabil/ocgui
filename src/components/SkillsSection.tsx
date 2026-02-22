import { EmptyState } from './ui'
import { iconSize, colors } from '@styles/tokens'
import { cn } from '@utils/cn'

export function SkillsSection() {
  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Skills
        </h2>
      </div>
      
      <EmptyState
        title="Skills coming soon"
        description="Skills are specialized capabilities that agents can use to perform specific tasks. This feature is currently in development."
        icon={
          <svg className={cn(iconSize.xl, colors.primary.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        }
      />
    </div>
  )
}
