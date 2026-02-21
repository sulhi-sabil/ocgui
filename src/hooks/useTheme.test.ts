import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'

vi.mock('@store/index', () => ({
  useAppStore: vi.fn((selector: (state: { theme: string; setTheme: (t: string) => void }) => unknown) => {
    const state = {
      theme: 'light',
      setTheme: vi.fn((newTheme: string) => {
        state.theme = newTheme
      }),
    }
    return selector(state)
  }),
}))

describe('useTheme', () => {
  beforeEach(() => {
    vi.spyOn(document.documentElement.classList, 'add')
    vi.spyOn(document.documentElement.classList, 'remove')
  })

  afterEach(() => {
    vi.clearAllMocks()
    document.documentElement.classList.remove('dark')
  })

  it('should return theme and toggle function', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBeDefined()
    expect(result.current.toggleTheme).toBeDefined()
    expect(result.current.setTheme).toBeDefined()
  })

  it('should sync theme to DOM on mount for light theme', () => {
    const addSpy = vi.spyOn(document.documentElement.classList, 'add')
    const removeSpy = vi.spyOn(document.documentElement.classList, 'remove')
    
    renderHook(() => useTheme())

    expect(removeSpy).toHaveBeenCalledWith('dark')
    expect(addSpy).not.toHaveBeenCalled()
  })
})
