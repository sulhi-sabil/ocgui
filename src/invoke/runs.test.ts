import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runsApi, DatabaseError } from './runs'

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}))

const mockInvoke = vi.mocked(await import('@tauri-apps/api/core')).invoke

const mockBackendRun = {
  id: 'run-1',
  session_id: 'session-1',
  timestamp: 1700000000000,
  agent: 'agent-1',
  model: 'gpt-4',
  input: 'test input',
  output: 'test output',
  tools_used: '["tool1", "tool2"]',
  exit_status: 0,
}

const expectedRun = {
  id: 'run-1',
  sessionId: 'session-1',
  timestamp: 1700000000000,
  agent: 'agent-1',
  model: 'gpt-4',
  input: 'test input',
  output: 'test output',
  toolsUsed: ['tool1', 'tool2'],
  exitStatus: 0,
}

const mockBackendRunLog = {
  id: 1,
  run_id: 'run-1',
  log_line: 'test log',
  log_type: 'info',
  timestamp: 1700000000000,
}

const expectedRunLog = {
  id: 1,
  runId: 'run-1',
  logLine: 'test log',
  logType: 'info' as const,
  timestamp: 1700000000000,
}

describe('runsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all runs and adapt to frontend format', async () => {
      mockInvoke.mockResolvedValueOnce([mockBackendRun])

      const runs = await runsApi.getAll(50)

      expect(mockInvoke).toHaveBeenCalledWith('get_runs', { limit: 50 })
      expect(runs).toHaveLength(1)
      expect(runs[0]).toEqual(expectedRun)
    })

    it('should use default limit of 100', async () => {
      mockInvoke.mockResolvedValueOnce([])

      await runsApi.getAll()

      expect(mockInvoke).toHaveBeenCalledWith('get_runs', { limit: 100 })
    })
  })

  describe('getById', () => {
    it('should fetch a run by id and adapt to frontend format', async () => {
      mockInvoke.mockResolvedValueOnce(mockBackendRun)

      const run = await runsApi.getById('run-1')

      expect(mockInvoke).toHaveBeenCalledWith('get_run_by_id', { runId: 'run-1' })
      expect(run).toEqual(expectedRun)
    })

    it('should return null when run not found', async () => {
      mockInvoke.mockResolvedValueOnce(null)

      const run = await runsApi.getById('nonexistent')

      expect(run).toBeNull()
    })
  })

  describe('getBySession', () => {
    it('should fetch runs by session id', async () => {
      mockInvoke.mockResolvedValueOnce([mockBackendRun])

      const runs = await runsApi.getBySession('session-1')

      expect(mockInvoke).toHaveBeenCalledWith('get_runs_by_session', { sessionId: 'session-1' })
      expect(runs).toHaveLength(1)
      expect(runs[0]).toEqual(expectedRun)
    })
  })

  describe('add', () => {
    it('should add a run with proper type conversion', async () => {
      mockInvoke.mockResolvedValueOnce(undefined)

      await runsApi.add(expectedRun)

      expect(mockInvoke).toHaveBeenCalledWith('add_run', {
        run: {
          id: 'run-1',
          session_id: 'session-1',
          timestamp: 1700000000000,
          agent: 'agent-1',
          model: 'gpt-4',
          input: 'test input',
          output: 'test output',
          tools_used: '["tool1","tool2"]',
          exit_status: 0,
        },
      })
    })
  })

  describe('delete', () => {
    it('should delete a run by id', async () => {
      mockInvoke.mockResolvedValueOnce(undefined)

      await runsApi.delete('run-1')

      expect(mockInvoke).toHaveBeenCalledWith('delete_run', { runId: 'run-1' })
    })
  })

  describe('getLogs', () => {
    it('should fetch logs for a run and adapt to frontend format', async () => {
      mockInvoke.mockResolvedValueOnce([mockBackendRunLog])

      const logs = await runsApi.getLogs('run-1')

      expect(mockInvoke).toHaveBeenCalledWith('get_run_logs', { runId: 'run-1' })
      expect(logs).toHaveLength(1)
      expect(logs[0]).toEqual(expectedRunLog)
    })
  })

  describe('addLog', () => {
    it('should add a log entry and return the id', async () => {
      mockInvoke.mockResolvedValueOnce(42)

      const logId = await runsApi.addLog({
        runId: 'run-1',
        logLine: 'test log',
        logType: 'info',
        timestamp: 1700000000000,
      })

      expect(mockInvoke).toHaveBeenCalledWith('add_run_log', {
        log: {
          id: 0,
          run_id: 'run-1',
          log_line: 'test log',
          log_type: 'info',
          timestamp: 1700000000000,
        },
      })
      expect(logId).toBe(42)
    })
  })

  describe('error handling', () => {
    it('should throw DatabaseError on invoke failure', async () => {
      mockInvoke.mockRejectedValueOnce(new Error('Connection failed'))

      await expect(runsApi.getAll()).rejects.toThrow(DatabaseError)
    })
  })
})

describe('adapters', () => {
  it('should handle invalid JSON in tools_used', async () => {
    mockInvoke.mockResolvedValueOnce([{
      ...mockBackendRun,
      tools_used: 'invalid json',
    }])

    const runs = await runsApi.getAll()

    expect(runs[0].toolsUsed).toEqual([])
  })
})
