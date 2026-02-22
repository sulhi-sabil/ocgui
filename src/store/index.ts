import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent, Skill, Config, Run, AgentId, SkillId, RunId } from '../types'
import { generateAgentId, generateSkillId } from '@utils/index'

interface AppState {
  version: number
  // Agent management
  agents: Agent[]
  selectedAgentId: AgentId | null
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: AgentId, updates: Partial<Agent>) => void
  deleteAgent: (id: AgentId) => void
  duplicateAgent: (id: AgentId) => Agent | null
  selectAgent: (id: AgentId | null) => void
  
  // Skill management
  skills: Skill[]
  setSkills: (skills: Skill[]) => void
  addSkill: (skill: Skill) => void
  updateSkill: (id: SkillId, updates: Partial<Skill>) => void
  deleteSkill: (id: SkillId) => void
  duplicateSkill: (id: SkillId) => Skill | null
  
  // Configuration
  config: Config | null
  setConfig: (config: Config) => void
  
  // Execution
  runs: Run[]
  addRun: (run: Run) => void
  deleteRun: (id: RunId) => void
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
      version: 1,
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
          id: generateAgentId(),
          name: `${agent.name} (Copy)`,
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
          id: generateSkillId(),
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
      name: 'ocgui-storage',
      version: 1,
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