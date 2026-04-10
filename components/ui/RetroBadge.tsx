import { cn } from "@/lib/utils"

type BadgeVariant = "gold" | "teal" | "success" | "danger" | "muted" | "default"

interface RetroBadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  gold:    "text-[#C89B3C] border-[#C89B3C]",
  teal:    "text-[#0596AA] border-[#0596AA]",
  success: "text-[#00D364] border-[#00D364]",
  danger:  "text-[#FF4444] border-[#FF4444]",
  muted:   "text-[#8896A4] border-[#252D3D]",
  default: "text-[#E8E8E8] border-[#252D3D]",
}

export default function RetroBadge({ children, variant = "default", className }: RetroBadgeProps) {
  return (
    <span className={cn("retro-badge", variantStyles[variant], className)}>
      {children}
    </span>
  )
}
