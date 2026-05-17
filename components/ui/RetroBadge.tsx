import { cn } from "@/lib/utils"

type BadgeVariant = "gold" | "crimson" | "success" | "danger" | "muted" | "default"

interface RetroBadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  gold:    "text-[var(--color-gold)] border-[var(--color-gold)]",
  crimson: "text-[var(--color-crimson)] border-[var(--color-crimson)]",
  success: "text-success border-success",
  danger:  "text-[var(--color-danger)] border-[var(--color-danger)]",
  muted:   "text-[var(--color-text-muted)] border-[var(--color-border)]",
  default: "text-foreground border-[var(--color-border)]",
}

export default function RetroBadge({ children, variant = "default", className }: RetroBadgeProps) {
  return (
    <span className={cn("badge", variantStyles[variant], className)}>
      {children}
    </span>
  )
}
