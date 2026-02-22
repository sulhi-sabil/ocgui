import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAgentSort } from './useAgentSort'
import type { Agent } from '../types'

describe('useAgentSort', () => {
  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'Zebra Agent',
      description: 'Last alphabetically',
      tools: { tool1: 'allow', tool2: 'allow', tool3: 'allow' },
      permissions: {},
      skills: ['skill1'],
      tags: [],
      enabled: false,
    },
    {
      id: '2',
      name: 'Alpha Agent',
      description: 'First alphabetically',
      tools: { tool1: 'allow' },
      permissions: {},
      skills: ['skill1', 'skill2', 'skill3'],
      tags: [],
      enabled: true,
    },
    {
      id: '3',
      name: 'Beta Agent',
      description: 'Middle alphabetically',
      tools: { tool1: 'allow', tool2: 'allow' },
      permissions: {},
      skills: ['skill1', 'skill2'],
      tags: [],
      enabled: true,
    },
  ]

  it('should sort agents by name ascending', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'name', 'asc'))
    
    expect(result.current.sortedAgents[0].name).toBe('Alpha Agent')
    expect(result.current.sortedAgents[1].name).toBe('Beta Agent')
    expect(result.current.sortedAgents[2].name).toBe('Zebra Agent')
  })

  it('should sort agents by name descending', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'name', 'desc'))
    
    expect(result.current.sortedAgents[0].name).toBe('Zebra Agent')
    expect(result.current.sortedAgents[1].name).toBe('Beta Agent')
    expect(result.current.sortedAgents[2].name).toBe('Alpha Agent')
  })

  it('should sort agents by status ascending (enabled first)', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'status', 'asc'))
    
    expect(result.current.sortedAgents[0].enabled).toBe(true)
    expect(result.current.sortedAgents[1].enabled).toBe(true)
    expect(result.current.sortedAgents[2].enabled).toBe(false)
  })

  it('should sort agents by status descending (disabled first)', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'status', 'desc'))
    
    expect(result.current.sortedAgents[0].enabled).toBe(false)
    expect(result.current.sortedAgents[1].enabled).toBe(true)
    expect(result.current.sortedAgents[2].enabled).toBe(true)
  })

  it('should sort agents by skills count ascending', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'skills', 'asc'))
    
    expect(result.current.sortedAgents[0].skills.length).toBe(1)
    expect(result.current.sortedAgents[1].skills.length).toBe(2)
    expect(result.current.sortedAgents[2].skills.length).toBe(3)
  })

  it('should sort agents by skills count descending', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'skills', 'desc'))
    
    expect(result.current.sortedAgents[0].skills.length).toBe(3)
    expect(result.current.sortedAgents[1].skills.length).toBe(2)
    expect(result.current.sortedAgents[2].skills.length).toBe(1)
  })

  it('should sort agents by tools count ascending', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'tools', 'asc'))
    
    expect(Object.keys(result.current.sortedAgents[0].tools).length).toBe(1)
    expect(Object.keys(result.current.sortedAgents[1].tools).length).toBe(2)
    expect(Object.keys(result.current.sortedAgents[2].tools).length).toBe(3)
  })

  it('should sort agents by tools count descending', () => {
    const { result } = renderHook(() => useAgentSort(mockAgents, 'tools', 'desc'))
    
    expect(Object.keys(result.current.sortedAgents[0].tools).length).toBe(3)
    expect(Object.keys(result.current.sortedAgents[1].tools).length).toBe(2)
    expect(Object.keys(result.current.sortedAgents[2].tools).length).toBe(1)
  })

  it('should not mutate the original array', () => {
    const originalOrder = mockAgents.map(a => a.id)
    renderHook(() => useAgentSort(mockAgents, 'name', 'asc'))
    
    expect(mockAgents.map(a => a.id)).toEqual(originalOrder)
  })

  it('should handle empty array', () => {
    const { result } = renderHook(() => useAgentSort([], 'name', 'asc'))
    
    expect(result.current.sortedAgents).toHaveLength(0)
  })

  it('should handle single agent', () => {
    const singleAgent = [mockAgents[0]]
    const { result } = renderHook(() => useAgentSort(singleAgent, 'name', 'asc'))
    
    expect(result.current.sortedAgents).toHaveLength(1)
    expect(result.current.sortedAgents[0].id).toBe(singleAgent[0].id)
  })
})
