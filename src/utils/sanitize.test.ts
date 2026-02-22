import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  sanitizeInput,
  sanitizePath,
  truncateInput,
  sanitizeId,
  isValidProtocol,
  sanitizeForDisplay,
  containsDangerousPatterns,
} from './sanitize'

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    )
  })

  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#x27;s')
  })

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('does not modify safe strings', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })
})

describe('sanitizeInput', () => {
  it('removes control characters except newline and tab', () => {
    expect(sanitizeInput('hello\x00world')).toBe('helloworld')
    expect(sanitizeInput('hello\nworld')).toBe('hello\nworld')
    expect(sanitizeInput('hello\tworld')).toBe('hello\tworld')
  })

  it('escapes HTML characters', () => {
    expect(sanitizeInput('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;&#x2F;b&gt;')
  })

  it('truncates to max length', () => {
    const longString = 'a'.repeat(200000)
    const result = sanitizeInput(longString)
    expect(result.length).toBe(100000)
  })

  it('uses custom max length', () => {
    const input = 'a'.repeat(100)
    const result = sanitizeInput(input, 50)
    expect(result.length).toBe(50)
  })

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('')
  })
})

describe('sanitizePath', () => {
  it('returns empty for paths exceeding max length', () => {
    const longPath = '/a'.repeat(5000)
    expect(sanitizePath(longPath)).toBe('')
  })

  it('returns empty for paths with null bytes', () => {
    expect(sanitizePath('/home/user\u0000/file')).toBe('')
  })

  it('returns empty for path traversal attempts', () => {
    expect(sanitizePath('../../../etc/passwd')).toBe('')
    expect(sanitizePath('/home/user/../..')).toBe('')
  })

  it('removes dangerous characters', () => {
    expect(sanitizePath('/home/user/<file>')).toBe('/home/user/file')
    expect(sanitizePath('/path/with|"chars')).toBe('/path/withchars')
  })

  it('preserves valid paths', () => {
    expect(sanitizePath('/home/user/documents')).toBe('/home/user/documents')
    expect(sanitizePath('C:\\Users\\test\\file.txt')).toBe('C:\\Users\\test\\file.txt')
  })
})

describe('truncateInput', () => {
  it('returns input if shorter than max', () => {
    expect(truncateInput('hello', 10)).toBe('hello')
  })

  it('truncates if longer than max', () => {
    expect(truncateInput('hello world', 5)).toBe('hello')
  })

  it('handles exact length', () => {
    expect(truncateInput('hello', 5)).toBe('hello')
  })
})

describe('sanitizeId', () => {
  it('removes non-alphanumeric characters except - and _', () => {
    expect(sanitizeId('abc-123_XYZ')).toBe('abc-123_XYZ')
    expect(sanitizeId('abc@#$%^&*123')).toBe('abc123')
  })

  it('truncates to max ID length', () => {
    const longId = 'a'.repeat(300)
    expect(sanitizeId(longId).length).toBe(256)
  })

  it('handles empty string', () => {
    expect(sanitizeId('')).toBe('')
  })
})

describe('isValidProtocol', () => {
  it('returns true for allowed protocols', () => {
    expect(isValidProtocol('http://example.com')).toBe(true)
    expect(isValidProtocol('https://example.com')).toBe(true)
    expect(isValidProtocol('file:///path/to/file')).toBe(true)
  })

  it('returns false for disallowed protocols', () => {
    expect(isValidProtocol('javascript:alert(1)')).toBe(false)
    expect(isValidProtocol('data:text/html,<script>')).toBe(false)
    expect(isValidProtocol('vbscript:msgbox(1)')).toBe(false)
  })

  it('returns false for invalid URLs', () => {
    expect(isValidProtocol('not a url')).toBe(false)
  })
})

describe('sanitizeForDisplay', () => {
  it('escapes HTML and removes dangerous chars', () => {
    expect(sanitizeForDisplay('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;'
    )
  })

  it('removes null bytes', () => {
    expect(sanitizeForDisplay('hello\x00world')).toBe('helloworld')
  })
})

describe('containsDangerousPatterns', () => {
  it('detects script tags', () => {
    expect(containsDangerousPatterns('<script>alert(1)</script>')).toBe(true)
    expect(containsDangerousPatterns('<SCRIPT>alert(1)</SCRIPT>')).toBe(true)
  })

  it('detects javascript: protocol', () => {
    expect(containsDangerousPatterns('javascript:void(0)')).toBe(true)
    expect(containsDangerousPatterns('JAVASCRIPT:alert(1)')).toBe(true)
  })

  it('detects event handlers', () => {
    expect(containsDangerousPatterns('onclick=alert(1)')).toBe(true)
    expect(containsDangerousPatterns('onerror=alert(1)')).toBe(true)
  })

  it('detects data: protocol', () => {
    expect(containsDangerousPatterns('data:text/html,<script>')).toBe(true)
  })

  it('returns false for safe content', () => {
    expect(containsDangerousPatterns('Hello World')).toBe(false)
    expect(containsDangerousPatterns('Click here for more info')).toBe(false)
  })
})
