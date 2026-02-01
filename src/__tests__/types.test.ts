import { describe, it, expect } from 'vitest'
import { Agent, Skill, Tool } from '../types'

describe('Type Definitions', () => {
  it('Agent type should have required properties', () => {
    const agent: Agent = {
      id: 'test-agent',
      name: 'Test Agent',
      description: 'A test agent',
      model: 'gpt-4',
      tools: {},
      permissions: {},
      skills: [],
      enabled: true,
    }
    
    expect(agent).toHaveProperty('id')
    expect(agent).toHaveProperty('name')
    expect(agent).toHaveProperty('enabled')
  })

  it('Skill type should have required properties', () => {
    const skill: Skill = {
      id: 'test-skill',
      name: 'Test Skill',
      description: 'A test skill',
      content: 'Skill content',
      commands: [],
      path: '/test/path',
    }
    
    expect(skill).toHaveProperty('id')
    expect(skill).toHaveProperty('path')
  })

  it('Tool type should have valid permission values', () => {
    const tool: Tool = {
      name: 'test-tool',
      description: 'A test tool',
      parameters: {},
      permission: 'allow',
    }
    
    expect(['allow', 'deny', 'ask']).toContain(tool.permission)
  })
})