import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Config } from '../types'

interface ConfigState {
  config: Config | null
  setConfig: (config: Config) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (config) => set({ config }),
    }),
    {
      name: 'ocgui-config',
    }
  )
)
