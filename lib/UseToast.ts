"use client"

import { useState } from "react"

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type ToastAction = {
  addToast: (toast: Omit<Toast, "id">) => void
  updateToast: (toast: Toast) => void
  removeToast: (id: string) => void
}

type ToastContextType = {
  toasts: Toast[]
} & ToastAction

export function useToast(): ToastContextType {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2)
    setToasts([...toasts, { id, ...toast }])

    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 3000)
  }

  const updateToast = (toast: Toast) => {
    setToasts(toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)))
  }

  const removeToast = (id: string) => {
    setToasts(toasts.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    addToast,
    updateToast,
    removeToast,
  }
}
