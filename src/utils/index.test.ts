import { describe, it, expect } from 'vitest'
import { generateId, formatDate, deepClone, validateAgent, validateSkill, mergeConfig } from './index'

describe('generateId', () => {
  it('should generate a unique ID string', () => {
    const id1 = generateId()
    const id2 = generateId()
    
    expect(id1).toBeDefined()
    expect(typeof id1).toBe('string')
    expect(id1).not.toBe(id2)
  })

  it('should include timestamp in the ID', () => {
    const before = Date.now()
    const id = generateId()
    const after = Date.now()
    
    const timestampPart = parseInt(id.split('-')[0], 10)
    expect(timestampPart).toBeGreaterThanOrEqual(before)
    expect(timestampPart).toBeLessThanOrEqual(after)
  })

  it('should have a random suffix', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      const id = generateId()
      const suffix = id.split('-')[1]
      ids.add(suffix)
    }
    
    expect(ids.size).toBe(100)
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

  it('should preserve Date objects', () => {
    const date = new Date('2024-01-15T12:30:00')
    const original = { date, name: 'test' }
    const cloned = deepClone(original)
    
    expect(cloned.date).toBeInstanceOf(Date)
    expect(cloned.date.getTime()).toBe(date.getTime())
    expect(cloned.date).not.toBe(date)
  })

  it('should return primitives as-is', () => {
    expect(deepClone('string')).toBe('string')
    expect(deepClone(123)).toBe(123)
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
  })

  it('should handle circular references gracefully', () => {
    const original: Record<string, unknown> = { name: 'test' }
    original.self = original
    
    expect(() => deepClone(original)).not.toThrow()
    
    const cloned = deepClone(original)
    expect(cloned.name).toBe('test')
    expect(typeof cloned.self).toBe('object')
  })

  it('should handle empty objects', () => {
    const cloned = deepClone({})
    expect(cloned).toEqual({})
  })

  it('should handle empty arrays', () => {
    const cloned = deepClone([])
    expect(cloned).toEqual([])
  })
})

describe('validateAgent', () => {
  it('should return valid for a proper agent', () => {
    const agent = {
      id: 'test-id',
      name: 'Test Agent',
      description: 'A test agent',
      tools: {},
      permissions: {},
      skills: ['skill-1'],
      enabled: true,
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

  it('should fail for missing description', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      skills: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string description')
  })

  it('should fail for non-string description', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 123,
      skills: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a string description')
  })

  it('should fail for missing skills array', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a skills array')
  })

  it('should fail for non-array skills', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: 'not-an-array',
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a skills array')
  })

  it('should fail for non-string skill items', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: ['valid', 123, 'also-valid'],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent skills must be strings')
  })

  it('should accept empty skills array', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for missing enabled boolean', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have an enabled boolean')
  })

  it('should fail for non-boolean enabled', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
      enabled: 'true',
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have an enabled boolean')
  })

  it('should accept enabled: false', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
      enabled: false,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })
})

describe('validateSkill', () => {
  it('should return valid for a proper skill', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test Skill',
      description: 'A test skill',
      content: 'skill content',
      commands: ['/test'],
      path: '/path/to/skill',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail for null input', () => {
    const result = validateSkill(null)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must be an object')
  })

  it('should fail for non-object input', () => {
    const result = validateSkill('not an object')
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must be an object')
  })

  it('should fail for missing id', () => {
    const skill = {
      name: 'Test Skill',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string id')
  })

  it('should fail for missing name', () => {
    const skill = {
      id: 'skill-id',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string name')
  })

  it('should fail for non-string id', () => {
    const skill = {
      id: 123,
      name: 'Test',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string id')
  })

  it('should fail for missing description', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      content: 'content',
      commands: [],
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string description')
  })

  it('should fail for non-string description', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 123,
      content: 'content',
      commands: [],
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string description')
  })

  it('should fail for missing content', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      commands: [],
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string content')
  })

  it('should fail for non-string content', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      content: 123,
      commands: [],
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string content')
  })

  it('should fail for missing commands array', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      content: 'content',
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a commands array')
  })

  it('should fail for non-array commands', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      content: 'content',
      commands: 'not-an-array',
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a commands array')
  })

  it('should fail for non-string command items', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      content: 'content',
      commands: ['/valid', 123, '/also-valid'],
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill commands must be strings')
  })

  it('should accept empty commands array', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      content: 'content',
      commands: [],
      path: '/path',
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for missing path', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      content: 'content',
      commands: [],
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string path')
  })

  it('should fail for non-string path', () => {
    const skill = {
      id: 'skill-id',
      name: 'Test',
      description: 'A test',
      content: 'content',
      commands: [],
      path: 123,
    }
    
    const result = validateSkill(skill)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Skill must have a string path')
  })

  it('should collect multiple errors', () => {
    const skill = {
      commands: 'invalid',
      path: 123,
    }
    
    const result = validateSkill(skill)
    
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
