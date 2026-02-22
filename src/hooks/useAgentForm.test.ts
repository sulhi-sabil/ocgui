import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAgentForm } from './useAgentForm'
import type { Agent } from '../types'

describe('useAgentForm', () => {
  const mockAgent: Agent = {
    id: '1',
    name: 'Test Agent',
    description: 'Test description',
    model: 'gpt-4',
    tools: {},
    permissions: {},
    skills: [],
    tags: ['tag1', 'tag2'],
    enabled: true,
  }

  it('initializes with default empty values', () => {
    const { result } = renderHook(() => useAgentForm())
    
    expect(result.current.formData.name).toBe('')
    expect(result.current.formData.description).toBe('')
    expect(result.current.formData.model).toBe('')
    expect(result.current.formData.tags).toBe('')
  })

  it('initializes with agent values when provided', () => {
    const { result } = renderHook(() => useAgentForm({ agent: mockAgent }))
    
    expect(result.current.formData.name).toBe('Test Agent')
    expect(result.current.formData.description).toBe('Test description')
    expect(result.current.formData.model).toBe('gpt-4')
    expect(result.current.formData.tags).toBe('tag1, tag2')
  })

  it('handles agent without model', () => {
    const agentWithoutModel = { ...mockAgent, model: undefined }
    const { result } = renderHook(() => useAgentForm({ agent: agentWithoutModel }))
    
    expect(result.current.formData.model).toBe('')
  })

  it('handles agent with empty tags', () => {
    const agentWithoutTags = { ...mockAgent, tags: [] }
    const { result } = renderHook(() => useAgentForm({ agent: agentWithoutTags }))
    
    expect(result.current.formData.tags).toBe('')
  })

  it('validates required fields correctly', () => {
    const { result } = renderHook(() => useAgentForm())
    
    let isValid: boolean
    act(() => {
      isValid = result.current.validate()
    })
    
    expect(isValid!).toBe(false)
    expect(result.current.errors.name).toBe('Name is required')
    expect(result.current.errors.description).toBe('Description is required')
  })

  it('validates name only when description is provided', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({ ...result.current.formData, description: 'Test description' })
    })
    
    let isValid: boolean
    act(() => {
      isValid = result.current.validate()
    })
    
    expect(isValid!).toBe(false)
    expect(result.current.errors.name).toBe('Name is required')
    expect(result.current.errors.description).toBeUndefined()
  })

  it('validates description only when name is provided', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({ ...result.current.formData, name: 'Test Agent' })
    })
    
    let isValid: boolean
    act(() => {
      isValid = result.current.validate()
    })
    
    expect(isValid!).toBe(false)
    expect(result.current.errors.name).toBeUndefined()
    expect(result.current.errors.description).toBe('Description is required')
  })

  it('passes validation when all required fields are provided', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({
        name: 'Test Agent',
        description: 'Test description',
        model: '',
        tags: '',
      })
    })
    
    let isValid: boolean
    act(() => {
      isValid = result.current.validate()
    })
    
    expect(isValid!).toBe(true)
    expect(result.current.errors.name).toBeUndefined()
    expect(result.current.errors.description).toBeUndefined()
  })

  it('resets form data and errors', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({
        name: 'Test Agent',
        description: 'Test description',
        model: 'gpt-4',
        tags: 'tag1, tag2',
      })
      result.current.validate()
    })
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.formData.name).toBe('')
    expect(result.current.formData.description).toBe('')
    expect(result.current.formData.model).toBe('')
    expect(result.current.formData.tags).toBe('')
    expect(result.current.errors.name).toBeUndefined()
    expect(result.current.errors.description).toBeUndefined()
  })

  it('returns correct agent data from getAgentData', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({
        name: '  Test Agent  ',
        description: '  Test description  ',
        model: '  gpt-4  ',
        tags: '  tag1 , tag2 , tag3  ',
      })
    })
    
    const agentData = result.current.getAgentData()
    
    expect(agentData.name).toBe('Test Agent')
    expect(agentData.description).toBe('Test description')
    expect(agentData.model).toBe('gpt-4')
    expect(agentData.tags).toEqual(['tag1', 'tag2', 'tag3'])
  })

  it('returns undefined model when empty', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({
        name: 'Test Agent',
        description: 'Test description',
        model: '',
        tags: '',
      })
    })
    
    const agentData = result.current.getAgentData()
    
    expect(agentData.model).toBeUndefined()
  })

  it('filters empty tags from getAgentData', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({
        name: 'Test Agent',
        description: 'Test description',
        model: '',
        tags: 'tag1, , tag2, ,',
      })
    })
    
    const agentData = result.current.getAgentData()
    
    expect(agentData.tags).toEqual(['tag1', 'tag2'])
  })

  it('updates form data when agent prop changes', () => {
    const { result, rerender } = renderHook(
      ({ agent }) => useAgentForm({ agent }),
      { initialProps: { agent: null as Agent | null } }
    )
    
    expect(result.current.formData.name).toBe('')
    
    rerender({ agent: mockAgent })
    
    expect(result.current.formData.name).toBe('Test Agent')
    expect(result.current.formData.description).toBe('Test description')
  })

  it('allows manual form data updates', () => {
    const { result } = renderHook(() => useAgentForm())
    
    act(() => {
      result.current.setFormData({
        name: 'New Name',
        description: 'New Description',
        model: 'claude-3',
        tags: 'new-tag',
      })
    })
    
    expect(result.current.formData.name).toBe('New Name')
    expect(result.current.formData.description).toBe('New Description')
    expect(result.current.formData.model).toBe('claude-3')
    expect(result.current.formData.tags).toBe('new-tag')
  })
})
