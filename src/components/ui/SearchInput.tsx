import { memo, forwardRef } from 'react'
import { cn } from '@utils/cn'
import { formInput, focus, transitions, iconSize } from '@styles/tokens'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  shortcutHint?: string
}

const SearchInputComponent = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, placeholder = 'Search...', className, shortcutHint = '⌘K' }, ref) => {
    return (
      <div className={cn('relative', className)}>
        <svg
          className={cn('absolute left-3 top-1/2 -translate-y-1/2', iconSize.md, 'text-gray-400')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-2',
            formInput.default,
            formInput.placeholder,
            focus.ring,
            transitions.colors
          )}
        />

        {value ? (
          <button
            onClick={() => onChange('')}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400',
              'hover:text-gray-600 dark:hover:text-gray-300',
              transitions.colors,
              'rounded-full p-0.5',
              'hover:bg-gray-100 dark:hover:bg-gray-600'
            )}
            aria-label="Clear search"
            type="button"
          >
            <svg className={iconSize.sm} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : shortcutHint ? (
          <span 
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400',
              'border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5',
              'hidden sm:block select-none'
            )}
            aria-hidden="true"
          >
            {shortcutHint}
          </span>
        ) : null}
      </div>
    )
  }
)

SearchInputComponent.displayName = 'SearchInput'

export const SearchInput = memo(SearchInputComponent)
