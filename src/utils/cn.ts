import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for clean, merged Tailwind classes
 * Usage: cn('px-2', condition && 'py-2', 'px-4') => 'py-2 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
