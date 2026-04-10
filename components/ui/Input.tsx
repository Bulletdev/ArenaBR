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
            error && "border-[#FF4444] focus:border-[#FF4444] focus:shadow-[0_0_0_2px_rgba(255,68,68,0.15)]",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-[#FF4444] text-xs font-mono">{error}</span>
        )}
        {hint && !error && (
          <span className="text-[#8896A4] text-xs">{hint}</span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export default Input
