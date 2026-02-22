import { useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { generateId } from '@utils/index'
import { cn } from '@utils/cn'
import { colors, zIndex, modal, focus, transitions, iconSize } from '@styles/tokens'
import { MODAL } from '@constants/index'
import { useAgentForm } from '@hooks/index'
import { AgentFormFields } from './AgentFormFields'
import type { Agent } from '../types'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const addAgent = useAppStore((state) => state.addAgent)
  const addToast = useToast().addToast
  const nameInputRef = useRef<HTMLInputElement>(null)
  const { formData, errors, setFormData, validate, reset, getAgentData } = useAgentForm()

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
    
    if (!validate()) return

    const agentData = getAgentData()
    const newAgent: Agent = {
      id: generateId(),
      name: agentData.name,
      description: agentData.description,
      model: agentData.model,
      tools: {},
      permissions: {},
      skills: [],
      tags: agentData.tags,
      enabled: true,
    }

    addAgent(newAgent)
    addToast(`Agent "${newAgent.name}" created successfully`, 'success')
    reset()
    onClose()
  }, [validate, getAgentData, addAgent, addToast, reset, onClose])

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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AgentFormFields
            ref={nameInputRef}
            formData={formData}
            errors={errors}
            onFormDataChange={setFormData}
          />

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
