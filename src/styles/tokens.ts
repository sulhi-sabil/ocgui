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
  error: {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500 text-white',
  },
  success: {
    bg: 'bg-green-500 text-white',
  },
  warning: {
    bg: 'bg-yellow-500 text-white',
  },
  info: {
    bg: 'bg-blue-500 text-white',
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
  ringVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800',
} as const

export const animations = {
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  fadeIn: 'animate-fadeIn',
  slideIn: 'animate-slideIn',
} as const

export const skeleton = {
  base: 'bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
  text: 'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
  title: 'h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
  card: 'h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse',
  circle: 'w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse',
} as const

export const zIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modalBackdrop: 'z-40',
  modal: 'z-50',
  popover: 'z-60',
  tooltip: 'z-70',
  toast: 'z-50',
} as const

export const formInput = {
  base: 'w-full px-3 py-2 border rounded-lg transition-colors',
  default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
  focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  error: 'border-red-500 dark:border-red-400',
  placeholder: 'placeholder:text-gray-400 dark:placeholder:text-gray-500',
}

export const label = {
  base: 'block text-sm font-medium mb-1',
  default: 'text-gray-700 dark:text-gray-300',
}

export const modal = {
  backdrop: 'fixed inset-0 flex items-center justify-center p-4 bg-black/50',
  container: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6',
  title: 'text-xl font-semibold text-gray-900 dark:text-white',
}

export const overlay = {
  backdrop: 'fixed inset-0 bg-black/50',
}

export const iconSize = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const

export const strokeWidth = {
  thin: 1,
  default: 2,
  thick: 3,
  spinner: 4,
} as const

export const toast = {
  minWidth: 'min-w-[300px]',
  maxWidth: 'max-w-md',
} as const

export const grid = {
  cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
} as const
