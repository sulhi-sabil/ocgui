import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent } from '../types'

interface AgentState {
  agents: Agent[]
  selectedAgentId: string | null
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  selectAgent: (id: string | null) => void
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
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
      selectAgent: (id) => set({ selectedAgentId: id }),
    }),
    {
      name: 'ocgui-agents',
    }
  )
)
