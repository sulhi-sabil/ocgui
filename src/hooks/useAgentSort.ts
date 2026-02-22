import { useMemo } from 'react'
import type { Agent, AgentSortBy, SortOrder } from '../types'

interface UseAgentSortResult {
  sortedAgents: Agent[]
}

export function useAgentSort(
  agents: Agent[],
  sortBy: AgentSortBy,
  sortOrder: SortOrder
): UseAgentSortResult {
  const sortedAgents = useMemo(() => {
    const sorted = [...agents]
    
    sorted.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'status':
          comparison = Number(b.enabled) - Number(a.enabled)
          break
        case 'skills':
          comparison = a.skills.length - b.skills.length
          break
        case 'tools':
          comparison = Object.keys(a.tools).length - Object.keys(b.tools).length
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return sorted
  }, [agents, sortBy, sortOrder])

  return {
    sortedAgents,
  }
}
