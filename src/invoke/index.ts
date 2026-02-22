import { invoke as tauriInvoke } from '@tauri-apps/api/core'
import { AppError } from '@utils/errors'

export { AppError as DatabaseError } from '@utils/errors'

export async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    return await tauriInvoke<T>(command, args)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new AppError({
      code: 'INVOKE_ERROR',
      message,
      cause: error,
    })
  }
}
