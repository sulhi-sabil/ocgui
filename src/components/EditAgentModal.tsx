import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { cn } from '@utils/cn'
import { colors, zIndex, modal, formInput, focus, label, typography } from '@styles/tokens'
import { MODAL, UI_TEXT } from '@constants/index'
import type { Agent } from '../types'

interface EditAgentModalProps {
  isOpen: boolean
  onClose: () => void
  agent: Agent | null
}

export function EditAgentModal({ isOpen, onClose, agent }: EditAgentModalProps) {
  const updateAgent = useAppStore((state) => state.updateAgent)
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
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        model: agent.model || '',
        tags: agent.tags.join(', '),
      })
    }
  }, [agent])

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
    
    if (!agent) return

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

    updateAgent(agent.id, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      model: formData.model.trim() || undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    
    addToast(`Agent "${formData.name.trim()}" updated successfully`, 'success')
    setErrors({})
    onClose()
  }, [formData, agent, updateAgent, addToast, onClose])

  if (!isOpen || !agent) return null

  return (
    <div 
      className={cn(modal.backdrop, zIndex.modal)}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className={modal.container}>
        <h2 id="edit-modal-title" className={modal.title}>
          {UI_TEXT.MODAL.EDIT_AGENT_TITLE}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="edit-name" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_NAME} {UI_TEXT.LABELS.REQUIRED}
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="edit-name"
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
              htmlFor="edit-description" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_DESCRIPTION} {UI_TEXT.LABELS.REQUIRED}
            </label>
            <textarea
              id="edit-description"
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
              htmlFor="edit-model" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_MODEL}
            </label>
            <input
              type="text"
              id="edit-model"
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
              htmlFor="edit-tags" 
              className={cn(label.base, label.default)}
            >
              {UI_TEXT.LABELS.AGENT_TAGS}
            </label>
            <input
              type="text"
              id="edit-tags"
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
              {UI_TEXT.BUTTONS.SAVE_CHANGES}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAgentModal
