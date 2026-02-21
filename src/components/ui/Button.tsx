import { cn } from '@utils/cn'
import { focus, transitions, colors, iconSize } from '@styles/tokens'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: `${colors.primary[600]} text-white`,
    secondary: `${colors.gray[100]} hover:bg-gray-200 ${colors.gray[900]} dark:hover:bg-gray-600 dark:text-white`,
    ghost: `hover:bg-gray-100 dark:hover:bg-gray-700 ${colors.gray[600]}`,
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  
  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        focus.ringVisible,
        transitions.colors,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className={cn('animate-spin -ml-1 mr-2', iconSize.sm)} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
