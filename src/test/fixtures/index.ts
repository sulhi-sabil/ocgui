import type { Agent, Skill, Config, Run, RunLog, Tool, AgentBehavior, AgentHooks, AgentRuntimeConfig, AgentPermissions } from '../../types'

export function createMockAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: 'agent-1',
    name: 'Test Agent',
    description: 'A test agent',
    model: 'gpt-4',
    tools: { read: 'allow' },
    permissions: { file: 'ask' },
    skills: [],
    tags: [],
    enabled: true,
    ...overrides,
  }
}

export function createMockAgents(count: number, overrides: Partial<Agent> = {}): Agent[] {
  return Array.from({ length: count }, (_, i) =>
    createMockAgent({
      id: `agent-${i + 1}`,
      name: `Test Agent ${i + 1}`,
      ...overrides,
    })
  )
}

export function createMockSkill(overrides: Partial<Skill> = {}): Skill {
  return {
    id: 'skill-1',
    name: 'Test Skill',
    description: 'A test skill',
    content: 'skill content',
    commands: ['/test'],
    path: '/path/to/skill',
    ...overrides,
  }
}

export function createMockSkills(count: number, overrides: Partial<Skill> = {}): Skill[] {
  return Array.from({ length: count }, (_, i) =>
    createMockSkill({
      id: `skill-${i + 1}`,
      name: `Test Skill ${i + 1}`,
      ...overrides,
    })
  )
}

export function createMockConfig(overrides: Partial<Config> = {}): Config {
  return {
    providers: { openai: { apiKey: 'test-key' } },
    agents: [],
    tools: {},
    experimental: {},
    ...overrides,
  }
}

export function createMockRun(overrides: Partial<Run> = {}): Run {
  return {
    id: 'run-1',
    sessionId: 'session-1',
    timestamp: Date.now(),
    agent: 'agent-1',
    model: 'gpt-4',
    input: 'test input',
    output: 'test output',
    toolsUsed: ['read'],
    exitStatus: 0,
    ...overrides,
  }
}

export function createMockRuns(count: number, overrides: Partial<Run> = {}): Run[] {
  return Array.from({ length: count }, (_, i) =>
    createMockRun({
      id: `run-${i + 1}`,
      sessionId: `session-${i + 1}`,
      timestamp: Date.now() + i * 1000,
      ...overrides,
    })
  )
}

export function createMockRunLog(overrides: Partial<RunLog> = {}): RunLog {
  return {
    id: 1,
    runId: 'run-1',
    logLine: 'test log line',
    logType: 'info',
    timestamp: Date.now(),
    ...overrides,
  }
}

export function createMockTool(overrides: Partial<Tool> = {}): Tool {
  return {
    name: 'read',
    description: 'Read file contents',
    parameters: { path: { type: 'string' } },
    permission: 'allow',
    ...overrides,
  }
}

export function createMockAgentBehavior(overrides: Partial<AgentBehavior> = {}): AgentBehavior {
  return {
    selfHeal: false,
    selfLearn: false,
    selfEvolve: false,
    maximizePotential: false,
    ...overrides,
  }
}

export function createMockAgentHooks(overrides: Partial<AgentHooks> = {}): AgentHooks {
  return {
    preToolUse: [],
    postToolUse: [],
    userPromptSubmit: [],
    stop: [],
    ...overrides,
  }
}

export function createMockAgentRuntimeConfig(overrides: Partial<AgentRuntimeConfig> = {}): AgentRuntimeConfig {
  return {
    temperature: 0.7,
    maxTokens: 4096,
    contextWindow: 8192,
    responseFormat: 'text',
    ...overrides,
  }
}

export function createMockAgentPermissions(overrides: Partial<AgentPermissions> = {}): AgentPermissions {
  return {
    read: true,
    write: false,
    execute: false,
    git: false,
    network: false,
    ...overrides,
  }
}
