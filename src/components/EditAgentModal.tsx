import { useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@store/index'
import { Button } from './ui/Button'
import { useToast } from './ui/Toast'
import { cn } from '@utils/cn'
import { zIndex, modal } from '@styles/tokens'
import { MODAL } from '@constants/index'
import { useAgentForm } from '@hooks/index'
import { AgentFormFields } from './AgentFormFields'
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
  const { formData, errors, setFormData, validate, getAgentData } = useAgentForm({ agent })

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
    
    if (!agent || !validate()) return

    const agentData = getAgentData()
    updateAgent(agent.id, {
      name: agentData.name,
      description: agentData.description,
      model: agentData.model,
      tags: agentData.tags,
    })
    
    addToast(`Agent "${agentData.name}" updated successfully`, 'success')
    onClose()
  }, [agent, validate, getAgentData, updateAgent, addToast, onClose])

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
          <AgentFormFields
            ref={nameInputRef}
            formData={formData}
            errors={errors}
            onFormDataChange={setFormData}
            nameId="edit-name"
            descriptionId="edit-description"
            modelId="edit-model"
            tagsId="edit-tags"
          />

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
