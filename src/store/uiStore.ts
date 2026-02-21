import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  lastSearchQuery: string
  setLastSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      lastSearchQuery: '',
      setLastSearchQuery: (query) => set({ lastSearchQuery: query }),
    }),
    {
      name: 'ocgui-ui',
    }
  )
)
