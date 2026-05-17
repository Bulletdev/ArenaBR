"use client"
import { create } from "zustand"

export type ToastVariant = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  push: (message: string, variant?: ToastVariant) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push(message, variant = "info") {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }))
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      4000,
    )
  },
  remove(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))

export function useToast() {
  const push = useToastStore((s) => s.push)
  return {
    success: (msg: string) => push(msg, "success"),
    error: (msg: string) => push(msg, "error"),
    info: (msg: string) => push(msg, "info"),
  }
}
