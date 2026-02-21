import type { StateCreator } from 'zustand'
import type { Config } from '../../types'

export interface ConfigSlice {
  config: Config | null
  setConfig: (config: Config) => void
}

export const createConfigSlice: StateCreator<ConfigSlice, [], [], ConfigSlice> = (set) => ({
  config: null,
  setConfig: (config) => set({ config }),
})
