import { useMemo } from 'react'
import type { Repository } from '../types'

interface UseRepositorySearchResult {
  filteredRepositories: Repository[]
  hasResults: boolean
  resultCount: number
}

export function useRepositorySearch(
  repositories: Repository[],
  searchQuery: string
): UseRepositorySearchResult {
  const filteredRepositories = useMemo(() => {
    if (!searchQuery.trim()) {
      return repositories
    }

    const query = searchQuery.toLowerCase().trim()
    
    return repositories.filter((repository) => {
      const nameMatch = repository.name.toLowerCase().includes(query)
      const pathMatch = repository.path.toLowerCase().includes(query)
      const descriptionMatch = repository.description?.toLowerCase().includes(query) ?? false
      const remoteUrlMatch = repository.remoteUrl?.toLowerCase().includes(query) ?? false
      const tagsMatch = repository.tags?.some(tag => tag.toLowerCase().includes(query)) ?? false
      
      return nameMatch || pathMatch || descriptionMatch || remoteUrlMatch || tagsMatch
    })
  }, [repositories, searchQuery])

  return {
    filteredRepositories,
    hasResults: filteredRepositories.length > 0,
    resultCount: filteredRepositories.length,
  }
}
