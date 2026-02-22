import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcut, usePlatformShortcut } from './useKeyboardShortcut'

describe('useKeyboardShortcut', () => {
  let callback: ReturnType<typeof vi.fn>
  
  beforeEach(() => {
    callback = vi.fn()
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  function fireKeyEvent(key: string, options: Partial<KeyboardEvent> = {}) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)
    return { event, preventDefaultSpy }
  }

  it('should call callback when key is pressed', () => {
    renderHook(() => useKeyboardShortcut('k', callback))
    
    fireKeyEvent('k')
    
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should be case-insensitive', () => {
    renderHook(() => useKeyboardShortcut('K', callback))
    
    fireKeyEvent('k')
    fireKeyEvent('K')
    
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should prevent default behavior by default', () => {
    renderHook(() => useKeyboardShortcut('k', callback))
    
    const { preventDefaultSpy } = fireKeyEvent('k')
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should not prevent default when preventDefault is false', () => {
    renderHook(() => useKeyboardShortcut('k', callback, { preventDefault: false }))
    
    const { preventDefaultSpy } = fireKeyEvent('k')
    
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('should require meta key when requireMeta is true', () => {
    renderHook(() => useKeyboardShortcut('k', callback, { requireMeta: true }))
    
    fireKeyEvent('k', { metaKey: false })
    expect(callback).not.toHaveBeenCalled()
    
    fireKeyEvent('k', { metaKey: true })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should require ctrl key when requireCtrl is true', () => {
    renderHook(() => useKeyboardShortcut('k', callback, { requireCtrl: true }))
    
    fireKeyEvent('k', { ctrlKey: false })
    expect(callback).not.toHaveBeenCalled()
    
    fireKeyEvent('k', { ctrlKey: true })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should require shift key when requireShift is true', () => {
    renderHook(() => useKeyboardShortcut('k', callback, { requireShift: true }))
    
    fireKeyEvent('k', { shiftKey: false })
    expect(callback).not.toHaveBeenCalled()
    
    fireKeyEvent('k', { shiftKey: true })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should work with multiple modifiers combined', () => {
    renderHook(() => useKeyboardShortcut('k', callback, { requireCtrl: true, requireShift: true }))
    
    fireKeyEvent('k', { ctrlKey: true, shiftKey: false })
    expect(callback).not.toHaveBeenCalled()
    
    fireKeyEvent('k', { ctrlKey: false, shiftKey: true })
    expect(callback).not.toHaveBeenCalled()
    
    fireKeyEvent('k', { ctrlKey: true, shiftKey: true })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not trigger for different keys', () => {
    renderHook(() => useKeyboardShortcut('k', callback))
    
    fireKeyEvent('j')
    fireKeyEvent('l')
    fireKeyEvent('Escape')
    
    expect(callback).not.toHaveBeenCalled()
  })

  it('should cleanup event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardShortcut('k', callback))
    
    unmount()
    
    fireKeyEvent('k')
    
    expect(callback).not.toHaveBeenCalled()
  })
})

describe('usePlatformShortcut', () => {
  let callback: ReturnType<typeof vi.fn>
  
  beforeEach(() => {
    callback = vi.fn()
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  function fireKeyEvent(key: string, options: Partial<KeyboardEvent> = {}) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)
    return { event, preventDefaultSpy }
  }

  it('should trigger with meta key (Mac)', () => {
    renderHook(() => usePlatformShortcut('k', callback))
    
    fireKeyEvent('k', { metaKey: true })
    
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should trigger with ctrl key (Windows/Linux)', () => {
    renderHook(() => usePlatformShortcut('k', callback))
    
    fireKeyEvent('k', { ctrlKey: true })
    
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not trigger without modifier key', () => {
    renderHook(() => usePlatformShortcut('k', callback))
    
    fireKeyEvent('k')
    
    expect(callback).not.toHaveBeenCalled()
  })

  it('should prevent default by default', () => {
    renderHook(() => usePlatformShortcut('k', callback))
    
    const { preventDefaultSpy } = fireKeyEvent('k', { metaKey: true })
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should not prevent default when explicitly disabled', () => {
    renderHook(() => usePlatformShortcut('k', callback, { preventDefault: false }))
    
    const { preventDefaultSpy } = fireKeyEvent('k', { metaKey: true })
    
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('should cleanup event listener on unmount', () => {
    const { unmount } = renderHook(() => usePlatformShortcut('k', callback))
    
    unmount()
    
    fireKeyEvent('k', { metaKey: true })
    
    expect(callback).not.toHaveBeenCalled()
  })
})
