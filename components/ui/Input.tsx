"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "_")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="retro-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "retro-input",
            error && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_2px_rgba(220,38,38,0.15)]",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-[var(--color-danger)] text-xs font-mono">{error}</span>
        )}
        {hint && !error && (
          <span className="text-muted text-xs">{hint}</span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export default Input
