import { forwardRef } from 'react'
import { cn } from '@utils/cn'
import { colors, formInput, focus, label, typography } from '@styles/tokens'
import type { AgentFormData, AgentFormErrors } from '@hooks/useAgentForm'

interface AgentFormFieldsProps {
  formData: AgentFormData
  errors: AgentFormErrors
  onFormDataChange: (data: AgentFormData) => void
  nameId?: string
  descriptionId?: string
  modelId?: string
  tagsId?: string
}

export const AgentFormFields = forwardRef<HTMLInputElement, AgentFormFieldsProps>(
  function AgentFormFields(
    { formData, errors, onFormDataChange, nameId = 'name', descriptionId = 'description', modelId = 'model', tagsId = 'tags' },
    ref
  ) {
    return (
      <>
        <div>
          <label htmlFor={nameId} className={cn(label.base, label.default)}>
            Name *
          </label>
          <input
            ref={ref}
            type="text"
            id={nameId}
            value={formData.name}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            className={cn(formInput.base, formInput.default, focus.ring)}
            placeholder="e.g., Code Reviewer"
          />
          {errors.name && (
            <p className={cn('mt-1', typography.body, colors.error.text)}>{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor={descriptionId} className={cn(label.base, label.default)}>
            Description *
          </label>
          <textarea
            id={descriptionId}
            value={formData.description}
            onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
            className={cn(formInput.base, formInput.default, focus.ring)}
            rows={3}
            placeholder="Describe what this agent does..."
          />
          {errors.description && (
            <p className={cn('mt-1', typography.body, colors.error.text)}>{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor={modelId} className={cn(label.base, label.default)}>
            Model Override (optional)
          </label>
          <input
            type="text"
            id={modelId}
            value={formData.model}
            onChange={(e) => onFormDataChange({ ...formData, model: e.target.value })}
            className={cn(formInput.base, formInput.default, focus.ring)}
            placeholder="e.g., gpt-4, claude-3-opus"
          />
          <p className={cn('mt-1', typography.small, colors.gray[500])}>
            Leave empty to use default model from config
          </p>
        </div>

        <div>
          <label htmlFor={tagsId} className={cn(label.base, label.default)}>
            Tags (optional)
          </label>
          <input
            type="text"
            id={tagsId}
            value={formData.tags}
            onChange={(e) => onFormDataChange({ ...formData, tags: e.target.value })}
            className={cn(formInput.base, formInput.default, focus.ring)}
            placeholder="e.g., code-review, testing, documentation"
          />
          <p className={cn('mt-1', typography.small, colors.gray[500])}>
            Comma-separated tags for categorization
          </p>
        </div>
      </>
    )
  }
)
