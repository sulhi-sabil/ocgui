import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAgentSearch } from './useAgentSearch'
import type { Agent } from '../types'

describe('useAgentSearch', () => {
  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'Code Reviewer',
      description: 'Reviews code for quality',
      model: 'gpt-4',
      tools: {},
      permissions: {},
      skills: ['code-review', 'security-analysis'],
      tags: ['code-quality', 'review'],
      enabled: true,
    },
    {
      id: '2',
      name: 'Test Writer',
      description: 'Writes unit tests',
      model: 'claude-3',
      tools: {},
      permissions: {},
      skills: ['testing', 'test-coverage'],
      tags: ['testing', 'automation'],
      enabled: true,
    },
    {
      id: '3',
      name: 'Documentation Agent',
      description: 'Creates documentation',
      tools: {},
      permissions: {},
      skills: ['markdown', 'documentation'],
      tags: ['docs'],
      enabled: false,
    },
  ]

  it('should return all agents when search query is empty', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, ''))
    
    expect(result.current.filteredAgents).toHaveLength(3)
    expect(result.current.hasResults).toBe(true)
    expect(result.current.resultCount).toBe(3)
  })

  it('should filter agents by name', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'code'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Code Reviewer')
    expect(result.current.hasResults).toBe(true)
  })

  it('should filter agents by description', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'tests'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Test Writer')
  })

  it('should filter agents by model', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'gpt-4'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Code Reviewer')
  })

  it('should be case-insensitive', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'CODE'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Code Reviewer')
  })

  it('should handle no matches', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'nonexistent'))
    
    expect(result.current.filteredAgents).toHaveLength(0)
    expect(result.current.hasResults).toBe(false)
    expect(result.current.resultCount).toBe(0)
  })

  it('should trim search query', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, '  code  '))
    
    expect(result.current.filteredAgents).toHaveLength(1)
  })

  it('should handle agents without model', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'documentation'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Documentation Agent')
  })

  it('should filter agents by tags', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'automation'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Test Writer')
  })

  it('should filter agents by partial tag match', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'test'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Test Writer')
  })

  it('should handle agents without tags', () => {
    const agentsWithoutTags = [{ ...mockAgents[0], tags: [] }]
    const { result } = renderHook(() => useAgentSearch(agentsWithoutTags, 'review'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
  })

  it('should filter agents by skills', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'security-analysis'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Code Reviewer')
  })

  it('should filter agents by partial skill match', () => {
    const { result } = renderHook(() => useAgentSearch(mockAgents, 'test-coverage'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
    expect(result.current.filteredAgents[0].name).toBe('Test Writer')
  })

  it('should handle agents without skills', () => {
    const agentsWithoutSkills = [{ ...mockAgents[0], skills: [] }]
    const { result } = renderHook(() => useAgentSearch(agentsWithoutSkills, 'reviewer'))
    
    expect(result.current.filteredAgents).toHaveLength(1)
  })
})
