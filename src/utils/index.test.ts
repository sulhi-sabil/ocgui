import { describe, it, expect } from 'vitest'
import { generateId, formatDate, deepClone, validateAgent, mergeConfig, sanitize, isSafeKey } from './index'

describe('generateId', () => {
  it('should generate a unique ID string', () => {
    const id1 = generateId()
    const id2 = generateId()
    
    expect(id1).toBeDefined()
    expect(typeof id1).toBe('string')
    expect(id1).not.toBe(id2)
  })

  it('should generate a valid UUID format when crypto.randomUUID is available', () => {
    const id = generateId()
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(uuidRegex.test(id)).toBe(true)
  })

  it('should generate unique IDs for multiple calls', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    
    expect(ids.size).toBe(100)
  })
})

describe('sanitize', () => {
  it('should trim whitespace from input', () => {
    expect(sanitize('  hello  ')).toBe('hello')
  })

  it('should remove control characters', () => {
    expect(sanitize('hello\x00world')).toBe('helloworld')
    expect(sanitize('test\x1Fvalue')).toBe('testvalue')
  })

  it('should truncate to maxLength', () => {
    expect(sanitize('hello world', 5)).toBe('hello')
  })

  it('should return empty string for non-string input', () => {
    expect(sanitize(null as unknown as string)).toBe('')
    expect(sanitize(undefined as unknown as string)).toBe('')
  })
})

describe('isSafeKey', () => {
  it('should return false for dangerous keys', () => {
    expect(isSafeKey('__proto__')).toBe(false)
    expect(isSafeKey('constructor')).toBe(false)
    expect(isSafeKey('prototype')).toBe(false)
  })

  it('should return true for safe keys', () => {
    expect(isSafeKey('name')).toBe(true)
    expect(isSafeKey('id')).toBe(true)
    expect(isSafeKey('value')).toBe(true)
  })
})

describe('formatDate', () => {
  it('should format a timestamp to locale string', () => {
    const timestamp = new Date('2024-01-15T12:30:00').getTime()
    const result = formatDate(timestamp)
    
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle epoch timestamp', () => {
    const result = formatDate(0)
    expect(result).toBeDefined()
  })

  it('should handle current timestamp', () => {
    const result = formatDate(Date.now())
    expect(result).toBeDefined()
  })
})

describe('deepClone', () => {
  it('should create a deep copy of an object', () => {
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
    expect(cloned[2]).not.toBe(original[2])
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
    const cloned = deepClone(original)
    
    cloned.level1.level2.level3.value = 'changed'
    
    expect(original.level1.level2.level3.value).toBe('deep')
  })

  it('should handle null values', () => {
    const original = { a: null, b: 1 }
    const cloned = deepClone(original)
    
    expect(cloned).toEqual(original)
  })

  it('should prevent prototype pollution', () => {
    const malicious = JSON.parse('{"__proto__": {"polluted": true}}')
    deepClone(malicious)
    
    expect({}.polluted).toBeUndefined()
  })

  it('should skip dangerous keys during clone', () => {
    const original = { 
      name: 'test', 
      __proto__: { polluted: true } as unknown,
      constructor: { polluted: true } as unknown,
      prototype: { polluted: true } as unknown
    }
    const cloned = deepClone(original as Record<string, unknown>)
    
    expect(cloned.name).toBe('test')
    expect(Object.keys(cloned)).not.toContain('__proto__')
    expect(Object.keys(cloned)).not.toContain('constructor')
    expect(Object.keys(cloned)).not.toContain('prototype')
  })
})

describe('validateAgent', () => {
  it('should return valid for a proper agent', () => {
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

  it('should fail for null input', () => {
    const result = validateAgent(null)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must be an object')
  })

  it('should fail for non-object input', () => {
    const result = validateAgent('not an object')
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must be an object')
  })

  it('should fail for missing id', () => {
    const agent = {
      name: 'Test Agent',
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string id')
  })

  it('should fail for missing name', () => {
    const agent = {
      id: 'test-id',
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string name')
  })

  it('should fail for non-string id', () => {
    const agent = {
      id: 123,
      name: 'Test',
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string id')
  })

  it('should fail for non-object tools', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      tools: 'not an object',
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent tools must be an object')
  })

  it('should fail for non-object permissions', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      permissions: 'not an object',
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent permissions must be an object')
  })

  it('should collect multiple errors', () => {
    const agent = {
      tools: 'invalid',
      permissions: 'invalid',
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
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

  it('should not mutate the original objects', () => {
    const base = { a: 1, b: 0 }
    const override = { b: 2 }
    
    mergeConfig(base, override)
    
    expect(base).toEqual({ a: 1, b: 0 })
    expect(override).toEqual({ b: 2 })
  })

  it('should handle undefined values in override', () => {
    const base = { a: 1, b: 2 }
    const override = { b: undefined }
    
    const result = mergeConfig(base, override)
    
    expect(result).toEqual({ a: 1, b: undefined })
  })
})
