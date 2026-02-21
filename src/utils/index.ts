/**
 * Utility functions for common operations
 */

const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype']

/**
 * Generate a unique ID using cryptographically secure random
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Sanitize string input to prevent XSS
 * Removes control characters and trims whitespace
 */
export function sanitize(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return ''
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
}

/**
 * Check if a key is safe for object assignment (prevents prototype pollution)
 */
export function isSafeKey(key: string): boolean {
  return !DANGEROUS_KEYS.includes(key)
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * Deep clone an object safely (prevents prototype pollution)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }
  
  const cloned: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    if (isSafeKey(key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key])
    }
  }
  return cloned as T
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
