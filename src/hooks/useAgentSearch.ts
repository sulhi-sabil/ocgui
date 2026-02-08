import { useMemo } from 'react'
import type { Agent } from '../types'

interface UseAgentSearchResult {
  filteredAgents: Agent[]
  hasResults: boolean
  resultCount: number
}

/**
 * Hook for filtering agents based on a search query
 * Searches across agent name, description, and model
 */
export function useAgentSearch(
  agents: Agent[],
  searchQuery: string
): UseAgentSearchResult {
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) {
      return agents
    }

    const query = searchQuery.toLowerCase().trim()
    
    return agents.filter((agent) => {
      const nameMatch = agent.name.toLowerCase().includes(query)
      const descriptionMatch = agent.description.toLowerCase().includes(query)
      const modelMatch = agent.model?.toLowerCase().includes(query) ?? false
      
      return nameMatch || descriptionMatch || modelMatch
    })
  }, [agents, searchQuery])

  return {
    filteredAgents,
    hasResults: filteredAgents.length > 0,
    resultCount: filteredAgents.length,
  }
}
