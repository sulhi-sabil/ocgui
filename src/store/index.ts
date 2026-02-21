import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  createAgentSlice, 
  createSkillSlice, 
  createRunSlice, 
  createConfigSlice,
  createUISlice,
  type AgentSlice,
  type SkillSlice,
  type RunSlice,
  type ConfigSlice,
  type UISlice
} from './slices'

type AppState = AgentSlice & SkillSlice & RunSlice & ConfigSlice & UISlice

const createCombinedSlice: StateCreator<AppState, [], [], AppState> = (...args) => ({
  ...createAgentSlice(...args),
  ...createSkillSlice(...args),
  ...createRunSlice(...args),
  ...createConfigSlice(...args),
  ...createUISlice(...args),
})

export const useAppStore = create<AppState>()(
  persist(
    createCombinedSlice,
    {
      name: 'ocgui-storage',
      partialize: (state) => ({ 
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

export type { AppState }
