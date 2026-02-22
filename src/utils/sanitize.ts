import { SECURITY } from '@constants/index'

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
}

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char)
}

export function sanitizeInput(input: string, maxLength: number = SECURITY.MAX_INPUT_LENGTH): string {
  const sanitized = input
    .replace(SECURITY.DANGEROUS_CHARS_PATTERN, '')
    .split('')
    .filter((char) => !isControlChar(char) || char === '\n' || char === '\t')
    .join('')
  
  return escapeHtml(sanitized.slice(0, maxLength))
}

function isControlChar(char: string): boolean {
  const code = char.charCodeAt(0)
  return code < 32 || code === 127
}

export function sanitizePath(path: string): string {
  if (path.length > SECURITY.MAX_PATH_LENGTH) {
    return ''
  }
  
  if (path.includes('\0')) {
    return ''
  }
  
  if (SECURITY.PATH_TRAVERSAL_PATTERN.test(path)) {
    return ''
  }
  
  return path.replace(/[<>"|?*]/g, '')
}

export function truncateInput(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input
  }
  return input.slice(0, maxLength)
}

export function sanitizeId(id: string): string {
  const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '')
  return sanitized.slice(0, SECURITY.MAX_ID_LENGTH)
}

export function isValidProtocol(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return (SECURITY.ALLOWED_PROTOCOLS as readonly string[]).includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

export function sanitizeForDisplay(input: string): string {
  return escapeHtml(input.replace(SECURITY.DANGEROUS_CHARS_PATTERN, ''))
}

export function containsDangerousPatterns(input: string): boolean {
  const dangerousPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:/i,
    /vbscript:/i,
  ]
  
  return dangerousPatterns.some((pattern) => pattern.test(input))
}
