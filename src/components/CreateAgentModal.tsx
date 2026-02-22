import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { generateId, AGENT_TEMPLATES, createAgentFromTemplate } from '@utils/index'
import { cn } from '@utils/cn'
import { colors, zIndex, modal, formInput, focus, label, typography, iconSize, transitions } from '@styles/tokens'
import { MODAL } from '@constants/index'
import type { Agent } from '../types'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const addAgent = useAppStore((state) => state.addAgent)
  const addToast = useToast().addToast
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
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

  const handleTemplateSelect = useCallback((templateKey: string) => {
    const template = AGENT_TEMPLATES[templateKey]
    if (!template) return
    
    setSelectedTemplate(templateKey)
    setFormData({
      name: template.name,
      description: template.description,
      model: '',
      tags: template.defaultTags.join(', '),
    })
    setErrors({})
  }, [])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
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

    let newAgent: Agent
    if (selectedTemplate && AGENT_TEMPLATES[selectedTemplate]) {
      newAgent = createAgentFromTemplate(selectedTemplate as keyof typeof AGENT_TEMPLATES, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        model: formData.model.trim() || undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
    } else {
      newAgent = {
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
    }

    addAgent(newAgent)
    addToast(`Agent "${newAgent.name}" created successfully`, 'success')
    setFormData({ name: '', description: '', model: '', tags: '' })
    setSelectedTemplate(null)
    setErrors({})
    onClose()
  }, [formData, selectedTemplate, addAgent, addToast, onClose])

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
            Create New Agent
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
        
        <div className="mb-4">
          <p className={cn(typography.body, colors.gray[600], 'mb-2')}>Start from a template (optional)</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AGENT_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTemplateSelect(key)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full border',
                  transitions.colors,
                  focus.ring,
                  selectedTemplate === key
                    ? cn(colors.primary[600], 'text-white border-transparent')
                    : cn(colors.gray[100], colors.gray[200], 'hover:border-gray-300 dark:hover:border-gray-500')
                )}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
        
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
              className={cn(formInput.base, formInput.default, focus.ring)}
              placeholder="e.g., gpt-4, claude-3-opus"
            />
            <p className={cn('mt-1', typography.small, colors.gray[500])}>
              Leave empty to use default model from config
            </p>
          </div>

          <div>
            <label 
              htmlFor="tags" 
              className={cn(label.base, label.default)}
            >
              Tags (optional)
            </label>
            <input
              type="text"
              id="tags"
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
              Create Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAgentModal
