import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: React.ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:   "btn-primary",
  secondary: "btn-secondary",
  ghost:     "btn-ghost",
  danger:    "btn-danger",
}

export default function Button({
  variant = "primary",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(variantClass[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
