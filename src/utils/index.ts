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
  
  if (a.version !== undefined && typeof a.version !== 'string') {
    errors.push('Agent version must be a string')
  }
  
  if (a.model !== undefined && typeof a.model !== 'string') {
    errors.push('Agent model must be a string')
  }
  
  if (a.capabilities !== undefined) {
    if (!Array.isArray(a.capabilities)) {
      errors.push('Agent capabilities must be an array')
    } else {
      const invalidCapabilities = a.capabilities.filter(c => typeof c !== 'string')
      if (invalidCapabilities.length > 0) {
        errors.push('Agent capabilities must be strings')
      }
    }
  }
  
  if (a.behavior !== undefined) {
    if (typeof a.behavior !== 'object' || Array.isArray(a.behavior)) {
      errors.push('Agent behavior must be an object')
    } else {
      const behavior = a.behavior as Record<string, unknown>
      const validKeys = ['selfHeal', 'selfLearn', 'selfEvolve', 'maximizePotential']
      for (const key of Object.keys(behavior)) {
        if (!validKeys.includes(key)) {
          errors.push(`Agent behavior has invalid key: ${key}`)
        } else if (typeof behavior[key] !== 'boolean') {
          errors.push(`Agent behavior.${key} must be a boolean`)
        }
      }
    }
  }
  
  if (a.tools && typeof a.tools !== 'object') {
    errors.push('Agent tools must be an object')
  }
  
  if (a.permissions !== undefined) {
    if (typeof a.permissions !== 'object' || Array.isArray(a.permissions)) {
      errors.push('Agent permissions must be an object')
    }
  }
  
  if (a.hooks !== undefined) {
    if (typeof a.hooks !== 'object' || Array.isArray(a.hooks)) {
      errors.push('Agent hooks must be an object')
    } else {
      const hooks = a.hooks as Record<string, unknown>
      const validHookKeys = ['preToolUse', 'postToolUse', 'userPromptSubmit', 'stop']
      for (const key of Object.keys(hooks)) {
        if (!validHookKeys.includes(key)) {
          errors.push(`Agent hooks has invalid key: ${key}`)
        } else if (!Array.isArray(hooks[key])) {
          errors.push(`Agent hooks.${key} must be an array`)
        }
      }
    }
  }
  
  if (a.mcpServers !== undefined) {
    if (!Array.isArray(a.mcpServers)) {
      errors.push('Agent mcpServers must be an array')
    } else {
      const invalidServers = a.mcpServers.filter(s => typeof s !== 'string')
      if (invalidServers.length > 0) {
        errors.push('Agent mcpServers must be strings')
      }
    }
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
  
  if (a.config !== undefined) {
    if (typeof a.config !== 'object' || Array.isArray(a.config)) {
      errors.push('Agent config must be an object')
    } else {
      const config = a.config as Record<string, unknown>
      if (config.temperature !== undefined && typeof config.temperature !== 'number') {
        errors.push('Agent config.temperature must be a number')
      }
      if (config.maxTokens !== undefined && typeof config.maxTokens !== 'number') {
        errors.push('Agent config.maxTokens must be a number')
      }
      if (config.contextWindow !== undefined && typeof config.contextWindow !== 'number') {
        errors.push('Agent config.contextWindow must be a number')
      }
      if (config.responseFormat !== undefined && !['text', 'json'].includes(config.responseFormat as string)) {
        errors.push('Agent config.responseFormat must be "text" or "json"')
      }
    }
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
