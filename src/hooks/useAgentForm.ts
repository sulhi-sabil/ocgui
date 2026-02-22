import { useState, useCallback, useEffect } from 'react'
import type { Agent } from '../types'

export interface AgentFormData {
  name: string
  description: string
  model: string
  tags: string
}

export interface AgentFormErrors {
  name?: string
  description?: string
}

export interface UseAgentFormOptions {
  agent?: Agent | null
}

export interface UseAgentFormReturn {
  formData: AgentFormData
  errors: AgentFormErrors
  setFormData: React.Dispatch<React.SetStateAction<AgentFormData>>
  setErrors: React.Dispatch<React.SetStateAction<AgentFormErrors>>
  validate: () => boolean
  reset: () => void
  getAgentData: () => { name: string; description: string; model: string | undefined; tags: string[] }
}

const DEFAULT_FORM_DATA: AgentFormData = {
  name: '',
  description: '',
  model: '',
  tags: '',
}

export function useAgentForm(options: UseAgentFormOptions = {}): UseAgentFormReturn {
  const { agent } = options
  const [formData, setFormData] = useState<AgentFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<AgentFormErrors>({})

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

  const validate = useCallback((): boolean => {
    const newErrors: AgentFormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const reset = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
  }, [])

  const getAgentData = useCallback(() => ({
    name: formData.name.trim(),
    description: formData.description.trim(),
    model: formData.model.trim() || undefined,
    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
  }), [formData])

  return {
    formData,
    errors,
    setFormData,
    setErrors,
    validate,
    reset,
    getAgentData,
  }
}
