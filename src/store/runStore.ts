import { create } from 'zustand'
import type { Run } from '../types'

interface RunState {
  runs: Run[]
  addRun: (run: Run) => void
}

export const useRunStore = create<RunState>()((set) => ({
  runs: [],
  addRun: (run) => set((state) => ({ runs: [run, ...state.runs] })),
}))
