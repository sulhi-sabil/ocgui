import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    expect(cn('base', isActive && 'active')).toBe('base active')
    expect(cn('base', !isActive && 'active')).toBe('base')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['px-2', 'py-2'], 'px-4')).toBe('py-2 px-4')
  })

  it('should handle objects', () => {
    expect(cn({ 'px-2': true, 'py-2': false, 'px-4': true })).toBe('px-4')
  })

  it('should filter out falsy values', () => {
    expect(cn('px-2', null, undefined, false, 'py-2')).toBe('px-2 py-2')
  })
})
