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
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`
  if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`
  if (weeks > 0) return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  return 'just now'
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
  
  if (typeof a.createdAt !== 'number') {
    errors.push('Agent must have a number createdAt timestamp')
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
    createdAt: Date.now(),
    ...overrides,
  }
}

export function getTemplateKeys(): string[] {
  return Object.keys(AGENT_TEMPLATES)
}

/**
 * Validate skill configuration
 */
export function validateSkill(skill: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!skill || typeof skill !== 'object') {
    errors.push('Skill must be an object')
    return { valid: false, errors }
  }
  
  const s = skill as Record<string, unknown>
  
  if (!s.id || typeof s.id !== 'string') {
    errors.push('Skill must have a string id')
  }
  
  if (!s.name || typeof s.name !== 'string') {
    errors.push('Skill must have a string name')
  }
  
  if (s.description === undefined || typeof s.description !== 'string') {
    errors.push('Skill must have a string description')
  }
  
  if (s.content === undefined || typeof s.content !== 'string') {
    errors.push('Skill must have a string content')
  }
  
  if (!Array.isArray(s.commands)) {
    errors.push('Skill must have a commands array')
  } else {
    const invalidCommands = s.commands.filter(c => typeof c !== 'string')
    if (invalidCommands.length > 0) {
      errors.push('Skill commands must be strings')
    }
  }
  
  if (!s.path || typeof s.path !== 'string') {
    errors.push('Skill must have a string path')
  }
  
  return { valid: errors.length === 0, errors }
}

/**
 * Validate tool configuration
 */
export function validateTool(tool: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!tool || typeof tool !== 'object') {
    errors.push('Tool must be an object')
    return { valid: false, errors }
  }
  
  const t = tool as Record<string, unknown>
  
  if (!t.name || typeof t.name !== 'string') {
    errors.push('Tool must have a string name')
  }
  
  if (t.description === undefined || typeof t.description !== 'string') {
    errors.push('Tool must have a string description')
  }
  
  if (t.parameters && typeof t.parameters !== 'object') {
    errors.push('Tool parameters must be an object')
  }
  
  if (!['allow', 'deny', 'ask'].includes(t.permission as string)) {
    errors.push('Tool permission must be "allow", "deny", or "ask"')
  }
  
  return { valid: errors.length === 0, errors }
}

/**
 * Validate run configuration
 */
export function validateRun(run: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!run || typeof run !== 'object') {
    errors.push('Run must be an object')
    return { valid: false, errors }
  }
  
  const r = run as Record<string, unknown>
  
  if (!r.id || typeof r.id !== 'string') {
    errors.push('Run must have a string id')
  }
  
  if (!r.sessionId || typeof r.sessionId !== 'string') {
    errors.push('Run must have a string sessionId')
  }
  
  if (typeof r.timestamp !== 'number') {
    errors.push('Run must have a number timestamp')
  }
  
  if (!r.agent || typeof r.agent !== 'string') {
    errors.push('Run must have a string agent')
  }
  
  if (!r.model || typeof r.model !== 'string') {
    errors.push('Run must have a string model')
  }
  
  if (r.input === undefined || typeof r.input !== 'string') {
    errors.push('Run must have a string input')
  }
  
  if (r.output === undefined || typeof r.output !== 'string') {
    errors.push('Run must have a string output')
  }
  
  if (!Array.isArray(r.toolsUsed)) {
    errors.push('Run must have a toolsUsed array')
  } else {
    const invalidTools = r.toolsUsed.filter(t => typeof t !== 'string')
    if (invalidTools.length > 0) {
      errors.push('Run toolsUsed must be strings')
    }
  }
  
  if (typeof r.exitStatus !== 'number') {
    errors.push('Run must have a number exitStatus')
  }
  
  return { valid: errors.length === 0, errors }
}
