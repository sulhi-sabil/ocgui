import type { StateCreator } from 'zustand'

export interface UISlice {
  theme: 'light' | 'dark'
  lastSearchQuery: string
  setTheme: (theme: 'light' | 'dark') => void
  setLastSearchQuery: (query: string) => void
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  theme: 'light',
  lastSearchQuery: '',
  setTheme: (theme) => set({ theme }),
  setLastSearchQuery: (query) => set({ lastSearchQuery: query }),
})
