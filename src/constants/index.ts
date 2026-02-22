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

export const SKILL = {
  NAME_COPY_SUFFIX: ' (Copy)',
} as const

export const STORAGE = {
  KEY: 'ocgui-storage',
} as const

export const APP = {
  NAME: 'OpenCode GUI',
  DESCRIPTION: 'Desktop Control Center for OpenCode CLI',
  MAX_CONTENT_WIDTH: 'max-w-7xl',
} as const

export const UI_TEXT = {
  BUTTONS: {
    ADD_AGENT: 'Add Agent',
    CREATE_AGENT: 'Create Agent',
    CREATE_FIRST_AGENT: 'Create Your First Agent',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    DUPLICATE: 'Duplicate',
    EDIT: 'Edit',
    CLEAR_SEARCH: 'Clear Search',
    SAVE_CHANGES: 'Save Changes',
  },
  PLACEHOLDERS: {
    SEARCH_AGENTS: 'Search agents...',
    AGENT_NAME: 'e.g., Code Reviewer',
    AGENT_DESCRIPTION: 'Describe what this agent does...',
    AGENT_MODEL: 'e.g., gpt-4, claude-3-opus',
    AGENT_TAGS: 'e.g., code-review, testing, documentation',
  },
  LABELS: {
    AGENT_NAME: 'Name',
    AGENT_DESCRIPTION: 'Description',
    AGENT_MODEL: 'Model Override (optional)',
    AGENT_TAGS: 'Tags (optional)',
    REQUIRED: '*',
  },
  HINTS: {
    MODEL_DEFAULT: 'Leave empty to use default model from config',
    TAGS_FORMAT: 'Comma-separated tags for categorization',
  },
  ERRORS: {
    NAME_REQUIRED: 'Name is required',
    DESCRIPTION_REQUIRED: 'Description is required',
  },
  MODAL: {
    CREATE_AGENT_TITLE: 'Create New Agent',
    EDIT_AGENT_TITLE: 'Edit Agent',
  },
  DIALOG: {
    DELETE_AGENT_TITLE: 'Delete Agent',
    DELETE_AGENT_MESSAGE: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
  },
  EMPTY_STATE: {
    NO_AGENTS_TITLE: 'No agents yet',
    NO_AGENTS_DESCRIPTION: 'Get started by creating your first agent. Agents help you automate tasks and orchestrate workflows.',
    NO_MATCHES_TITLE: 'No matching agents found',
    NO_MATCHES_DESCRIPTION: 'Try adjusting your search terms or clear the filter to see all agents.',
  },
  GETTING_STARTED: {
    TITLE: 'Getting Started',
    STEPS: [
      'Configure your OpenCode CLI workspace',
      'Import existing agents from AGENTS.md',
      'Set up skill compositions and tool permissions',
      'Execute and monitor agent runs',
    ],
  },
  TAGS: {
    MORE: '+{count} more',
  },
} as const
