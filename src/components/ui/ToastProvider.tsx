/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, createContext, useRef, useEffect } from 'react'
import { generateId } from '@utils/index'
import { TOAST } from '@constants/index'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const refs = timeoutRefs.current
    return () => {
      refs.forEach((timeoutId) => clearTimeout(timeoutId))
      refs.clear()
    }
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = generateId()
    
    setToasts((prev) => {
      const updated = [...prev, { id, message, type }]
      if (updated.length > TOAST.MAX_VISIBLE) {
        const removed = updated.slice(0, updated.length - TOAST.MAX_VISIBLE)
        removed.forEach((toast) => {
          const timeoutId = timeoutRefs.current.get(toast.id)
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutRefs.current.delete(toast.id)
          }
        })
        return updated.slice(-TOAST.MAX_VISIBLE)
      }
      return updated
    })
    
    const timeoutId = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      timeoutRefs.current.delete(id)
    }, TOAST.DEFAULT_DURATION_MS)
    
    timeoutRefs.current.set(id, timeoutId)
  }, [])

  const removeToast = useCallback((id: string) => {
    const timeoutId = timeoutRefs.current.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutRefs.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}
