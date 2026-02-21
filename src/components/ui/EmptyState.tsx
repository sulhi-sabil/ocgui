import { memo } from 'react'
import { Button } from './Button'
import { cn } from '@utils/cn'
import { colors, spacing, borders, typography } from '@styles/tokens'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
}

function EmptyStateComponent({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        colors.white,
        borders.default,
        spacing.cardXLarge,
        'text-center',
        'border-dashed',
        colors.gray[300],
        className
      )}
    >
      {icon && (
        <div className={cn(
          'mx-auto mb-4',
          colors.primary[100],
          borders.full,
          'flex items-center justify-center',
          'w-16 h-16'
        )}>
          {icon}
        </div>
      )}
      
      <h3 className={cn(typography.h3, colors.gray[900], 'mb-2')}>
        {title}
      </h3>
      
      <p className={cn(colors.gray[500], 'mb-6 max-w-sm mx-auto')}>
        {description}
      </p>
      
      <div className="flex items-center justify-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="secondary">
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)
