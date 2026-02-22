import { type StateStorage } from 'zustand/middleware'

export const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name)
      return value
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // Storage quota exceeded or unavailable - silently fail
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      // Storage unavailable - silently fail
    }
  },
}
