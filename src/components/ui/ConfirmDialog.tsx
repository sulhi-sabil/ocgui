import { useEffect, useCallback, useRef } from 'react'
import { Button } from './Button'
import { cn } from '@utils/cn'
import { zIndex, modal, focus } from '@styles/tokens'
import { MODAL } from '@constants/index'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      const focusTimeout = setTimeout(() => confirmButtonRef.current?.focus(), MODAL.FOCUS_DELAY_MS)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
        clearTimeout(focusTimeout)
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
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
        <p id="confirm-message" className={cn('text-gray-600 dark:text-gray-400 mb-6')}>
          {message}
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            {cancelLabel}
          </Button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={handleConfirm}
            className={cn(
              'flex-1 inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm',
              variantStyles[variant],
              focus.ringVisible
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
