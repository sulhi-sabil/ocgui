import { useEffect, useCallback } from 'react'
import { Button } from './Button'
import { cn } from '@utils/cn'
import { modal, zIndex, focus } from '@styles/tokens'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel()
  }, [onCancel])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
  }

  return (
    <div
      className={cn(modal.backdrop, zIndex.modal)}
      onClick={handleBackdropClick}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className={modal.container}>
        <h2 id="confirm-title" className={modal.title}>
          {title}
        </h2>
        
        <p id="confirm-message" className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'flex-1 inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm transition-colors',
              focus.ringVisible,
              variantStyles[variant]
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
