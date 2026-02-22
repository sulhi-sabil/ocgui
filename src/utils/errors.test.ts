import { describe, it, expect } from 'vitest'
import { AppError, isAppError, isRecoverable, getErrorMessage } from './errors'

describe('AppError', () => {
  it('should create an error with code and message', () => {
    const error = new AppError({
      code: 'INVOKE_ERROR',
      message: 'Test error message',
    })

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
    expect(error.name).toBe('AppError')
    expect(error.code).toBe('INVOKE_ERROR')
    expect(error.message).toBe('Test error message')
    expect(error.recoverable).toBe(false)
  })

  it('should store cause when provided', () => {
    const cause = new Error('Original error')
    const error = new AppError({
      code: 'DATABASE_ERROR',
      message: 'Database failed',
      cause,
    })

    expect(error.cause).toBe(cause)
  })

  it('should default recoverable to false', () => {
    const error = new AppError({
      code: 'UNKNOWN_ERROR',
      message: 'Unknown',
    })

    expect(error.recoverable).toBe(false)
  })

  it('should allow setting recoverable flag', () => {
    const error = new AppError({
      code: 'NETWORK_ERROR',
      message: 'Network failed',
      recoverable: true,
    })

    expect(error.recoverable).toBe(true)
  })

  it('should return user message from ERROR_MESSAGES', () => {
    const error = new AppError({
      code: 'INVOKE_ERROR',
      message: 'Custom message',
    })

    expect(error.userMessage).toBe('Failed to communicate with the backend')
  })

  it('should return original message for unknown error codes', () => {
    const error = new AppError({
      code: 'UNKNOWN_ERROR',
      message: 'Custom unknown message',
    })

    expect(error.userMessage).toBe('An unexpected error occurred')
  })
})

describe('AppError.fromUnknown', () => {
  it('should return AppError as-is', () => {
    const original = new AppError({
      code: 'DATABASE_ERROR',
      message: 'DB error',
    })

    const result = AppError.fromUnknown(original)

    expect(result).toBe(original)
  })

  it('should wrap Error instance', () => {
    const original = new Error('Test error')
    const result = AppError.fromUnknown(original, 'VALIDATION_ERROR')

    expect(result).toBeInstanceOf(AppError)
    expect(result.code).toBe('VALIDATION_ERROR')
    expect(result.message).toBe('Test error')
    expect(result.cause).toBe(original)
  })

  it('should wrap non-Error values', () => {
    const result = AppError.fromUnknown('string error')

    expect(result).toBeInstanceOf(AppError)
    expect(result.code).toBe('UNKNOWN_ERROR')
    expect(result.message).toBe('string error')
    expect(result.cause).toBe('string error')
  })

  it('should use default code when not provided', () => {
    const result = AppError.fromUnknown(new Error('test'))

    expect(result.code).toBe('UNKNOWN_ERROR')
  })
})

describe('isAppError', () => {
  it('should return true for AppError instances', () => {
    const error = new AppError({
      code: 'INVOKE_ERROR',
      message: 'Test',
    })

    expect(isAppError(error)).toBe(true)
  })

  it('should return false for regular Error', () => {
    const error = new Error('Test')

    expect(isAppError(error)).toBe(false)
  })

  it('should return false for non-error values', () => {
    expect(isAppError(null)).toBe(false)
    expect(isAppError(undefined)).toBe(false)
    expect(isAppError('error')).toBe(false)
    expect(isAppError(123)).toBe(false)
  })
})

describe('isRecoverable', () => {
  it('should return true for recoverable AppError', () => {
    const error = new AppError({
      code: 'NETWORK_ERROR',
      message: 'Network issue',
      recoverable: true,
    })

    expect(isRecoverable(error)).toBe(true)
  })

  it('should return false for non-recoverable AppError', () => {
    const error = new AppError({
      code: 'DATABASE_ERROR',
      message: 'DB issue',
      recoverable: false,
    })

    expect(isRecoverable(error)).toBe(false)
  })

  it('should return false for regular Error', () => {
    const error = new Error('Test')

    expect(isRecoverable(error)).toBe(false)
  })

  it('should return false for non-error values', () => {
    expect(isRecoverable(null)).toBe(false)
    expect(isRecoverable('error')).toBe(false)
  })
})

describe('getErrorMessage', () => {
  it('should return userMessage for AppError', () => {
    const error = new AppError({
      code: 'INVOKE_ERROR',
      message: 'Test',
    })

    expect(getErrorMessage(error)).toBe('Failed to communicate with the backend')
  })

  it('should return message for regular Error', () => {
    const error = new Error('Regular error')

    expect(getErrorMessage(error)).toBe('Regular error')
  })

  it('should return default message for non-error values', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred')
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred')
    expect(getErrorMessage('string')).toBe('An unexpected error occurred')
  })
})
