import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { generateId, sanitize } from '@utils/index'
import { cn } from '@utils/cn'
import { colors, zIndex, modal, formInput, focus, label, typography } from '@styles/tokens'
import type { Agent } from '../types'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const { addAgent } = useAppStore()
  const { addToast } = useToast()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const trimmedName = formData.name.trim()
    const trimmedDesc = formData.description.trim()
    
    if (!trimmedName) {
      newErrors.name = 'Name is required'
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Name must be 100 characters or less'
    }
    if (!trimmedDesc) {
      newErrors.description = 'Description is required'
    } else if (trimmedDesc.length > 500) {
      newErrors.description = 'Description must be 500 characters or less'
    }
    if (formData.model.trim().length > 100) {
      newErrors.model = 'Model must be 100 characters or less'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const sanitizedName = sanitize(formData.name, 100)
    const sanitizedDescription = sanitize(formData.description, 500)
    const sanitizedModel = sanitize(formData.model, 100)

    const newAgent: Agent = {
      id: generateId(),
      name: sanitizedName,
      description: sanitizedDescription,
      model: sanitizedModel || undefined,
      tools: {},
      permissions: {},
      skills: [],
      enabled: true,
    }

    addAgent(newAgent)
    addToast(`Agent "${newAgent.name}" created successfully`, 'success')
    setFormData({ name: '', description: '', model: '' })
    setErrors({})
    onClose()
  }

  return (
    <div 
      className={cn(modal.backdrop, zIndex.modal)}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={modal.container}>
        <h2 id="modal-title" className={modal.title}>
          Create New Agent
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className={cn(label.base, label.default)}
            >
              Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={100}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder="e.g., Code Reviewer"
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
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
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
              htmlFor="model" 
              className={cn(label.base, label.default)}
            >
              Model Override (optional)
            </label>
            <input
              type="text"
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              maxLength={100}
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder="e.g., gpt-4, claude-3-opus"
            />
            <p className={cn('mt-1', typography.small, colors.gray[500])}>
              Leave empty to use default model from config
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAgentModal
