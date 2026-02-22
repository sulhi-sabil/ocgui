/**
 * @fileoverview Core type definitions for OpenCode GUI application.
 * These types define the data structures used throughout the application
 * for agents, skills, tools, configurations, and run history.
 * @module types
 */

/**
 * Configuration options for agent autonomous behavior.
 * These flags control self-modification and learning capabilities.
 */
export interface AgentBehavior {
  /** Enable automatic error recovery and retry logic */
  selfHeal?: boolean
  /** Enable learning from past interactions to improve responses */
  selfLearn?: boolean
  /** Enable dynamic capability expansion based on usage patterns */
  selfEvolve?: boolean
  /** Enable maximum potential optimization mode */
  maximizePotential?: boolean
}

/**
 * Hook configuration for agent lifecycle events.
 * Hooks allow custom scripts or commands to run at specific points
 * during agent execution.
 */
export interface AgentHooks {
  /** Commands to execute before any tool is invoked */
  preToolUse?: string[]
  /** Commands to execute after any tool completes */
  postToolUse?: string[]
  /** Commands to execute when a user submits a prompt */
  userPromptSubmit?: string[]
  /** Commands to execute when the agent session stops */
  stop?: string[]
}

/**
 * Runtime configuration parameters for model inference.
 * Controls how the underlying LLM generates responses.
 */
export interface AgentRuntimeConfig {
  /** Sampling temperature (0.0-2.0). Higher values increase randomness. */
  temperature?: number
  /** Maximum tokens to generate in a single response */
  maxTokens?: number
  /** Context window size in tokens */
  contextWindow?: number
  /** Output format preference for structured responses */
  responseFormat?: 'text' | 'json'
}

/**
 * Permission flags controlling agent capabilities.
 * These define what actions an agent is allowed to perform.
 */
export interface AgentPermissions {
  /** Allow reading files and directories */
  read?: boolean
  /** Allow creating and modifying files */
  write?: boolean
  /** Allow executing shell commands */
  execute?: boolean
  /** Allow git operations (commit, push, pull, etc.) */
  git?: boolean
  /** Allow network requests and API calls */
  network?: boolean
}

/**
 * Represents an OpenCode agent configuration.
 * Agents are autonomous AI assistants that can use tools, skills,
 * and interact with the system based on their configuration.
 *
 * @example
 * ```typescript
 * const agent: Agent = {
 *   id: 'code-assistant',
 *   name: 'Code Assistant',
 *   description: 'Helps with code review and refactoring',
 *   tools: { readFile: 'allow', writeFile: 'ask' },
 *   permissions: { read: true, write: true, execute: false },
 *   skills: ['code-review', 'refactoring'],
 *   tags: ['coding', 'review'],
 *   enabled: true
 * }
 * ```
 */
export interface Agent {
  /** Unique identifier for the agent */
  id: string
  /** Human-readable display name */
  name: string
  /** Brief description of the agent's purpose and capabilities */
  description: string
  /** Semantic version string (e.g., "1.0.0") */
  version?: string
  /** LLM model identifier (e.g., "gpt-4", "claude-3-opus") */
  model?: string
  /** List of capability identifiers this agent possesses */
  capabilities?: string[]
  /** Autonomous behavior configuration */
  behavior?: AgentBehavior
  /** Tool permissions as key-value pairs. Keys are tool names, values are permission levels. */
  tools: Record<string, string>
  /** Security and system access permissions */
  permissions: Record<string, string> | AgentPermissions
  /** Lifecycle event hooks */
  hooks?: AgentHooks
  /** MCP (Model Context Protocol) server identifiers to connect */
  mcpServers?: string[]
  /** Skill identifiers this agent can use */
  skills: string[]
  /** Classification tags for filtering and organization */
  tags: string[]
  /** Whether this agent is currently active and available */
  enabled: boolean
  /** Runtime model configuration overrides */
  config?: AgentRuntimeConfig
}

/**
 * Represents a reusable skill that can be assigned to agents.
 * Skills encapsulate domain-specific knowledge and commands.
 *
 * @example
 * ```typescript
 * const skill: Skill = {
 *   id: 'git-operations',
 *   name: 'Git Operations',
 *   description: 'Provides git workflow assistance',
 *   content: '## Git Workflow\n...',
 *   commands: ['/git-commit', '/git-status'],
 *   path: '/skills/git-operations/SKILL.md'
 * }
 * ```
 */
export interface Skill {
  /** Unique skill identifier */
  id: string
  /** Human-readable skill name */
  name: string
  /** Description of what this skill provides */
  description: string
  /** Full skill content/documentation (typically markdown) */
  content: string
  /** Available slash commands this skill provides */
  commands: string[]
  /** Filesystem path to the skill definition file */
  path: string
}

/**
 * Represents a tool that agents can invoke.
 * Tools are external capabilities like file operations, API calls, etc.
 */
export interface Tool {
  /** Tool name used in agent configuration */
  name: string
  /** Human-readable description of the tool's functionality */
  description: string
  /** JSON Schema defining tool parameters */
  parameters: Record<string, unknown>
  /** Permission level: 'allow' (always), 'deny' (never), 'ask' (prompt user) */
  permission: 'allow' | 'deny' | 'ask'
}

/**
 * Root configuration object for the OpenCode application.
 * Contains all providers, agents, tools, and experimental settings.
 */
export interface Config {
  /** LLM provider configurations (OpenAI, Anthropic, etc.) */
  providers: Record<string, unknown>
  /** List of configured agents */
  agents: Agent[]
  /** Available tools and their configurations */
  tools: Record<string, Tool>
  /** Experimental feature flags */
  experimental: Record<string, boolean>
}

/**
 * Represents a single agent execution run.
 * Captures the input, output, and metadata of an agent session.
 */
export interface Run {
  /** Unique run identifier */
  id: string
  /** Session this run belongs to */
  sessionId: string
  /** Unix timestamp of run start time */
  timestamp: number
  /** Agent identifier that executed this run */
  agent: string
  /** Model used for this run */
  model: string
  /** User input/prompt that initiated the run */
  input: string
  /** Agent output/response */
  output: string
  /** List of tool names invoked during this run */
  toolsUsed: string[]
  /** Exit status code (0 = success, non-zero = error) */
  exitStatus: number
}

/**
 * A single log entry from a run execution.
 * Used for debugging and monitoring agent behavior.
 */
export interface RunLog {
  /** Auto-incremented log entry ID */
  id: number
  /** Associated run identifier */
  runId: string
  /** The actual log message content */
  logLine: string
  /** Log severity/type classification */
  logType: 'info' | 'error' | 'warning' | 'tool_call'
  /** Unix timestamp when this log was created */
  timestamp: number
}
