import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { Agent, Skill, Config, Run } from '../types'
import { generateId } from '@utils/index'
import { AGENT } from '@constants/index'

const STORAGE_KEY = 'ocgui-storage'
const CURRENT_VERSION = 1

interface PersistedState {
  version: number
  theme: 'light' | 'dark'
  agents: Agent[]
  selectedAgentId: string | null
  skills: Skill[]
  config: Config | null
  lastSearchQuery: string
}

function isValidAgent(value: unknown): value is Agent {
  if (typeof value !== 'object' || value === null) return false
  const agent = value as Record<string, unknown>
  return (
    typeof agent.id === 'string' &&
    typeof agent.name === 'string' &&
    typeof agent.description === 'string' &&
    typeof agent.enabled === 'boolean'
  )
}

function isValidSkill(value: unknown): value is Skill {
  if (typeof value !== 'object' || value === null) return false
  const skill = value as Record<string, unknown>
  return (
    typeof skill.id === 'string' &&
    typeof skill.name === 'string' &&
    typeof skill.description === 'string' &&
    typeof skill.content === 'string'
  )
}

function isValidPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== 'object' || value === null) return false
  const state = value as Record<string, unknown>
  
  if (typeof state.version !== 'number') return false
  if (!Array.isArray(state.agents)) return false
  if (!Array.isArray(state.skills)) return false
  if (state.theme !== 'light' && state.theme !== 'dark') return false
  
  for (const agent of state.agents) {
    if (!isValidAgent(agent)) return false
  }
  
  for (const skill of state.skills) {
    if (!isValidSkill(skill)) return false
  }
  
  return true
}

function migrateState(state: unknown, fromVersion: number): PersistedState | null {
  if (fromVersion > CURRENT_VERSION) {
    console.warn(`[ocgui] Stored version ${fromVersion} is newer than current ${CURRENT_VERSION}, resetting`)
    return null
  }
  
  if (fromVersion === CURRENT_VERSION) {
    return state as PersistedState
  }
  
  console.info(`[ocgui] Migrating state from version ${fromVersion} to ${CURRENT_VERSION}`)
  
  return state as PersistedState
}

function parseStoredValue(value: string | null): PersistedState | null {
  if (!value) return null
  
  try {
    const parsed = JSON.parse(value)
    
    if (parsed.state) {
      const storedVersion = typeof parsed.version === 'number' ? parsed.version : 1
      const migratedState = migrateState(parsed.state, storedVersion)
      
      if (migratedState && isValidPersistedState(migratedState)) {
        return migratedState
      }
    }
    
    console.warn('[ocgui] Invalid persisted state detected, resetting to defaults')
    return null
  } catch (error) {
    console.warn('[ocgui] Failed to parse stored state:', error)
    return null
  }
}

const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name)
      if (!value) return null
      
      const parsedState = parseStoredValue(value)
      if (!parsedState) {
        return JSON.stringify({
          state: {
            version: CURRENT_VERSION,
            theme: 'light',
            agents: [],
            selectedAgentId: null,
            skills: [],
            config: null,
            lastSearchQuery: '',
          },
          version: CURRENT_VERSION,
        })
      }
      
      return JSON.stringify({
        state: parsedState,
        version: CURRENT_VERSION,
      })
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('[ocgui] Storage quota exceeded, consider clearing old data')
      }
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
  
  // Reset
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      version: CURRENT_VERSION,
      // Agents
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
      
      // Skills
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
          name: `${skill.name} (Copy)`,
        }
        
        set((state) => ({ skills: [...state.skills, duplicated] }))
        return duplicated
      },
      
      // Config
      config: null,
      setConfig: (config) => set({ config }),
      
      // Runs
      runs: [],
      addRun: (run) => set((state) => ({ runs: [run, ...state.runs] })),
      deleteRun: (id) =>
        set((state) => ({
          runs: state.runs.filter((r) => r.id !== id),
        })),
      clearRuns: () => set({ runs: [] }),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Search
      lastSearchQuery: '',
      setLastSearchQuery: (query) => set({ lastSearchQuery: query }),
      
      // Reset
      reset: () => set({
        agents: [],
        selectedAgentId: null,
        skills: [],
        config: null,
        runs: [],
        theme: 'light',
        lastSearchQuery: '',
      }),
    }),
    {
      name: STORAGE_KEY,
      version: CURRENT_VERSION,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ 
        version: state.version,
        theme: state.theme,
        agents: state.agents,
        selectedAgentId: state.selectedAgentId,
        skills: state.skills,
        config: state.config,
        lastSearchQuery: state.lastSearchQuery,
      }),
    }
  )
)