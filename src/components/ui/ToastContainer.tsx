import { cn } from '@utils/cn'
import { Toast, ToastType } from './ToastProvider'
import { useToast } from './useToast'
import { colors, zIndex, iconSize, typography, animations } from '@styles/tokens'

interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const styles: Record<ToastType, string> = {
    success: colors.success.bg,
    error: colors.error.bg,
    warning: colors.warning.bg,
    info: colors.info.bg,
  }

  const icons: Record<ToastType, React.ReactNode> = {
    success: (
      <svg className={iconSize.md} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className={iconSize.md} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className={iconSize.md} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className={iconSize.md} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md',
        animations.slideIn,
        styles[toast.type]
      )}
      role="alert"
    >
      {icons[toast.type]}
      <span className={cn('flex-1', typography.body, 'font-medium')}>{toast.message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Close notification"
      >
        <svg className={iconSize.sm} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className={cn('fixed bottom-4 right-4', zIndex.toast, 'flex flex-col gap-2')}>
      {toasts.map((toast: Toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}
