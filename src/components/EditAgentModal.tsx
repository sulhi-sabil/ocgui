import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { cn } from '@utils/cn'
import { colors, zIndex, modal, formInput, focus, label, typography } from '@styles/tokens'
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
      setTimeout(() => nameInputRef.current?.focus(), 50)
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
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
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
          Edit Agent
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="edit-name" 
              className={cn(label.base, label.default)}
            >
              Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder="e.g., Code Reviewer"
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
              Description *
            </label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              rows={3}
              placeholder="Describe what this agent does..."
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
              Model Override (optional)
            </label>
            <input
              type="text"
              id="edit-model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder="e.g., gpt-4, claude-3-opus"
            />
            <p className={cn('mt-1', typography.small, colors.gray[500])}>
              Leave empty to use default model from config
            </p>
          </div>

          <div>
            <label 
              htmlFor="edit-tags" 
              className={cn(label.base, label.default)}
            >
              Tags (optional)
            </label>
            <input
              type="text"
              id="edit-tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder="e.g., code-review, testing, documentation"
            />
            <p className={cn('mt-1', typography.small, colors.gray[500])}>
              Comma-separated tags for categorization
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAgentModal
