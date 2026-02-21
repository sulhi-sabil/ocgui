export { cn } from './cn'

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
