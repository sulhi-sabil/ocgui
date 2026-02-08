import { useEffect, useCallback } from 'react'

interface UseKeyboardShortcutOptions {
  preventDefault?: boolean
  requireMeta?: boolean
  requireCtrl?: boolean
}

/**
 * Hook for registering keyboard shortcuts
 * @param key - The key to listen for (e.g., 'k', 'Enter', 'Escape')
 * @param callback - Function to call when shortcut is triggered
 * @param options - Configuration options
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: UseKeyboardShortcutOptions = {}
) {
  const { preventDefault = true, requireMeta = false, requireCtrl = false } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase()
      const metaMatch = requireMeta ? event.metaKey : true
      const ctrlMatch = requireCtrl ? event.ctrlKey : true

      if (keyMatch && metaMatch && ctrlMatch) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback()
      }
    },
    [key, callback, preventDefault, requireMeta, requireCtrl]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Hook for registering a shortcut that works with either Meta (Cmd) or Ctrl key
 * Useful for cross-platform shortcuts like Cmd+K (Mac) / Ctrl+K (Windows/Linux)
 */
export function usePlatformShortcut(
  key: string,
  callback: () => void,
  options: Omit<UseKeyboardShortcutOptions, 'requireMeta' | 'requireCtrl'> = {}
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase()
      const modifierPressed = event.metaKey || event.ctrlKey

      if (keyMatch && modifierPressed) {
        if (options.preventDefault !== false) {
          event.preventDefault()
        }
        callback()
      }
    },
    [key, callback, options.preventDefault]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
