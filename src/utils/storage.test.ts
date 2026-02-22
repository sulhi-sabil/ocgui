import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { safeStorage } from './storage'

describe('safeStorage', () => {
  let mockLocalStorage: Storage

  beforeEach(() => {
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }
    vi.stubGlobal('localStorage', mockLocalStorage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('getItem', () => {
    it('should return value from localStorage', () => {
      vi.mocked(mockLocalStorage.getItem).mockReturnValue('test-value')

      const result = safeStorage.getItem('test-key')

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
      expect(result).toBe('test-value')
    })

    it('should return null when key does not exist', () => {
      vi.mocked(mockLocalStorage.getItem).mockReturnValue(null)

      const result = safeStorage.getItem('non-existent')

      expect(result).toBeNull()
    })

    it('should return null when localStorage throws', () => {
      vi.mocked(mockLocalStorage.getItem).mockImplementation(() => {
        throw new Error('Storage error')
      })

      const result = safeStorage.getItem('test-key')

      expect(result).toBeNull()
    })
  })

  describe('setItem', () => {
    it('should set value in localStorage', () => {
      safeStorage.setItem('test-key', 'test-value')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value')
    })

    it('should silently fail when localStorage throws', () => {
      vi.mocked(mockLocalStorage.setItem).mockImplementation(() => {
        throw new Error('Quota exceeded')
      })

      expect(() => safeStorage.setItem('test-key', 'test-value')).not.toThrow()
    })
  })

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      safeStorage.removeItem('test-key')

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key')
    })

    it('should silently fail when localStorage throws', () => {
      vi.mocked(mockLocalStorage.removeItem).mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => safeStorage.removeItem('test-key')).not.toThrow()
    })
  })
})
