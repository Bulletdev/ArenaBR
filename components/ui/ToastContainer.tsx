"use client"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useToastStore } from "@/hooks/useToast"

const VARIANT_CLASSES = {
  success: "border-success/40 bg-surface text-success",
  error:   "border-danger/40 bg-surface text-danger",
  info:    "border-border bg-surface text-text",
} as const

export default function ToastContainer() {
  const { toasts, remove } = useToastStore()
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 border px-4 py-3 text-sm font-mono ${VARIANT_CLASSES[t.variant]}`}
          >
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
