import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedValue } from './useDebouncedValue'
import { SEARCH } from '@constants/index'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial'))
    
    expect(result.current[0]).toBe('initial')
  })

  it('should use default delay from SEARCH.DEBOUNCE_MS', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      { initialProps: { value: 'initial' } }
    )
    
    rerender({ value: 'updated' })
    
    expect(result.current[0]).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(SEARCH.DEBOUNCE_MS - 1)
    })
    
    expect(result.current[0]).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(1)
    })
    
    expect(result.current[0]).toBe('updated')
  })

  it('should debounce value changes with custom delay', () => {
    const customDelay = 500
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: customDelay } }
    )
    
    rerender({ value: 'updated', delay: customDelay })
    
    expect(result.current[0]).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(customDelay - 1)
    })
    
    expect(result.current[0]).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(1)
    })
    
    expect(result.current[0]).toBe('updated')
  })

  it('should cancel pending update on value change', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'initial' } }
    )
    
    rerender({ value: 'first' })
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    rerender({ value: 'second' })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current[0]).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    expect(result.current[0]).toBe('second')
  })

  it('should work with different value types', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 0 } }
    )
    
    rerender({ value: 42 })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current[0]).toBe(42)
  })

  it('should work with object values', () => {
    const initialObj = { name: 'initial' }
    const updatedObj = { name: 'updated' }
    
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: initialObj } }
    )
    
    rerender({ value: updatedObj })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current[0]).toEqual(updatedObj)
  })

  it('should work with array values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: [1, 2, 3] } }
    )
    
    rerender({ value: [4, 5, 6] })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current[0]).toEqual([4, 5, 6])
  })

  it('should work with null and undefined', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: null as string | null } }
    )
    
    expect(result.current[0]).toBeNull()
    
    rerender({ value: 'not null' })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current[0]).toBe('not null')
    
    rerender({ value: null })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current[0]).toBeNull()
  })

  it('should set value immediately with setImmediate function', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 300))
    
    expect(result.current[0]).toBe('initial')
    
    act(() => {
      result.current[1]('immediate')
    })
    
    expect(result.current[0]).toBe('immediate')
  })

  it('should cancel pending debounce when setImmediate is called', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'initial' } }
    )
    
    rerender({ value: 'debounced' })
    
    act(() => {
      vi.advanceTimersByTime(150)
    })
    
    expect(result.current[0]).toBe('initial')
    
    act(() => {
      result.current[1]('immediate')
    })
    
    expect(result.current[0]).toBe('immediate')
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current[0]).toBe('immediate')
  })

  it('should cleanup timeout on unmount', () => {
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'initial' } }
    )
    
    rerender({ value: 'updated' })
    
    unmount()
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(vi.getTimerCount()).toBe(0)
  })

  it('should handle rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } }
    )
    
    for (let i = 0; i < 10; i++) {
      rerender({ value: String.fromCharCode(98 + i) })
      act(() => {
        vi.advanceTimersByTime(50)
      })
    }
    
    expect(result.current[0]).toBe('a')
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current[0]).toBe('k')
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 0),
      { initialProps: { value: 'initial' } }
    )
    
    rerender({ value: 'updated' })
    
    act(() => {
      vi.advanceTimersByTime(0)
    })
    
    expect(result.current[0]).toBe('updated')
  })
})
