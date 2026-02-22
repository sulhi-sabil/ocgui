import type { Run, RunLog } from '@/types'
import { invoke } from './index'

export { DatabaseError } from './index'

interface BackendRun {
  id: string
  session_id: string
  timestamp: number
  agent: string
  model: string
  input: string
  output: string
  tools_used: string
  exit_status: number
}

interface BackendRunLog {
  id: number
  run_id: string
  log_line: string
  log_type: string
  timestamp: number
}

function adaptRun(backend: BackendRun): Run {
  let toolsUsed: string[] = []
  try {
    toolsUsed = JSON.parse(backend.tools_used)
  } catch {
    toolsUsed = []
  }

  return {
    id: backend.id,
    sessionId: backend.session_id,
    timestamp: backend.timestamp,
    agent: backend.agent,
    model: backend.model,
    input: backend.input,
    output: backend.output,
    toolsUsed,
    exitStatus: backend.exit_status,
  }
}

function adaptRunLog(backend: BackendRunLog): RunLog {
  return {
    id: backend.id,
    runId: backend.run_id,
    logLine: backend.log_line,
    logType: backend.log_type as RunLog['logType'],
    timestamp: backend.timestamp,
  }
}

function toBackendRun(run: Omit<Run, 'toolsUsed'> & { toolsUsed: string[] }): BackendRun {
  return {
    id: run.id,
    session_id: run.sessionId,
    timestamp: run.timestamp,
    agent: run.agent,
    model: run.model,
    input: run.input,
    output: run.output,
    tools_used: JSON.stringify(run.toolsUsed),
    exit_status: run.exitStatus,
  }
}

function toBackendRunLog(log: Omit<RunLog, 'id'>): BackendRunLog {
  return {
    id: 0,
    run_id: log.runId,
    log_line: log.logLine,
    log_type: log.logType,
    timestamp: log.timestamp,
  }
}

export const runsApi = {
  async getAll(limit = 100): Promise<Run[]> {
    const backendRuns = await invoke<BackendRun[]>('get_runs', { limit })
    return backendRuns.map(adaptRun)
  },

  async getById(runId: string): Promise<Run | null> {
    const backendRun = await invoke<BackendRun | null>('get_run_by_id', { runId })
    return backendRun ? adaptRun(backendRun) : null
  },

  async getBySession(sessionId: string): Promise<Run[]> {
    const backendRuns = await invoke<BackendRun[]>('get_runs_by_session', { sessionId })
    return backendRuns.map(adaptRun)
  },

  async add(run: Omit<Run, 'toolsUsed'> & { toolsUsed: string[] }): Promise<void> {
    await invoke<void>('add_run', { run: toBackendRun(run) })
  },

  async delete(runId: string): Promise<void> {
    await invoke<void>('delete_run', { runId })
  },

  async getLogs(runId: string): Promise<RunLog[]> {
    const backendLogs = await invoke<BackendRunLog[]>('get_run_logs', { runId })
    return backendLogs.map(adaptRunLog)
  },

  async addLog(log: Omit<RunLog, 'id'>): Promise<number> {
    return invoke<number>('add_run_log', { log: toBackendRunLog(log) })
  }
}
