import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'
import { useAppStore } from '@store/index'

vi.mock('@store/index', () => ({
  useAppStore: vi.fn(),
}))

describe('useTheme', () => {
  let mockSetTheme: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockSetTheme = vi.fn()
    vi.spyOn(document.documentElement.classList, 'add')
    vi.spyOn(document.documentElement.classList, 'remove')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  function mockStore(theme: 'light' | 'dark') {
    vi.mocked(useAppStore).mockImplementation(((selector: (state: { theme: 'light' | 'dark'; setTheme: typeof mockSetTheme }) => unknown) => {
      return selector({ theme, setTheme: mockSetTheme })
    }) as typeof useAppStore)
  }

  it('should return current theme', () => {
    mockStore('light')
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.theme).toBe('light')
  })

  it('should return setTheme function', () => {
    mockStore('light')
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should return toggleTheme function that toggles to dark when light', () => {
    mockStore('light')
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should return toggleTheme function that toggles to light when dark', () => {
    mockStore('dark')
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should sync theme to DOM on mount (light)', () => {
    mockStore('light')
    renderHook(() => useTheme())
    
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark')
  })

  it('should sync theme to DOM on mount (dark)', () => {
    mockStore('dark')
    renderHook(() => useTheme())
    
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
  })
})
