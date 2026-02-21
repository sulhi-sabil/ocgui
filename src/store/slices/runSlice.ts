import type { StateCreator } from 'zustand'
import type { Run } from '../../types'

export interface RunSlice {
  runs: Run[]
  addRun: (run: Run) => void
  deleteRun: (id: string) => void
  clearRuns: () => void
}

export const createRunSlice: StateCreator<RunSlice, [], [], RunSlice> = (set) => ({
  runs: [],
  addRun: (run) => set((state) => ({ runs: [run, ...state.runs] })),
  deleteRun: (id) =>
    set((state) => ({
      runs: state.runs.filter((r) => r.id !== id),
    })),
  clearRuns: () => set({ runs: [] }),
})
