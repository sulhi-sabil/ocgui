import type { Agent } from '../types'

export { cn } from './cn'

export interface AgentTemplate {
  name: string
  description: string
  defaultTools: Record<string, string>
  defaultPermissions: Record<string, string>
  suggestedSkills: string[]
  defaultTags: string[]
}

/**
 * Utility functions for common operations
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * Deep clone an object with proper handling for Dates and error recovery
 */
export function deepClone<T>(obj: T): T {
  return deepCloneInternal(obj, new WeakSet())
}

function deepCloneInternal<T>(obj: T, visited: WeakSet<object>): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (visited.has(obj as object)) {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (Array.isArray(obj)) {
    visited.add(obj)
    return obj.map((item) => deepCloneInternal(item, visited)) as T
  }

  try {
    visited.add(obj as object)
    const cloned: Record<string, unknown> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepCloneInternal((obj as Record<string, unknown>)[key], visited)
      }
    }
    return cloned as T
  } catch {
    return obj
  }
}

/**
 * Validate agent configuration
 */
export function validateAgent(agent: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!agent || typeof agent !== 'object') {
    errors.push('Agent must be an object')
    return { valid: false, errors }
  }
  
  const a = agent as Record<string, unknown>
  
  if (!a.id || typeof a.id !== 'string') {
    errors.push('Agent must have a string id')
  }
  
  if (!a.name || typeof a.name !== 'string') {
    errors.push('Agent must have a string name')
  }
  
  if (a.description === undefined || typeof a.description !== 'string') {
    errors.push('Agent must have a string description')
  }
  
  if (a.tools && typeof a.tools !== 'object') {
    errors.push('Agent tools must be an object')
  }
  
  if (a.permissions && typeof a.permissions !== 'object') {
    errors.push('Agent permissions must be an object')
  }
  
  if (!Array.isArray(a.skills)) {
    errors.push('Agent must have a skills array')
  } else {
    const invalidSkills = a.skills.filter(s => typeof s !== 'string')
    if (invalidSkills.length > 0) {
      errors.push('Agent skills must be strings')
    }
  }
  
  if (!Array.isArray(a.tags)) {
    errors.push('Agent must have a tags array')
  } else {
    const invalidTags = a.tags.filter(t => typeof t !== 'string')
    if (invalidTags.length > 0) {
      errors.push('Agent tags must be strings')
    }
  }
  
  if (typeof a.enabled !== 'boolean') {
    errors.push('Agent must have an enabled boolean')
  }
  
  return { valid: errors.length === 0, errors }
}

/**
 * Merge configurations
 */
export function mergeConfig<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>
): T {
  return { ...base, ...override }
}

export const AGENT_TEMPLATES: Record<string, AgentTemplate> = {
  codeReviewer: {
    name: 'Code Reviewer',
    description: 'Reviews code for quality, security, and best practices',
    defaultTools: {
      read: 'allow',
      grep: 'allow',
      glob: 'allow',
    },
    defaultPermissions: {
      file: 'read',
    },
    suggestedSkills: ['code-review', 'security-analysis'],
    defaultTags: ['code-quality', 'review'],
  },
  testWriter: {
    name: 'Test Writer',
    description: 'Generates unit tests and integration tests for code',
    defaultTools: {
      read: 'allow',
      write: 'allow',
      bash: 'allow',
    },
    defaultPermissions: {
      file: 'write',
      execute: 'ask',
    },
    suggestedSkills: ['testing', 'test-coverage'],
    defaultTags: ['testing', 'quality'],
  },
  documentationAgent: {
    name: 'Documentation Agent',
    description: 'Creates and maintains project documentation',
    defaultTools: {
      read: 'allow',
      write: 'allow',
      glob: 'allow',
    },
    defaultPermissions: {
      file: 'write',
    },
    suggestedSkills: ['documentation', 'markdown'],
    defaultTags: ['documentation', 'content'],
  },
  devopsAgent: {
    name: 'DevOps Agent',
    description: 'Manages CI/CD pipelines and infrastructure',
    defaultTools: {
      bash: 'allow',
      read: 'allow',
      write: 'allow',
    },
    defaultPermissions: {
      execute: 'ask',
      file: 'write',
      network: 'ask',
    },
    suggestedSkills: ['ci-cd', 'docker', 'kubernetes'],
    defaultTags: ['devops', 'infrastructure'],
  },
}

export function createAgentFromTemplate(
  templateKey: keyof typeof AGENT_TEMPLATES,
  overrides?: Partial<Agent>
): Agent {
  const template = AGENT_TEMPLATES[templateKey]
  
  return {
    id: generateId(),
    name: template.name,
    description: template.description,
    tools: { ...template.defaultTools },
    permissions: { ...template.defaultPermissions },
    skills: [...template.suggestedSkills],
    tags: [...template.defaultTags],
    enabled: true,
    ...overrides,
  }
}

export function getTemplateKeys(): string[] {
  return Object.keys(AGENT_TEMPLATES)
}
