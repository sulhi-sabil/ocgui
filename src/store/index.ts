import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { Agent, Skill, Config, Run, Repository } from '../types'
import { generateId, validateAgent, validateSkill, validateRepository } from '@utils/index'
import { AGENT, SKILL, REPOSITORY, STORAGE } from '@constants/index'

const CURRENT_STORE_VERSION = 3

const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name)
      return value
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // Storage quota exceeded or unavailable - silently fail
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      // Storage unavailable - silently fail
    }
  },
}

interface PersistedState {
  version: number
  theme: 'light' | 'dark'
  agents: Agent[]
  selectedAgentId: string | null
  skills: Skill[]
  config: Config | null
  lastSearchQuery: string
  repositories: Repository[]
  selectedRepositoryId: string | null
  lastRepositorySearchQuery: string
}

type Migration = (state: Partial<PersistedState>) => Partial<PersistedState>

const migrations: Record<number, Migration> = {
  1: (state) => {
    const migrated = { ...state }
    
    if (Array.isArray(migrated.agents)) {
      migrated.agents = migrated.agents.filter((agent: unknown) => {
        const result = validateAgent(agent)
        return result.valid
      })
    } else {
      migrated.agents = []
    }
    
    if (Array.isArray(migrated.skills)) {
      migrated.skills = migrated.skills.filter((skill: unknown) => {
        const result = validateSkill(skill)
        return result.valid
      })
    } else {
      migrated.skills = []
    }
    
    if (migrated.theme !== 'light' && migrated.theme !== 'dark') {
      migrated.theme = 'light'
    }
    
    if (typeof migrated.selectedAgentId !== 'string' && migrated.selectedAgentId !== null) {
      migrated.selectedAgentId = null
    }
    
    if (typeof migrated.lastSearchQuery !== 'string') {
      migrated.lastSearchQuery = ''
    }
    
    return {
      ...migrated,
      version: 2,
    }
  },
  2: (state) => {
    const migrated = { ...state }
    
    migrated.repositories = []
    migrated.selectedRepositoryId = null
    migrated.lastRepositorySearchQuery = ''
    
    return {
      ...migrated,
      version: 3,
    }
  },
}

function migrateState(state: unknown, fromVersion: number): PersistedState | null {
  if (!state || typeof state !== 'object') {
    return null
  }
  
  let migrated = state as Partial<PersistedState>
  
  for (let v = fromVersion; v < CURRENT_STORE_VERSION; v++) {
    const migration = migrations[v]
    if (migration) {
      try {
        migrated = migration(migrated)
      } catch {
        return null
      }
    }
  }
  
  return validatePersistedState(migrated)
}

function validatePersistedState(state: Partial<PersistedState> | null): PersistedState | null {
  if (!state) return null
  
  if (state.version !== CURRENT_STORE_VERSION) {
    return null
  }
  
  return {
    version: CURRENT_STORE_VERSION,
    theme: state.theme === 'dark' ? 'dark' : 'light',
    agents: Array.isArray(state.agents) 
      ? state.agents.filter((a: unknown) => validateAgent(a).valid) 
      : [],
    selectedAgentId: typeof state.selectedAgentId === 'string' ? state.selectedAgentId : null,
    skills: Array.isArray(state.skills) 
      ? state.skills.filter((s: unknown) => validateSkill(s).valid) 
      : [],
    config: state.config && typeof state.config === 'object' ? state.config : null,
    lastSearchQuery: typeof state.lastSearchQuery === 'string' ? state.lastSearchQuery : '',
    repositories: Array.isArray(state.repositories)
      ? state.repositories.filter((r: unknown) => validateRepository(r).valid)
      : [],
    selectedRepositoryId: typeof state.selectedRepositoryId === 'string' ? state.selectedRepositoryId : null,
    lastRepositorySearchQuery: typeof state.lastRepositorySearchQuery === 'string' ? state.lastRepositorySearchQuery : '',
  }
}

interface AppState {
  version: number
  // Agent management
  agents: Agent[]
  selectedAgentId: string | null
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  duplicateAgent: (id: string) => Agent | null
  selectAgent: (id: string | null) => void
  
  // Skill management
  skills: Skill[]
  setSkills: (skills: Skill[]) => void
  addSkill: (skill: Skill) => void
  updateSkill: (id: string, updates: Partial<Skill>) => void
  deleteSkill: (id: string) => void
  duplicateSkill: (id: string) => Skill | null
  
  // Repository management
  repositories: Repository[]
  selectedRepositoryId: string | null
  setRepositories: (repositories: Repository[]) => void
  addRepository: (repository: Repository) => void
  updateRepository: (id: string, updates: Partial<Repository>) => void
  deleteRepository: (id: string) => void
  duplicateRepository: (id: string) => Repository | null
  selectRepository: (id: string | null) => void
  
  // Configuration
  config: Config | null
  setConfig: (config: Config) => void
  
  // Execution
  runs: Run[]
  addRun: (run: Run) => void
  deleteRun: (id: string) => void
  clearRuns: () => void
  
  // UI State
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  
  // Search State
  lastSearchQuery: string
  setLastSearchQuery: (query: string) => void
  lastRepositorySearchQuery: string
  setLastRepositorySearchQuery: (query: string) => void
  
  // Reset
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      version: CURRENT_STORE_VERSION,
      agents: [],
      selectedAgentId: null,
      setAgents: (agents) => set({ agents }),
      addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      deleteAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
          selectedAgentId: state.selectedAgentId === id ? null : state.selectedAgentId,
        })),
      duplicateAgent: (id) => {
        const agent = useAppStore.getState().agents.find((a) => a.id === id)
        if (!agent) return null
        
        const duplicated: Agent = {
          ...agent,
          id: generateId(),
          name: `${agent.name}${AGENT.NAME_COPY_SUFFIX}`,
        }
        
        set((state) => ({ agents: [...state.agents, duplicated] }))
        return duplicated
      },
      selectAgent: (id) => set({ selectedAgentId: id }),
      
      skills: [],
      setSkills: (skills) => set({ skills }),
      addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
      updateSkill: (id, updates) =>
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),
      duplicateSkill: (id) => {
        const skill = useAppStore.getState().skills.find((s) => s.id === id)
        if (!skill) return null
        
        const duplicated: Skill = {
          ...skill,
          id: generateId(),
          name: `${skill.name}${SKILL.NAME_COPY_SUFFIX}`,
        }
        
        set((state) => ({ skills: [...state.skills, duplicated] }))
        return duplicated
      },
      
      repositories: [],
      selectedRepositoryId: null,
      setRepositories: (repositories) => set({ repositories }),
      addRepository: (repository) => set((state) => ({ repositories: [...state.repositories, repository] })),
      updateRepository: (id, updates) =>
        set((state) => ({
          repositories: state.repositories.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      deleteRepository: (id) =>
        set((state) => ({
          repositories: state.repositories.filter((r) => r.id !== id),
          selectedRepositoryId: state.selectedRepositoryId === id ? null : state.selectedRepositoryId,
        })),
      duplicateRepository: (id) => {
        const repository = useAppStore.getState().repositories.find((r) => r.id === id)
        if (!repository) return null
        
        const duplicated: Repository = {
          ...repository,
          id: generateId(),
          name: `${repository.name}${REPOSITORY.NAME_COPY_SUFFIX}`,
        }
        
        set((state) => ({ repositories: [...state.repositories, duplicated] }))
        return duplicated
      },
      selectRepository: (id) => set({ selectedRepositoryId: id }),
      
      config: null,
      setConfig: (config) => set({ config }),
      
      runs: [],
      addRun: (run) => set((state) => ({ runs: [run, ...state.runs] })),
      deleteRun: (id) =>
        set((state) => ({
          runs: state.runs.filter((r) => r.id !== id),
        })),
      clearRuns: () => set({ runs: [] }),
      
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      lastSearchQuery: '',
      setLastSearchQuery: (query) => set({ lastSearchQuery: query }),
      lastRepositorySearchQuery: '',
      setLastRepositorySearchQuery: (query) => set({ lastRepositorySearchQuery: query }),
      
      reset: () => set({
        version: CURRENT_STORE_VERSION,
        agents: [],
        selectedAgentId: null,
        skills: [],
        repositories: [],
        selectedRepositoryId: null,
        config: null,
        runs: [],
        theme: 'light',
        lastSearchQuery: '',
        lastRepositorySearchQuery: '',
      }),
    }),
    {
      name: STORAGE.KEY,
      version: CURRENT_STORE_VERSION,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ 
        version: state.version,
        theme: state.theme,
        agents: state.agents,
        selectedAgentId: state.selectedAgentId,
        skills: state.skills,
        config: state.config,
        lastSearchQuery: state.lastSearchQuery,
        repositories: state.repositories,
        selectedRepositoryId: state.selectedRepositoryId,
        lastRepositorySearchQuery: state.lastRepositorySearchQuery,
      }),
      migrate: (persistedState, version) => {
        const migrated = migrateState(persistedState, version)
        if (migrated) {
          return migrated
        }
        return {
          version: CURRENT_STORE_VERSION,
          theme: 'light' as const,
          agents: [],
          selectedAgentId: null,
          skills: [],
          config: null,
          lastSearchQuery: '',
          repositories: [],
          selectedRepositoryId: null,
          lastRepositorySearchQuery: '',
        }
      },
    }
  )
)