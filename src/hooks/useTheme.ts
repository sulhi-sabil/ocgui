import { useEffect, useCallback } from 'react'
import { useAppStore } from '@store/index'

type Theme = 'light' | 'dark'

interface UseThemeResult {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

function syncThemeToDOM(theme: Theme): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function useTheme(): UseThemeResult {
  const theme = useAppStore((state) => state.theme)
  const setThemeInStore = useAppStore((state) => state.setTheme)

  useEffect(() => {
    syncThemeToDOM(theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeInStore(newTheme)
  }, [setThemeInStore])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setThemeInStore(newTheme)
  }, [theme, setThemeInStore])

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
