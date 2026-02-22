import { describe, it, expect } from 'vitest'
import { TOAST, ANIMATION, MODAL, SEARCH, AGENT, SKILL, APP } from './index'

describe('constants', () => {
  describe('TOAST', () => {
    it('should have default duration of 5000ms', () => {
      expect(TOAST.DEFAULT_DURATION_MS).toBe(5000)
    })

    it('should have max visible count', () => {
      expect(TOAST.MAX_VISIBLE).toBe(5)
    })
  })

  describe('ANIMATION', () => {
    it('should have default duration', () => {
      expect(ANIMATION.DEFAULT_DURATION_MS).toBe(200)
    })

    it('should have fast duration', () => {
      expect(ANIMATION.FAST_DURATION_MS).toBe(150)
    })

    it('should have slow duration', () => {
      expect(ANIMATION.SLOW_DURATION_MS).toBe(300)
    })
  })

  describe('MODAL', () => {
    it('should have focus delay', () => {
      expect(MODAL.FOCUS_DELAY_MS).toBe(50)
    })

    it('should have default max width', () => {
      expect(MODAL.DEFAULT_MAX_WIDTH).toBe('max-w-md')
    })
  })

  describe('SEARCH', () => {
    it('should have debounce time', () => {
      expect(SEARCH.DEBOUNCE_MS).toBe(300)
    })

    it('should have min query length', () => {
      expect(SEARCH.MIN_QUERY_LENGTH).toBe(2)
    })
  })

  describe('AGENT', () => {
    it('should have name copy suffix', () => {
      expect(AGENT.NAME_COPY_SUFFIX).toBe(' (Copy)')
    })
  })

  describe('SKILL', () => {
    it('should have name copy suffix', () => {
      expect(SKILL.NAME_COPY_SUFFIX).toBe(' (Copy)')
    })
  })

  describe('APP', () => {
    it('should have name', () => {
      expect(APP.NAME).toBe('OpenCode GUI')
    })

    it('should have description', () => {
      expect(APP.DESCRIPTION).toBe('Desktop Control Center for OpenCode CLI')
    })

    it('should have max content width', () => {
      expect(APP.MAX_CONTENT_WIDTH).toBe('max-w-7xl')
    })
  })
})
