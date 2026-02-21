import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcut, usePlatformShortcut } from './useKeyboardShortcut'

describe('useKeyboardShortcut', () => {
  let addEventListenerSpy: MockInstance
  let removeEventListenerSpy: MockInstance

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('should register a keydown event listener on mount', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('k', callback))
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should remove keydown event listener on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useKeyboardShortcut('k', callback))
    
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should call callback when key is pressed', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('k', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'k' })
    document.dispatchEvent(event)
    
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not call callback for different key', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('k', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'j' })
    document.dispatchEvent(event)
    
    expect(callback).not.toHaveBeenCalled()
  })

  it('should prevent default when preventDefault option is true', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('k', callback, { preventDefault: true }))
    
    const event = new KeyboardEvent('keydown', { key: 'k' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should not prevent default when preventDefault option is false', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('k', callback, { preventDefault: false }))
    
    const event = new KeyboardEvent('keydown', { key: 'k' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)
    
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('should handle key case insensitively', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('K', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'k' })
    document.dispatchEvent(event)
    
    expect(callback).toHaveBeenCalled()
  })

  it('should update callback when it changes', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    
    const { rerender } = renderHook(
      ({ callback }) => useKeyboardShortcut('k', callback),
      { initialProps: { callback: callback1 } }
    )
    
    const event = new KeyboardEvent('keydown', { key: 'k' })
    document.dispatchEvent(event)
    expect(callback1).toHaveBeenCalledTimes(1)
    
    rerender({ callback: callback2 })
    document.dispatchEvent(event)
    expect(callback2).toHaveBeenCalledTimes(1)
  })
})

describe('usePlatformShortcut', () => {
  let addEventListenerSpy: MockInstance
  let removeEventListenerSpy: MockInstance

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('should register a keydown event listener on mount', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('k', callback))
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should remove keydown event listener on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => usePlatformShortcut('k', callback))
    
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should call callback when key is pressed with meta key (Mac)', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('k', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    document.dispatchEvent(event)
    
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should call callback when key is pressed with ctrl key (Windows/Linux)', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('k', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    document.dispatchEvent(event)
    
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not call callback when no modifier is pressed', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('k', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'k' })
    document.dispatchEvent(event)
    
    expect(callback).not.toHaveBeenCalled()
  })

  it('should prevent default by default', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('k', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should not prevent default when preventDefault is false', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('k', callback, { preventDefault: false }))
    
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)
    
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('should handle key case insensitively', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('K', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    document.dispatchEvent(event)
    
    expect(callback).toHaveBeenCalled()
  })

  it('should not trigger for different key even with modifier', () => {
    const callback = vi.fn()
    renderHook(() => usePlatformShortcut('k', callback))
    
    const event = new KeyboardEvent('keydown', { key: 'j', metaKey: true })
    document.dispatchEvent(event)
    
    expect(callback).not.toHaveBeenCalled()
  })
})
