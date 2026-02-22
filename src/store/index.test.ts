import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from '@testing-library/react'
import { useAppStore } from './index'
import type { Agent, Skill, Config, Run, AgentId, SkillId, RunId } from '../types'

describe('useAppStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
    useAppStore.getState().reset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const mockAgent: Agent = {
    id: 'agent-1' as AgentId,
    name: 'Test Agent',
    description: 'A test agent',
    model: 'gpt-4',
    tools: { read: 'allow' },
    permissions: { file: 'ask' },
    skills: ['skill-1'],
    tags: ['testing', 'automation'],
    enabled: true,
  }

  const mockSkill: Skill = {
    id: 'skill-1' as SkillId,
    name: 'Test Skill',
    description: 'A test skill',
    content: 'skill content',
    commands: ['/test'],
    path: '/path/to/skill',
  }

  const mockConfig: Config = {
    providers: { openai: { apiKey: 'test' } },
    agents: [],
    tools: {},
    experimental: {},
  }

  const mockRun: Run = {
    id: 'run-1' as RunId,
    sessionId: 'session-1',
    timestamp: Date.now(),
    agent: 'agent-1',
    model: 'gpt-4',
    input: 'test input',
    output: 'test output',
    toolsUsed: ['read'],
    exitStatus: 0,
  }

  describe('agent management', () => {
    it('should have initial empty agents array', () => {
      expect(useAppStore.getState().agents).toEqual([])
    })

    it('should set agents', () => {
      act(() => {
        useAppStore.getState().setAgents([mockAgent])
      })

      expect(useAppStore.getState().agents).toHaveLength(1)
      expect(useAppStore.getState().agents[0]).toEqual(mockAgent)
    })

    it('should add an agent', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })

      expect(useAppStore.getState().agents).toHaveLength(1)
      expect(useAppStore.getState().agents[0]).toEqual(mockAgent)
    })

    it('should update an agent', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })

      act(() => {
        useAppStore.getState().updateAgent('agent-1' as AgentId, { name: 'Updated Agent' })
      })

      expect(useAppStore.getState().agents[0].name).toBe('Updated Agent')
      expect(useAppStore.getState().agents[0].description).toBe(mockAgent.description)
    })

    it('should not update non-existent agent', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
        useAppStore.getState().updateAgent('non-existent' as AgentId, { name: 'Updated' })
      })

      expect(useAppStore.getState().agents[0].name).toBe(mockAgent.name)
    })

    it('should delete an agent', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })

      act(() => {
        useAppStore.getState().deleteAgent('agent-1' as AgentId)
      })

      expect(useAppStore.getState().agents).toHaveLength(0)
    })

    it('should clear selectedAgentId when deleting selected agent', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
        useAppStore.getState().selectAgent('agent-1' as AgentId)
      })

      expect(useAppStore.getState().selectedAgentId).toBe('agent-1' as AgentId)

      act(() => {
        useAppStore.getState().deleteAgent('agent-1' as AgentId)
      })

      expect(useAppStore.getState().selectedAgentId).toBeNull()
    })

    it('should select an agent', () => {
      act(() => {
        useAppStore.getState().selectAgent('agent-1' as AgentId)
      })

      expect(useAppStore.getState().selectedAgentId).toBe('agent-1' as AgentId)
    })

    it('should deselect an agent', () => {
      act(() => {
        useAppStore.getState().selectAgent('agent-1' as AgentId)
      })

      act(() => {
        useAppStore.getState().selectAgent(null)
      })

      expect(useAppStore.getState().selectedAgentId).toBeNull()
    })

    it('should duplicate an agent', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
      })

      act(() => {
        useAppStore.getState().duplicateAgent('agent-1' as AgentId)
      })

      const agents = useAppStore.getState().agents
      expect(agents).toHaveLength(2)
      const duplicatedAgent = agents.find(a => a.id !== 'agent-1' as AgentId)
      expect(duplicatedAgent).toBeDefined()
      expect(duplicatedAgent?.name).toBe('Test Agent (Copy)')
    })

    it('should return null when duplicating non-existent agent', () => {
      const result = useAppStore.getState().duplicateAgent('non-existent' as AgentId)

      expect(result).toBeNull()
      expect(useAppStore.getState().agents).toHaveLength(0)
    })
  })

  describe('skill management', () => {
    it('should have initial empty skills array', () => {
      expect(useAppStore.getState().skills).toEqual([])
    })

    it('should set skills', () => {
      act(() => {
        useAppStore.getState().setSkills([mockSkill])
      })

      expect(useAppStore.getState().skills).toHaveLength(1)
      expect(useAppStore.getState().skills[0]).toEqual(mockSkill)
    })

    it('should add a skill', () => {
      act(() => {
        useAppStore.getState().addSkill(mockSkill)
      })

      expect(useAppStore.getState().skills).toHaveLength(1)
      expect(useAppStore.getState().skills[0]).toEqual(mockSkill)
    })

    it('should update a skill', () => {
      act(() => {
        useAppStore.getState().addSkill(mockSkill)
      })

      act(() => {
        useAppStore.getState().updateSkill('skill-1' as SkillId, { name: 'Updated Skill' })
      })

      expect(useAppStore.getState().skills[0].name).toBe('Updated Skill')
      expect(useAppStore.getState().skills[0].description).toBe(mockSkill.description)
    })

    it('should not update non-existent skill', () => {
      act(() => {
        useAppStore.getState().addSkill(mockSkill)
        useAppStore.getState().updateSkill('non-existent' as SkillId, { name: 'Updated' })
      })

      expect(useAppStore.getState().skills[0].name).toBe(mockSkill.name)
    })

    it('should delete a skill', () => {
      act(() => {
        useAppStore.getState().addSkill(mockSkill)
      })

      act(() => {
        useAppStore.getState().deleteSkill('skill-1' as SkillId)
      })

      expect(useAppStore.getState().skills).toHaveLength(0)
    })

    it('should duplicate a skill', () => {
      act(() => {
        useAppStore.getState().addSkill(mockSkill)
      })

      act(() => {
        useAppStore.getState().duplicateSkill('skill-1' as SkillId)
      })

      const skills = useAppStore.getState().skills
      expect(skills).toHaveLength(2)
      const duplicatedSkill = skills.find(s => s.id !== 'skill-1' as SkillId)
      expect(duplicatedSkill).toBeDefined()
      expect(duplicatedSkill?.name).toBe('Test Skill (Copy)')
    })

    it('should return null when duplicating non-existent skill', () => {
      const result = useAppStore.getState().duplicateSkill('non-existent' as SkillId)

      expect(result).toBeNull()
      expect(useAppStore.getState().skills).toHaveLength(0)
    })
  })

  describe('configuration', () => {
    it('should have initial null config', () => {
      expect(useAppStore.getState().config).toBeNull()
    })

    it('should set config', () => {
      act(() => {
        useAppStore.getState().setConfig(mockConfig)
      })

      expect(useAppStore.getState().config).toEqual(mockConfig)
    })
  })

  describe('execution runs', () => {
    it('should have initial empty runs array', () => {
      expect(useAppStore.getState().runs).toEqual([])
    })

    it('should add a run to the beginning', () => {
      const run1 = { ...mockRun, id: 'run-1' as RunId, timestamp: 1000 }
      const run2 = { ...mockRun, id: 'run-2' as RunId, timestamp: 2000 }

      act(() => {
        useAppStore.getState().addRun(run1)
        useAppStore.getState().addRun(run2)
      })

      expect(useAppStore.getState().runs).toHaveLength(2)
      expect(useAppStore.getState().runs[0].id).toBe('run-2' as RunId)
    })

    it('should delete a run', () => {
      act(() => {
        useAppStore.getState().addRun(mockRun)
      })

      act(() => {
        useAppStore.getState().deleteRun('run-1' as RunId)
      })

      expect(useAppStore.getState().runs).toHaveLength(0)
    })

    it('should clear all runs', () => {
      const run1 = { ...mockRun, id: 'run-1' as RunId }
      const run2 = { ...mockRun, id: 'run-2' as RunId }

      act(() => {
        useAppStore.getState().addRun(run1)
        useAppStore.getState().addRun(run2)
      })

      expect(useAppStore.getState().runs).toHaveLength(2)

      act(() => {
        useAppStore.getState().clearRuns()
      })

      expect(useAppStore.getState().runs).toHaveLength(0)
    })
  })

  describe('theme', () => {
    it('should have initial light theme', () => {
      expect(useAppStore.getState().theme).toBe('light')
    })

    it('should set theme', () => {
      act(() => {
        useAppStore.getState().setTheme('dark')
      })

      expect(useAppStore.getState().theme).toBe('dark')
    })
  })

  describe('search', () => {
    it('should have initial empty lastSearchQuery', () => {
      expect(useAppStore.getState().lastSearchQuery).toBe('')
    })

    it('should set lastSearchQuery', () => {
      act(() => {
        useAppStore.getState().setLastSearchQuery('test query')
      })

      expect(useAppStore.getState().lastSearchQuery).toBe('test query')
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      act(() => {
        useAppStore.getState().addAgent(mockAgent)
        useAppStore.getState().addSkill(mockSkill)
        useAppStore.getState().setConfig(mockConfig)
        useAppStore.getState().addRun(mockRun)
        useAppStore.getState().setTheme('dark')
        useAppStore.getState().setLastSearchQuery('test')
        useAppStore.getState().selectAgent('agent-1' as AgentId)
      })

      expect(useAppStore.getState().agents).toHaveLength(1)
      expect(useAppStore.getState().skills).toHaveLength(1)
      expect(useAppStore.getState().config).toEqual(mockConfig)
      expect(useAppStore.getState().runs).toHaveLength(1)
      expect(useAppStore.getState().theme).toBe('dark')
      expect(useAppStore.getState().lastSearchQuery).toBe('test')
      expect(useAppStore.getState().selectedAgentId).toBe('agent-1' as AgentId)

      act(() => {
        useAppStore.getState().reset()
      })

      expect(useAppStore.getState().agents).toEqual([])
      expect(useAppStore.getState().selectedAgentId).toBeNull()
      expect(useAppStore.getState().skills).toEqual([])
      expect(useAppStore.getState().config).toBeNull()
      expect(useAppStore.getState().runs).toEqual([])
      expect(useAppStore.getState().theme).toBe('light')
      expect(useAppStore.getState().lastSearchQuery).toBe('')
    })
  })
})
