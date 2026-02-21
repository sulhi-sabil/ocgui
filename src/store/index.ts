import { useAgentStore } from './agentStore'
import { useSkillStore } from './skillStore'
import { useConfigStore } from './configStore'
import { useRunStore } from './runStore'
import { useUIStore } from './uiStore'
import type { Agent, Skill, Config, Run } from '../types'

export { useAgentStore } from './agentStore'
export { useSkillStore } from './skillStore'
export { useConfigStore } from './configStore'
export { useRunStore } from './runStore'
export { useUIStore } from './uiStore'

interface AppState {
  agents: Agent[]
  selectedAgentId: string | null
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  selectAgent: (id: string | null) => void
  
  skills: Skill[]
  setSkills: (skills: Skill[]) => void
  addSkill: (skill: Skill) => void
  
  config: Config | null
  setConfig: (config: Config) => void
  
  runs: Run[]
  addRun: (run: Run) => void
  
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  
  lastSearchQuery: string
  setLastSearchQuery: (query: string) => void
}

export function useAppStore(): AppState {
  const agentState = useAgentStore()
  const skillState = useSkillStore()
  const configState = useConfigStore()
  const runState = useRunStore()
  const uiState = useUIStore()
  
  return {
    ...agentState,
    ...skillState,
    ...configState,
    ...runState,
    ...uiState,
  }
}
