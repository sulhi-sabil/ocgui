export interface AgentBehavior {
  selfHeal?: boolean
  selfLearn?: boolean
  selfEvolve?: boolean
  maximizePotential?: boolean
}

export interface AgentHooks {
  preToolUse?: string[]
  postToolUse?: string[]
  userPromptSubmit?: string[]
  stop?: string[]
}

export interface AgentRuntimeConfig {
  temperature?: number
  maxTokens?: number
  contextWindow?: number
  responseFormat?: 'text' | 'json'
}

export interface AgentPermissions {
  read?: boolean
  write?: boolean
  execute?: boolean
  git?: boolean
  network?: boolean
}

export interface Agent {
  id: string
  name: string
  description: string
  version?: string
  model?: string
  capabilities?: string[]
  behavior?: AgentBehavior
  tools: Record<string, string>
  permissions: Record<string, string> | AgentPermissions
  hooks?: AgentHooks
  mcpServers?: string[]
  skills: string[]
  tags: string[]
  enabled: boolean
  config?: AgentRuntimeConfig
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  commands: string[];
  path: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  permission: 'allow' | 'deny' | 'ask';
}

export interface Config {
  providers: Record<string, unknown>;
  agents: Agent[];
  tools: Record<string, Tool>;
  experimental: Record<string, boolean>;
}

export interface Run {
  id: string;
  sessionId: string;
  timestamp: number;
  agent: string;
  model: string;
  input: string;
  output: string;
  toolsUsed: string[];
  exitStatus: number;
}

export interface RunLog {
  id: number;
  runId: string;
  logLine: string;
  logType: 'info' | 'error' | 'warning' | 'tool_call';
  timestamp: number;
}

export type AgentSortBy = 'name' | 'status' | 'skills' | 'tools'
export type SortOrder = 'asc' | 'desc'
