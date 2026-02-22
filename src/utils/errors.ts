import type { ErrorCode, AppErrorData } from '../types'
import { ERROR_MESSAGES } from '@constants/index'

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly cause?: unknown
  public readonly recoverable: boolean

  constructor(data: AppErrorData) {
    super(data.message)
    this.name = 'AppError'
    this.code = data.code
    this.cause = data.cause
    this.recoverable = data.recoverable ?? false
  }

  get userMessage(): string {
    return ERROR_MESSAGES[this.code] ?? this.message
  }

  static fromUnknown(error: unknown, code: ErrorCode = 'UNKNOWN_ERROR'): AppError {
    if (error instanceof AppError) {
      return error
    }

    const message = error instanceof Error ? error.message : String(error)
    return new AppError({
      code,
      message,
      cause: error,
    })
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function isRecoverable(error: unknown): boolean {
  if (isAppError(error)) {
    return error.recoverable
  }
  return false
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage
  }
  if (error instanceof Error) {
    return error.message
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR
}
