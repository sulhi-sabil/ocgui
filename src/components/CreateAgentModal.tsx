import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { generateId } from '@utils/index'
import type { Agent } from '../types'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const { addAgent } = useAppStore()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle Escape key and click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
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
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const newAgent: Agent = {
      id: generateId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      model: formData.model.trim() || undefined,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Create New Agent
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Code Reviewer"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe what this agent does..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="model" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Model Override (optional)
            </label>
            <input
              type="text"
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., gpt-4, claude-3-opus"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
