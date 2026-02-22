import type { Agent } from '../types'
import { generateId } from './common'

export interface AgentTemplate {
  name: string
  description: string
  defaultTools: Record<string, string>
  defaultPermissions: Record<string, string>
  suggestedSkills: string[]
  defaultTags: string[]
}

export const AGENT_TEMPLATES: Record<string, AgentTemplate> = {
  codeReviewer: {
    name: 'Code Reviewer',
    description: 'Reviews code for quality, security, and best practices',
    defaultTools: {
      read: 'allow',
      grep: 'allow',
      glob: 'allow',
    },
    defaultPermissions: {
      file: 'read',
    },
    suggestedSkills: ['code-review', 'security-analysis'],
    defaultTags: ['code-quality', 'review'],
  },
  testWriter: {
    name: 'Test Writer',
    description: 'Generates unit tests and integration tests for code',
    defaultTools: {
      read: 'allow',
      write: 'allow',
      bash: 'allow',
    },
    defaultPermissions: {
      file: 'write',
      execute: 'ask',
    },
    suggestedSkills: ['testing', 'test-coverage'],
    defaultTags: ['testing', 'quality'],
  },
  documentationAgent: {
    name: 'Documentation Agent',
    description: 'Creates and maintains project documentation',
    defaultTools: {
      read: 'allow',
      write: 'allow',
      glob: 'allow',
    },
    defaultPermissions: {
      file: 'write',
    },
    suggestedSkills: ['documentation', 'markdown'],
    defaultTags: ['documentation', 'content'],
  },
  devopsAgent: {
    name: 'DevOps Agent',
    description: 'Manages CI/CD pipelines and infrastructure',
    defaultTools: {
      bash: 'allow',
      read: 'allow',
      write: 'allow',
    },
    defaultPermissions: {
      execute: 'ask',
      file: 'write',
      network: 'ask',
    },
    suggestedSkills: ['ci-cd', 'docker', 'kubernetes'],
    defaultTags: ['devops', 'infrastructure'],
  },
}

export function createAgentFromTemplate(
  templateKey: keyof typeof AGENT_TEMPLATES,
  overrides?: Partial<Agent>
): Agent {
  const template = AGENT_TEMPLATES[templateKey]
  
  return {
    id: generateId(),
    name: template.name,
    description: template.description,
    tools: { ...template.defaultTools },
    permissions: { ...template.defaultPermissions },
    skills: [...template.suggestedSkills],
    tags: [...template.defaultTags],
    enabled: true,
    ...overrides,
  }
}

export function getTemplateKeys(): string[] {
  return Object.keys(AGENT_TEMPLATES)
}
