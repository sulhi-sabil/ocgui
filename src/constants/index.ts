/**
 * Application-wide constants
 * Centralized configuration values for consistent behavior across the application
 */

export const TOAST = {
  DEFAULT_DURATION_MS: 5000,
  MAX_VISIBLE: 5,
} as const

export const ANIMATION = {
  DEFAULT_DURATION_MS: 200,
  FAST_DURATION_MS: 150,
  SLOW_DURATION_MS: 300,
} as const

export const MODAL = {
  FOCUS_DELAY_MS: 50,
  DEFAULT_MAX_WIDTH: 'max-w-md',
} as const

export const SEARCH = {
  DEBOUNCE_MS: 300,
  MIN_QUERY_LENGTH: 2,
} as const

export const AGENT = {
  DEFAULT_MODEL: undefined,
  NAME_COPY_SUFFIX: ' (Copy)',
} as const

export const APP = {
  NAME: 'OpenCode GUI',
  DESCRIPTION: 'Desktop Control Center for OpenCode CLI',
  MAX_CONTENT_WIDTH: 'max-w-7xl',
} as const

export const SECURITY = {
  MAX_ID_LENGTH: 256,
  MAX_NAME_LENGTH: 256,
  MAX_DESCRIPTION_LENGTH: 2048,
  MAX_PATH_LENGTH: 4096,
  MAX_INPUT_LENGTH: 100000,
  MAX_QUERY_LIMIT: 10000,
  // eslint-disable-next-line no-control-regex
  DANGEROUS_CHARS_PATTERN: /[\x00-\x08\x0B\x0C\x0E-\x1F]/g,
  PATH_TRAVERSAL_PATTERN: /\.\./,
  ALLOWED_PROTOCOLS: ['file:', 'http:', 'https:'],
} as const
