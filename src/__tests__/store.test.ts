import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../store/index'
import type { Agent } from '../types'

describe('Store - Agent Management', () => {
  beforeEach(() => {
    useAppStore.setState({
      agents: [],
      selectedAgentId: null,
    })
  })

  describe('duplicateAgent', () => {
    const mockAgent: Agent = {
      id: 'test-agent-1',
      name: 'Test Agent',
      description: 'A test agent for duplication',
      model: 'gpt-4',
      tools: { bash: 'allow', edit: 'ask' },
      permissions: { '*': 'ask' },
      skills: ['skill-1', 'skill-2'],
      tags: ['testing', 'automation'],
      enabled: true,
    }

    it('should duplicate an existing agent', () => {
      useAppStore.getState().setAgents([mockAgent])
      
      const duplicated = useAppStore.getState().duplicateAgent('test-agent-1')
      
      expect(duplicated).not.toBeNull()
      expect(duplicated?.name).toBe('Test Agent (Copy)')
      expect(duplicated?.id).not.toBe('test-agent-1')
      expect(duplicated?.description).toBe(mockAgent.description)
      expect(duplicated?.model).toBe(mockAgent.model)
      expect(duplicated?.tools).toEqual(mockAgent.tools)
      expect(duplicated?.permissions).toEqual(mockAgent.permissions)
      expect(duplicated?.skills).toEqual(mockAgent.skills)
      expect(duplicated?.enabled).toBe(true)
    })

    it('should add duplicated agent to the agents array', () => {
      useAppStore.getState().setAgents([mockAgent])
      
      useAppStore.getState().duplicateAgent('test-agent-1')
      
      const agents = useAppStore.getState().agents
      expect(agents).toHaveLength(2)
      expect(agents[0]).toEqual(mockAgent)
      expect(agents[1].name).toBe('Test Agent (Copy)')
    })

    it('should return null when duplicating non-existent agent', () => {
      const duplicated = useAppStore.getState().duplicateAgent('non-existent-id')
      
      expect(duplicated).toBeNull()
    })

    it('should not modify agents array when duplicating non-existent agent', () => {
      useAppStore.getState().setAgents([mockAgent])
      
      useAppStore.getState().duplicateAgent('non-existent-id')
      
      expect(useAppStore.getState().agents).toHaveLength(1)
    })

    it('should generate unique id for duplicated agent', () => {
      useAppStore.getState().setAgents([mockAgent])
      
      const first = useAppStore.getState().duplicateAgent('test-agent-1')
      useAppStore.getState().setAgents([mockAgent, first!])
      const second = useAppStore.getState().duplicateAgent('test-agent-1')
      
      expect(first?.id).not.toBe(second?.id)
    })

    it('should preserve enabled state from original agent', () => {
      const disabledAgent: Agent = { ...mockAgent, enabled: false }
      useAppStore.getState().setAgents([disabledAgent])
      
      const duplicated = useAppStore.getState().duplicateAgent('test-agent-1')
      
      expect(duplicated?.enabled).toBe(false)
    })
  })
})
