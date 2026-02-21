import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateId, formatDate, deepClone, validateAgent, mergeConfig } from './index'

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it('should return a string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
  })

  it('should contain a timestamp and random part', () => {
    const id = generateId()
    const parts = id.split('-')
    expect(parts.length).toBeGreaterThanOrEqual(2)
    expect(parts[0]).toMatch(/^\d+$/)
  })

  it('should generate IDs that are reasonably unique across multiple calls', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(100)
  })
})

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should format a timestamp to locale string', () => {
    const timestamp = new Date('2024-01-15T10:30:00.000Z').getTime()
    const result = formatDate(timestamp)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle epoch timestamp', () => {
    const result = formatDate(0)
    expect(typeof result).toBe('string')
  })

  it('should handle current timestamp', () => {
    const now = Date.now()
    const result = formatDate(now)
    expect(typeof result).toBe('string')
  })
})

describe('deepClone', () => {
  it('should create a deep copy of an object', () => {
    const original = { a: 1, b: { c: 2 } }
    const clone = deepClone(original)
    
    expect(clone).toEqual(original)
    expect(clone).not.toBe(original)
    expect(clone.b).not.toBe(original.b)
  })

  it('should create a deep copy of an array', () => {
    const original = [1, [2, 3], { a: 4 }]
    const clone = deepClone(original)
    
    expect(clone).toEqual(original)
    expect(clone).not.toBe(original)
    expect(clone[1]).not.toBe(original[1])
    expect(clone[2]).not.toBe(original[2])
  })

  it('should handle primitive values', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('string')).toBe('string')
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
  })

  it('should handle nested structures', () => {
    const original = {
      level1: {
        level2: {
          level3: {
            value: 'deep'
          }
        }
      }
    }
    const clone = deepClone(original)
    
    clone.level1.level2.level3.value = 'modified'
    expect(original.level1.level2.level3.value).toBe('deep')
  })
})

describe('validateAgent', () => {
  it('should return valid for a correct agent object', () => {
    const agent = {
      id: 'test-id',
      name: 'Test Agent',
      description: 'A test agent',
      tools: {},
      permissions: {},
      skills: [],
      enabled: true
    }
    
    const result = validateAgent(agent)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should return invalid for null', () => {
    const result = validateAgent(null)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must be an object')
  })

  it('should return invalid for undefined', () => {
    const result = validateAgent(undefined)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must be an object')
  })

  it('should return invalid for non-object types', () => {
    const result = validateAgent('string')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must be an object')
  })

  it('should return invalid when id is missing', () => {
    const agent = { name: 'Test Agent' }
    const result = validateAgent(agent)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string id')
  })

  it('should return invalid when id is not a string', () => {
    const agent = { id: 123, name: 'Test Agent' }
    const result = validateAgent(agent)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string id')
  })

  it('should return invalid when name is missing', () => {
    const agent = { id: 'test-id' }
    const result = validateAgent(agent)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string name')
  })

  it('should return invalid when name is not a string', () => {
    const agent = { id: 'test-id', name: 123 }
    const result = validateAgent(agent)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string name')
  })

  it('should return invalid when tools is not an object', () => {
    const agent = { id: 'test-id', name: 'Test', tools: 'invalid' }
    const result = validateAgent(agent)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent tools must be an object')
  })

  it('should return invalid when permissions is not an object', () => {
    const agent = { id: 'test-id', name: 'Test', permissions: 'invalid' }
    const result = validateAgent(agent)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent permissions must be an object')
  })

  it('should accumulate multiple errors', () => {
    const agent = { tools: 'invalid', permissions: [] }
    const result = validateAgent(agent)
    expect(result.errors.length).toBeGreaterThanOrEqual(2)
  })
})

describe('mergeConfig', () => {
  it('should merge override values into base config', () => {
    const base = { a: 1, b: 2, c: 3 }
    const override = { b: 20 }
    
    const result = mergeConfig(base, override)
    expect(result).toEqual({ a: 1, b: 20, c: 3 })
  })

  it('should return a new object without modifying base', () => {
    const base = { a: 1, b: 2 }
    const override = { b: 20 }
    
    mergeConfig(base, override)
    expect(base.b).toBe(2)
  })

  it('should add new properties from override', () => {
    const base = { a: 1 }
    const override = { b: 2, c: 3 } as Partial<{ a: number; b: number; c: number }>
    
    const result = mergeConfig({ ...base, b: 0, c: 0 }, override)
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle empty override', () => {
    const base = { a: 1, b: 2 }
    const result = mergeConfig(base, {})
    expect(result).toEqual(base)
  })

  it('should override with undefined values', () => {
    const base = { a: 1, b: 2 }
    const override = { b: undefined as unknown as number }
    
    const result = mergeConfig(base, override)
    expect(result).toEqual({ a: 1, b: undefined })
  })
})
