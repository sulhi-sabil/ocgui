import { describe, it, expect } from 'vitest'
import { useRepositorySearch } from './useRepositorySearch'
import { renderHook } from '@testing-library/react'
import type { Repository } from '../types'

function createMockRepository(overrides: Partial<Repository> = {}): Repository {
  return {
    id: 'test-id',
    name: 'Test Repository',
    path: '/path/to/repo',
    tags: [],
    enabled: true,
    ...overrides,
  }
}

describe('useRepositorySearch', () => {
  const repositories = [
    createMockRepository({ id: '1', name: 'Frontend App', path: '/projects/frontend', tags: ['react', 'typescript'] }),
    createMockRepository({ id: '2', name: 'Backend API', path: '/projects/backend', tags: ['node', 'express'], description: 'REST API service' }),
    createMockRepository({ id: '3', name: 'Shared Library', path: '/projects/shared', tags: ['library'], remoteUrl: 'https://github.com/example/shared' }),
    createMockRepository({ id: '4', name: 'Mobile App', path: '/projects/mobile', tags: ['react-native'], enabled: false }),
  ]

  it('should return all repositories when query is empty', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, ''))
    
    expect(result.current.filteredRepositories).toHaveLength(4)
    expect(result.current.hasResults).toBe(true)
    expect(result.current.resultCount).toBe(4)
  })

  it('should return all repositories when query is whitespace only', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, '   '))
    
    expect(result.current.filteredRepositories).toHaveLength(4)
    expect(result.current.hasResults).toBe(true)
  })

  it('should filter repositories by name', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'frontend'))
    
    expect(result.current.filteredRepositories).toHaveLength(1)
    expect(result.current.filteredRepositories[0].name).toBe('Frontend App')
  })

  it('should filter repositories by path', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'backend'))
    
    expect(result.current.filteredRepositories).toHaveLength(1)
    expect(result.current.filteredRepositories[0].path).toBe('/projects/backend')
  })

  it('should filter repositories by description', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'REST'))
    
    expect(result.current.filteredRepositories).toHaveLength(1)
    expect(result.current.filteredRepositories[0].description).toBe('REST API service')
  })

  it('should filter repositories by remote URL', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'github'))
    
    expect(result.current.filteredRepositories).toHaveLength(1)
    expect(result.current.filteredRepositories[0].remoteUrl).toBe('https://github.com/example/shared')
  })

  it('should filter repositories by tag', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'react'))
    
    expect(result.current.filteredRepositories).toHaveLength(2)
    expect(result.current.filteredRepositories.map(r => r.name)).toContain('Frontend App')
    expect(result.current.filteredRepositories.map(r => r.name)).toContain('Mobile App')
  })

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'FRONTEND'))
    
    expect(result.current.filteredRepositories).toHaveLength(1)
    expect(result.current.filteredRepositories[0].name).toBe('Frontend App')
  })

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'app'))
    
    expect(result.current.filteredRepositories).toHaveLength(2)
    expect(result.current.filteredRepositories.map(r => r.name)).toContain('Frontend App')
    expect(result.current.filteredRepositories.map(r => r.name)).toContain('Mobile App')
  })

  it('should return empty array with no matches', () => {
    const { result } = renderHook(() => useRepositorySearch(repositories, 'nonexistent'))
    
    expect(result.current.filteredRepositories).toHaveLength(0)
    expect(result.current.hasResults).toBe(false)
    expect(result.current.resultCount).toBe(0)
  })

  it('should handle empty repositories array', () => {
    const { result } = renderHook(() => useRepositorySearch([], 'test'))
    
    expect(result.current.filteredRepositories).toHaveLength(0)
    expect(result.current.hasResults).toBe(false)
  })

  it('should handle repositories without optional fields', () => {
    const reposWithoutOptionals = [
      createMockRepository({ id: '1', name: 'Test', path: '/test', description: undefined, remoteUrl: undefined }),
    ]
    
    const { result } = renderHook(() => useRepositorySearch(reposWithoutOptionals, 'test'))
    
    expect(result.current.filteredRepositories).toHaveLength(1)
    expect(result.current.hasResults).toBe(true)
  })
})
