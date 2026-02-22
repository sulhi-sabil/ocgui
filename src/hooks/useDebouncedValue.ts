import { useState, useEffect, useRef, useCallback } from 'react'
import { SEARCH } from '@constants/index'

export function useDebouncedValue<T>(
  value: T,
  delay: number = SEARCH.DEBOUNCE_MS
): [T, (newValue: T) => void] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    cancelTimeout()
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return cancelTimeout
  }, [value, delay, cancelTimeout])

  const setImmediate = useCallback((newValue: T) => {
    cancelTimeout()
    setDebouncedValue(newValue)
  }, [cancelTimeout])

  return [debouncedValue, setImmediate]
}
