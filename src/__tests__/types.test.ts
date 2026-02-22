import { describe, it, expect } from 'vitest'
import { Agent, Skill, Tool, ErrorCode, AppErrorData } from '../types'

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
      tags: ['testing'],
      enabled: true,
    }
    
    expect(agent).toHaveProperty('id')
    expect(agent).toHaveProperty('name')
    expect(agent).toHaveProperty('enabled')
    expect(agent).toHaveProperty('tags')
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

  it('ErrorCode should have valid values', () => {
    const codes: ErrorCode[] = [
      'INVOKE_ERROR',
      'DATABASE_ERROR',
      'VALIDATION_ERROR',
      'STORAGE_ERROR',
      'NETWORK_ERROR',
      'UNKNOWN_ERROR',
    ]

    codes.forEach(code => {
      expect(typeof code).toBe('string')
    })
  })

  it('AppErrorData should have required properties', () => {
    const errorData: AppErrorData = {
      code: 'INVOKE_ERROR',
      message: 'Test error',
    }

    expect(errorData.code).toBe('INVOKE_ERROR')
    expect(errorData.message).toBe('Test error')
  })

  it('AppErrorData should support optional properties', () => {
    const errorData: AppErrorData = {
      code: 'NETWORK_ERROR',
      message: 'Network failed',
      cause: new Error('Original'),
      recoverable: true,
    }

    expect(errorData.cause).toBeDefined()
    expect(errorData.recoverable).toBe(true)
  })
})