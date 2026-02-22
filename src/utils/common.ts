export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

export function deepClone<T>(obj: T): T {
  return deepCloneInternal(obj, new WeakSet())
}

function deepCloneInternal<T>(obj: T, visited: WeakSet<object>): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (visited.has(obj as object)) {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (Array.isArray(obj)) {
    visited.add(obj)
    return obj.map((item) => deepCloneInternal(item, visited)) as T
  }

  try {
    visited.add(obj as object)
    const cloned: Record<string, unknown> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepCloneInternal((obj as Record<string, unknown>)[key], visited)
      }
    }
    return cloned as T
  } catch {
    return obj
  }
}

export function mergeConfig<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>
): T {
  return { ...base, ...override }
}
