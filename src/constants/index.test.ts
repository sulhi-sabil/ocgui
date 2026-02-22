import { describe, it, expect } from 'vitest'
import { TOAST, ANIMATION, MODAL, SEARCH, AGENT, APP, UI_TEXT } from './index'

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

  describe('UI_TEXT', () => {
    it('should have button labels', () => {
      expect(UI_TEXT.BUTTONS.ADD_AGENT).toBe('Add Agent')
      expect(UI_TEXT.BUTTONS.CREATE_AGENT).toBe('Create Agent')
      expect(UI_TEXT.BUTTONS.CANCEL).toBe('Cancel')
      expect(UI_TEXT.BUTTONS.DELETE).toBe('Delete')
      expect(UI_TEXT.BUTTONS.DUPLICATE).toBe('Duplicate')
      expect(UI_TEXT.BUTTONS.EDIT).toBe('Edit')
    })

    it('should have placeholders', () => {
      expect(UI_TEXT.PLACEHOLDERS.SEARCH_AGENTS).toBe('Search agents...')
      expect(UI_TEXT.PLACEHOLDERS.AGENT_NAME).toBe('e.g., Code Reviewer')
    })

    it('should have error messages', () => {
      expect(UI_TEXT.ERRORS.NAME_REQUIRED).toBe('Name is required')
      expect(UI_TEXT.ERRORS.DESCRIPTION_REQUIRED).toBe('Description is required')
    })

    it('should have dialog messages', () => {
      expect(UI_TEXT.DIALOG.DELETE_AGENT_TITLE).toBe('Delete Agent')
      expect(UI_TEXT.DIALOG.DELETE_AGENT_MESSAGE).toContain('{name}')
    })

    it('should have empty state text', () => {
      expect(UI_TEXT.EMPTY_STATE.NO_AGENTS_TITLE).toBe('No agents yet')
      expect(UI_TEXT.EMPTY_STATE.NO_MATCHES_TITLE).toBe('No matching agents found')
    })

    it('should have getting started steps', () => {
      expect(UI_TEXT.GETTING_STARTED.TITLE).toBe('Getting Started')
      expect(UI_TEXT.GETTING_STARTED.STEPS).toHaveLength(4)
    })

    it('should have tags more template', () => {
      expect(UI_TEXT.TAGS.MORE).toBe('+{count} more')
    })
  })
})
