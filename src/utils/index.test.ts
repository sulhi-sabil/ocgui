import { describe, it, expect } from 'vitest'
import { generateId, formatDate, deepClone, validateAgent, validateSkill, validateTool, validateRun, validateRepository, mergeConfig, AGENT_TEMPLATES, createAgentFromTemplate, getTemplateKeys } from './index'

describe('generateId', () => {
  it('should generate a unique ID string', () => {
    const id1 = generateId()
    const id2 = generateId()
    
    expect(id1).toBeDefined()
    expect(typeof id1).toBe('string')
    expect(id1).not.toBe(id2)
  })

  it('should generate a valid UUID format', () => {
    const id = generateId()
    
    expect(id).toBeDefined()
    expect(typeof id).toBe('string')
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(uuidRegex.test(id)).toBe(true)
  })

  it('should generate cryptographically secure unique IDs', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
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
      tags: ['testing'],
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
      tags: [],
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
      tags: [],
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
      tags: [],
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
      tags: [],
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
      tags: [],
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
      tags: [],
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
      tags: [],
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
      tags: [],
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
      tags: [],
      enabled: false,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for missing tags array', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a tags array')
  })

  it('should fail for non-array tags', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
      tags: 'not-an-array',
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent must have a tags array')
  })

  it('should fail for non-string tag items', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
      tags: ['valid', 123, 'also-valid'],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent tags must be strings')
  })

  it('should accept empty tags array', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should accept optional version field', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      version: '1.0.0',
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-string version', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      version: 123,
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent version must be a string')
  })

  it('should accept optional capabilities array', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      capabilities: ['code-generation', 'testing'],
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-array capabilities', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      capabilities: 'not-an-array',
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent capabilities must be an array')
  })

  it('should fail for non-string capabilities items', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      capabilities: ['valid', 123],
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent capabilities must be strings')
  })

  it('should accept valid behavior configuration', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      behavior: {
        selfHeal: true,
        selfLearn: false,
        selfEvolve: true,
        maximizePotential: true,
      },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-object behavior', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      behavior: 'not-an-object',
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent behavior must be an object')
  })

  it('should fail for invalid behavior key', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      behavior: { invalidKey: true },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent behavior has invalid key: invalidKey')
  })

  it('should fail for non-boolean behavior value', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      behavior: { selfHeal: 'yes' },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent behavior.selfHeal must be a boolean')
  })

  it('should accept valid hooks configuration', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      hooks: {
        preToolUse: ['hook1'],
        postToolUse: ['hook2'],
        userPromptSubmit: [],
        stop: ['cleanup'],
      },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-object hooks', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      hooks: 'not-an-object',
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent hooks must be an object')
  })

  it('should fail for invalid hooks key', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      hooks: { invalidHook: [] },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent hooks has invalid key: invalidHook')
  })

  it('should fail for non-array hooks value', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      hooks: { preToolUse: 'not-an-array' },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent hooks.preToolUse must be an array')
  })

  it('should accept valid config with runtime settings', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      config: {
        temperature: 0.7,
        maxTokens: 8000,
        contextWindow: 128000,
        responseFormat: 'json',
      },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-object config', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      config: 'not-an-object',
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent config must be an object')
  })

  it('should fail for non-number temperature', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      config: { temperature: 'hot' },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent config.temperature must be a number')
  })

  it('should fail for non-number maxTokens', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      config: { maxTokens: '8000' },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent config.maxTokens must be a number')
  })

  it('should fail for invalid responseFormat', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      config: { responseFormat: 'xml' },
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent config.responseFormat must be "text" or "json"')
  })

  it('should accept valid mcpServers array', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      mcpServers: ['server1', 'server2'],
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-array mcpServers', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      mcpServers: 'not-an-array',
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent mcpServers must be an array')
  })

  it('should fail for non-string mcpServers items', () => {
    const agent = {
      id: 'test-id',
      name: 'Test',
      mcpServers: ['valid', 123],
      description: 'A test',
      skills: [],
      tags: [],
      enabled: true,
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Agent mcpServers must be strings')
  })

  it('should validate a complete CMZ-style agent', () => {
    const agent = {
      id: 'test-id',
      name: 'CMZ',
      version: '1.0.0',
      description: 'Self-healing, self-learning agent',
      behavior: {
        selfHeal: true,
        selfLearn: true,
        selfEvolve: true,
        maximizePotential: true,
      },
      model: 'gpt-4',
      capabilities: ['code-generation', 'debugging'],
      tools: { read: 'allow', write: 'ask' },
      permissions: { read: true, write: true, execute: true, git: true, network: true },
      hooks: {
        preToolUse: [],
        postToolUse: [],
        userPromptSubmit: [],
        stop: [],
      },
      mcpServers: [],
      skills: ['self-healing', 'continuous-improvement'],
      tags: ['autonomous', 'experimental'],
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 8000,
        contextWindow: 128000,
        responseFormat: 'text',
      },
    }
    
    const result = validateAgent(agent)
    
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
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

describe('AGENT_TEMPLATES', () => {
  it('should have codeReviewer template', () => {
    expect(AGENT_TEMPLATES.codeReviewer).toBeDefined()
    expect(AGENT_TEMPLATES.codeReviewer.name).toBe('Code Reviewer')
    expect(AGENT_TEMPLATES.codeReviewer.defaultTools).toHaveProperty('read')
  })

  it('should have testWriter template', () => {
    expect(AGENT_TEMPLATES.testWriter).toBeDefined()
    expect(AGENT_TEMPLATES.testWriter.name).toBe('Test Writer')
    expect(AGENT_TEMPLATES.testWriter.defaultTools).toHaveProperty('bash')
  })

  it('should have documentationAgent template', () => {
    expect(AGENT_TEMPLATES.documentationAgent).toBeDefined()
    expect(AGENT_TEMPLATES.documentationAgent.name).toBe('Documentation Agent')
  })

  it('should have devopsAgent template', () => {
    expect(AGENT_TEMPLATES.devopsAgent).toBeDefined()
    expect(AGENT_TEMPLATES.devopsAgent.name).toBe('DevOps Agent')
  })

  it('should have suggestedSkills as arrays', () => {
    Object.values(AGENT_TEMPLATES).forEach(template => {
      expect(Array.isArray(template.suggestedSkills)).toBe(true)
    })
  })

  it('should have defaultTags as arrays', () => {
    Object.values(AGENT_TEMPLATES).forEach(template => {
      expect(Array.isArray(template.defaultTags)).toBe(true)
      expect(template.defaultTags.length).toBeGreaterThan(0)
    })
  })
})

describe('createAgentFromTemplate', () => {
  it('should create an agent from codeReviewer template', () => {
    const agent = createAgentFromTemplate('codeReviewer')
    
    expect(agent.id).toBeDefined()
    expect(agent.name).toBe('Code Reviewer')
    expect(agent.description).toContain('code')
    expect(agent.enabled).toBe(true)
    expect(agent.tools).toHaveProperty('read')
    expect(agent.skills).toContain('code-review')
    expect(agent.tags).toContain('code-quality')
  })

  it('should create an agent from testWriter template', () => {
    const agent = createAgentFromTemplate('testWriter')
    
    expect(agent.name).toBe('Test Writer')
    expect(agent.tools).toHaveProperty('bash')
    expect(agent.permissions).toHaveProperty('execute')
  })

  it('should allow overriding name', () => {
    const agent = createAgentFromTemplate('codeReviewer', { name: 'Custom Reviewer' })
    
    expect(agent.name).toBe('Custom Reviewer')
    expect(agent.description).toBe(AGENT_TEMPLATES.codeReviewer.description)
  })

  it('should allow overriding description', () => {
    const agent = createAgentFromTemplate('documentationAgent', { 
      description: 'Custom docs agent' 
    })
    
    expect(agent.description).toBe('Custom docs agent')
  })

  it('should allow overriding model', () => {
    const agent = createAgentFromTemplate('devopsAgent', { model: 'gpt-4' })
    
    expect(agent.model).toBe('gpt-4')
  })

  it('should allow overriding enabled', () => {
    const agent = createAgentFromTemplate('codeReviewer', { enabled: false })
    
    expect(agent.enabled).toBe(false)
  })

  it('should allow overriding tags', () => {
    const agent = createAgentFromTemplate('codeReviewer', { tags: ['custom-tag'] })
    
    expect(agent.tags).toEqual(['custom-tag'])
  })

  it('should generate unique IDs', () => {
    const agent1 = createAgentFromTemplate('codeReviewer')
    const agent2 = createAgentFromTemplate('codeReviewer')
    
    expect(agent1.id).not.toBe(agent2.id)
  })

  it('should copy tools deeply', () => {
    const agent = createAgentFromTemplate('codeReviewer')
    agent.tools.read = 'deny'
    
    expect(AGENT_TEMPLATES.codeReviewer.defaultTools.read).toBe('allow')
  })

  it('should copy skills array', () => {
    const agent = createAgentFromTemplate('codeReviewer')
    agent.skills.push('new-skill')
    
    expect(AGENT_TEMPLATES.codeReviewer.suggestedSkills).not.toContain('new-skill')
  })

  it('should copy tags array', () => {
    const agent = createAgentFromTemplate('codeReviewer')
    agent.tags.push('new-tag')
    
    expect(AGENT_TEMPLATES.codeReviewer.defaultTags).not.toContain('new-tag')
  })
})

describe('getTemplateKeys', () => {
  it('should return all template keys', () => {
    const keys = getTemplateKeys()
    
    expect(keys).toContain('codeReviewer')
    expect(keys).toContain('testWriter')
    expect(keys).toContain('documentationAgent')
    expect(keys).toContain('devopsAgent')
  })

  it('should return an array', () => {
    const keys = getTemplateKeys()
    
    expect(Array.isArray(keys)).toBe(true)
    expect(keys.length).toBe(4)
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

describe('validateTool', () => {
  it('should return valid for a proper tool', () => {
    const tool = {
      name: 'test-tool',
      description: 'A test tool',
      parameters: { type: 'object' },
      permission: 'allow' as const,
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail for null input', () => {
    const result = validateTool(null)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tool must be an object')
  })

  it('should fail for non-object input', () => {
    const result = validateTool('not an object')
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tool must be an object')
  })

  it('should fail for missing name', () => {
    const tool = {
      description: 'A test',
      permission: 'allow',
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tool must have a string name')
  })

  it('should fail for missing description', () => {
    const tool = {
      name: 'test-tool',
      permission: 'allow',
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tool must have a string description')
  })

  it('should fail for non-object parameters', () => {
    const tool = {
      name: 'test-tool',
      description: 'A test',
      parameters: 'not-an-object',
      permission: 'allow',
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tool parameters must be an object')
  })

  it('should fail for invalid permission', () => {
    const tool = {
      name: 'test-tool',
      description: 'A test',
      permission: 'invalid',
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Tool permission must be "allow", "deny", or "ask"')
  })

  it('should accept "deny" permission', () => {
    const tool = {
      name: 'test-tool',
      description: 'A test',
      permission: 'deny' as const,
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(true)
  })

  it('should accept "ask" permission', () => {
    const tool = {
      name: 'test-tool',
      description: 'A test',
      permission: 'ask' as const,
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(true)
  })

  it('should accept tool without parameters', () => {
    const tool = {
      name: 'test-tool',
      description: 'A test',
      permission: 'allow' as const,
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(true)
  })

  it('should collect multiple errors', () => {
    const tool = {
      permission: 'invalid',
    }
    
    const result = validateTool(tool)
    
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})

describe('validateRun', () => {
  it('should return valid for a proper run', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi there',
      toolsUsed: ['tool1', 'tool2'],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail for null input', () => {
    const result = validateRun(null)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must be an object')
  })

  it('should fail for non-object input', () => {
    const result = validateRun('not an object')
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must be an object')
  })

  it('should fail for missing id', () => {
    const run = {
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a string id')
  })

  it('should fail for missing sessionId', () => {
    const run = {
      id: 'run-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a string sessionId')
  })

  it('should fail for non-number timestamp', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: 'not-a-number',
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a number timestamp')
  })

  it('should fail for missing agent', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a string agent')
  })

  it('should fail for missing model', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a string model')
  })

  it('should fail for missing input', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a string input')
  })

  it('should fail for missing output', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a string output')
  })

  it('should fail for non-array toolsUsed', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: 'not-an-array',
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a toolsUsed array')
  })

  it('should fail for non-string toolsUsed items', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: ['valid', 123],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run toolsUsed must be strings')
  })

  it('should fail for non-number exitStatus', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: '0',
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Run must have a number exitStatus')
  })

  it('should accept empty toolsUsed array', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Hi',
      toolsUsed: [],
      exitStatus: 0,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(true)
  })

  it('should accept non-zero exit status', () => {
    const run = {
      id: 'run-id',
      sessionId: 'session-id',
      timestamp: Date.now(),
      agent: 'test-agent',
      model: 'gpt-4',
      input: 'Hello',
      output: 'Error',
      toolsUsed: [],
      exitStatus: 1,
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(true)
  })

  it('should collect multiple errors', () => {
    const run = {
      toolsUsed: 'invalid',
    }
    
    const result = validateRun(run)
    
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})

describe('validateRepository', () => {
  it('should return valid for a proper repository', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test Repository',
      path: '/path/to/repo',
      tags: ['frontend', 'react'],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail for null input', () => {
    const result = validateRepository(null)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must be an object')
  })

  it('should fail for non-object input', () => {
    const result = validateRepository('not an object')
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must be an object')
  })

  it('should fail for missing id', () => {
    const repository = {
      name: 'Test',
      path: '/path',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a string id')
  })

  it('should fail for non-string id', () => {
    const repository = {
      id: 123,
      name: 'Test',
      path: '/path',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a string id')
  })

  it('should fail for missing name', () => {
    const repository = {
      id: 'repo-id',
      path: '/path',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a string name')
  })

  it('should fail for non-string name', () => {
    const repository = {
      id: 'repo-id',
      name: 123,
      path: '/path',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a string name')
  })

  it('should fail for missing path', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a string path')
  })

  it('should fail for non-string path', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: 123,
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a string path')
  })

  it('should accept optional remoteUrl', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      remoteUrl: 'https://github.com/example/repo',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-string remoteUrl', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      remoteUrl: 123,
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository remoteUrl must be a string')
  })

  it('should accept optional defaultBranch', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      defaultBranch: 'main',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-string defaultBranch', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      defaultBranch: 123,
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository defaultBranch must be a string')
  })

  it('should accept optional description', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      description: 'A test repository',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-string description', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      description: 123,
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository description must be a string')
  })

  it('should fail for missing tags array', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a tags array')
  })

  it('should fail for non-array tags', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      tags: 'not-an-array',
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have a tags array')
  })

  it('should fail for non-string tag items', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      tags: ['valid', 123],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository tags must be strings')
  })

  it('should accept empty tags array', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      tags: [],
      enabled: true,
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for missing enabled', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      tags: [],
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have an enabled boolean')
  })

  it('should fail for non-boolean enabled', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      tags: [],
      enabled: 'true',
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository must have an enabled boolean')
  })

  it('should accept optional lastAccessed', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      tags: [],
      enabled: true,
      lastAccessed: Date.now(),
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(true)
  })

  it('should fail for non-number lastAccessed', () => {
    const repository = {
      id: 'repo-id',
      name: 'Test',
      path: '/path',
      tags: [],
      enabled: true,
      lastAccessed: 'not-a-number',
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Repository lastAccessed must be a number')
  })

  it('should validate a complete repository with all fields', () => {
    const repository = {
      id: 'repo-id',
      name: 'Full Repository',
      path: '/path/to/repo',
      remoteUrl: 'https://github.com/example/repo',
      defaultBranch: 'main',
      description: 'A complete repository',
      tags: ['frontend', 'react', 'typescript'],
      enabled: true,
      lastAccessed: Date.now(),
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should collect multiple errors', () => {
    const repository = {
      tags: 'invalid',
      enabled: 'invalid',
    }
    
    const result = validateRepository(repository)
    
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})
