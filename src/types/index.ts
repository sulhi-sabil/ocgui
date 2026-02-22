export type Brand<T, B> = T & { __brand: B }

export type AgentId = Brand<string, 'AgentId'>
export type SkillId = Brand<string, 'SkillId'>
export type RunId = Brand<string, 'RunId'>

export interface Agent {
  id: AgentId
  name: string
  description: string
  model?: string
  tools: Record<string, string>
  permissions: Record<string, string>
  skills: string[]
  tags: string[]
  enabled: boolean
}

export interface Skill {
  id: SkillId
  name: string
  description: string
  content: string
  commands: string[]
  path: string
}

export interface Tool {
  name: string
  description: string
  parameters: Record<string, unknown>
  permission: 'allow' | 'deny' | 'ask'
}

export interface Config {
  providers: Record<string, unknown>
  agents: Agent[]
  tools: Record<string, Tool>
  experimental: Record<string, boolean>
}

export interface Run {
  id: RunId
  sessionId: string
  timestamp: number
  agent: string
  model: string
  input: string
  output: string
  toolsUsed: string[]
  exitStatus: number
}

export interface RunLog {
  id: number
  runId: RunId
  logLine: string
  logType: 'info' | 'error' | 'warning' | 'tool_call'
  timestamp: number
}
