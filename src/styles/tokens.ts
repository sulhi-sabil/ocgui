/**
 * Design Tokens - Centralized design system constants
 * This eliminates hardcoded values and ensures consistency across the UI
 */

export const colors = {
  primary: {
    50: 'bg-blue-50 dark:bg-blue-900/20',
    100: 'bg-blue-100 dark:bg-blue-900/30',
    500: 'border-blue-500 dark:border-blue-400',
    600: 'bg-blue-600 hover:bg-blue-700',
    text: 'text-blue-600 dark:text-blue-400',
    textLight: 'text-blue-900 dark:text-blue-100',
  },
  gray: {
    50: 'bg-gray-50 dark:bg-gray-900',
    100: 'bg-gray-100 dark:bg-gray-700',
    200: 'border-gray-200 dark:border-gray-700',
    300: 'border-gray-300 dark:border-gray-600',
    400: 'text-gray-400',
    500: 'text-gray-500 dark:text-gray-400',
    600: 'text-gray-600 dark:text-gray-400',
    700: 'border-gray-700 dark:border-gray-600',
    800: 'text-gray-800 dark:text-gray-200',
    900: 'text-gray-900 dark:text-white',
  },
  white: 'bg-white dark:bg-gray-800',
  status: {
    enabled: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    disabled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  },
} as const

export const spacing = {
  container: 'max-w-7xl mx-auto px-4',
  section: 'py-6',
  header: 'py-4',
  card: 'p-4',
  cardLarge: 'p-8',
  cardXLarge: 'p-12',
} as const

export const borders = {
  default: 'rounded-lg',
  full: 'rounded-full',
  card: 'rounded-lg border',
  cardDashed: 'rounded-lg border border-dashed',
} as const

export const transitions = {
  default: 'transition-all duration-200 ease-in-out',
  colors: 'transition-colors',
  transform: 'transition-transform duration-200 ease-in-out',
} as const

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
} as const

export const typography = {
  h1: 'text-2xl font-bold',
  h2: 'text-lg font-semibold',
  h3: 'text-lg font-medium',
  body: 'text-sm',
  small: 'text-xs',
} as const

export const focus = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
} as const
