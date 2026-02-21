import { describe, it, expect } from 'vitest'
import { generateId, formatDate, deepClone, validateAgent, mergeConfig } from './index'

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it('should generate an ID with timestamp prefix', () => {
    const before = Date.now()
    const id = generateId()
    const timestamp = parseInt(id.split('-')[0], 10)
    expect(timestamp).toBeGreaterThanOrEqual(before)
    expect(timestamp).toBeLessThanOrEqual(Date.now())
  })

  it('should generate an ID with random suffix', () => {
    const id = generateId()
    const parts = id.split('-')
    expect(parts.length).toBe(2)
    expect(parts[1].length).toBe(9)
  })
})

describe('formatDate', () => {
  it('should format a timestamp to locale string', () => {
    const timestamp = 1700000000000
    const result = formatDate(timestamp)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle current timestamp', () => {
    const result = formatDate(Date.now())
    expect(typeof result).toBe('string')
  })
})

describe('deepClone', () => {
  it('should deeply clone an object', () => {
    const original = { a: 1, b: { c: 2 } }
    const cloned = deepClone(original)
    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned.b).not.toBe(original.b)
  })

  it('should clone arrays', () => {
    const original = [1, [2, 3], { a: 4 }]
    const cloned = deepClone(original)
    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned[1]).not.toBe(original[1])
  })

  it('should handle primitive values', () => {
    expect(deepClone('string')).toBe('string')
    expect(deepClone(123)).toBe(123)
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
  })
})

describe('validateAgent', () => {
  it('should validate a valid agent', () => {
    const agent = {
      id: 'test-id',
      name: 'Test Agent',
      tools: {},
      permissions: {},
    }
    const result = validateAgent(agent)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail for null/undefined', () => {
    expect(validateAgent(null).valid).toBe(false)
    expect(validateAgent(undefined).valid).toBe(false)
  })

  it('should fail for non-object values', () => {
    expect(validateAgent('string').valid).toBe(false)
    expect(validateAgent(123).valid).toBe(false)
  })

  it('should fail for missing id', () => {
    const result = validateAgent({ name: 'Test' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string id')
  })

  it('should fail for missing name', () => {
    const result = validateAgent({ id: 'test-id' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string name')
  })

  it('should fail for invalid tools type', () => {
    const result = validateAgent({ id: 'test', name: 'Test', tools: 'invalid' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent tools must be an object')
  })

  it('should fail for invalid permissions type', () => {
    const result = validateAgent({ id: 'test', name: 'Test', permissions: 'invalid' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent permissions must be an object')
  })
})

describe('mergeConfig', () => {
  it('should merge override into base', () => {
    const base = { a: 1, b: 2 }
    const override = { b: 3, c: 4 }
    const result = mergeConfig(base, override)
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should return base when override is empty', () => {
    const base = { a: 1, b: 2 }
    const result = mergeConfig(base, {})
    expect(result).toEqual(base)
  })

  it('should handle partial overrides', () => {
    const base = { a: 1, b: 2, c: 3 }
    const result = mergeConfig(base, { b: 99 })
    expect(result).toEqual({ a: 1, b: 99, c: 3 })
  })
})
