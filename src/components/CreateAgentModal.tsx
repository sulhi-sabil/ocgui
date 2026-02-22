import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { generateId } from '@utils/index'
import { cn } from '@utils/cn'
import { colors, zIndex, modal, formInput, focus, label, typography, iconSize, transitions } from '@styles/tokens'
import { MODAL, UI_TEXT } from '@constants/index'
import type { Agent } from '../types'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const addAgent = useAppStore((state) => state.addAgent)
  const addToast = useToast().addToast
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: '',
    tags: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setTimeout(() => nameInputRef.current?.focus(), MODAL.FOCUS_DELAY_MS)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = UI_TEXT.ERRORS.NAME_REQUIRED
    }
    if (!formData.description.trim()) {
      newErrors.description = UI_TEXT.ERRORS.DESCRIPTION_REQUIRED
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newAgent: Agent = {
      id: generateId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      model: formData.model.trim() || undefined,
      tools: {},
      permissions: {},
      skills: [],
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      enabled: true,
    }

    addAgent(newAgent)
    addToast(`Agent "${newAgent.name}" created successfully`, 'success')
    setFormData({ name: '', description: '', model: '', tags: '' })
    setErrors({})
    onClose()
  }, [formData, addAgent, addToast, onClose])

  if (!isOpen) return null

  return (
    <div 
      className={cn(modal.backdrop, zIndex.modal)}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={modal.container}>
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className={modal.title}>
            {UI_TEXT.MODAL.CREATE_AGENT_TITLE}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1 rounded-lg',
              colors.gray[100],
              'hover:bg-gray-200 dark:hover:bg-gray-600',
              transitions.colors,
              focus.ring
            )}
            aria-label="Close modal"
          >
            <svg className={iconSize.md} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_NAME} {UI_TEXT.LABELS.REQUIRED}
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder={UI_TEXT.PLACEHOLDERS.AGENT_NAME}
            />
            {errors.name && (
              <p className={cn('mt-1', typography.body, colors.error.text)}>{errors.name}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="description" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_DESCRIPTION} {UI_TEXT.LABELS.REQUIRED}
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              rows={3}
              placeholder={UI_TEXT.PLACEHOLDERS.AGENT_DESCRIPTION}
            />
            {errors.description && (
              <p className={cn('mt-1', typography.body, colors.error.text)}>{errors.description}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="model" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_MODEL}
            </label>
            <input
              type="text"
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder={UI_TEXT.PLACEHOLDERS.AGENT_MODEL}
            />
            <p className={cn('mt-1', typography.small, colors.gray[500])}>
              {UI_TEXT.HINTS.MODEL_DEFAULT}
            </p>
          </div>

          <div>
            <label 
              htmlFor="tags" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_TAGS}
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder={UI_TEXT.PLACEHOLDERS.AGENT_TAGS}
            />
            <p className={cn('mt-1', typography.small, colors.gray[500])}>
              {UI_TEXT.HINTS.TAGS_FORMAT}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              {UI_TEXT.BUTTONS.CANCEL}
            </Button>
            <Button type="submit" className="flex-1">
              {UI_TEXT.BUTTONS.CREATE_AGENT}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAgentModal
