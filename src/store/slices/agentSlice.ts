import type { StateCreator } from 'zustand'
import type { Agent } from '../../types'

export interface AgentSlice {
  agents: Agent[]
  selectedAgentId: string | null
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  duplicateAgent: (id: string) => Agent | null
  selectAgent: (id: string | null) => void
}

export const createAgentSlice: StateCreator<AgentSlice, [], [], AgentSlice> = (set, get) => ({
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
    const agent = get().agents.find((a) => a.id === id)
    if (!agent) return null
    
    const duplicated: Agent = {
      ...agent,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${agent.name} (Copy)`,
    }
    
    set((state) => ({ agents: [...state.agents, duplicated] }))
    return duplicated
  },
  selectAgent: (id) => set({ selectedAgentId: id }),
})
