/**
 * Utility functions for common operations
 */

/**
 * Generate a unique ID
 */
import { ID_RANDOM_LENGTH } from '@config/constants'

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, ID_RANDOM_LENGTH + 2)}`
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
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
  
  if (a.tools && typeof a.tools !== 'object') {
    errors.push('Agent tools must be an object')
  }
  
  if (a.permissions && typeof a.permissions !== 'object') {
    errors.push('Agent permissions must be an object')
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
