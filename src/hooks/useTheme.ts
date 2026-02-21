import { useEffect, useCallback } from 'react'
import { useAppStore } from '@store/index'

type Theme = 'light' | 'dark'

function syncThemeToDOM(theme: Theme): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function useTheme() {
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  useEffect(() => {
    syncThemeToDOM(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    syncThemeToDOM(newTheme)
  }, [theme, setTheme])

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
