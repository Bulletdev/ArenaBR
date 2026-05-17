import { cn } from "@/lib/utils"

interface RetroPanelProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "gold" | "crimson"
  corners?: boolean
  padding?: boolean
}

export default function RetroPanel({
  children,
  className,
  variant = "default",
  corners = false,
  padding = true,
}: RetroPanelProps) {
  const variantClass =
    variant === "gold"
      ? "panel-gold"
      : variant === "crimson"
      ? "panel-crimson"
      : "panel"

  return (
    <div
      className={cn(
        variantClass,
        corners && "bracket-corners",
        padding && "p-5",
        className
      )}
    >
      {children}
    </div>
  )
}
