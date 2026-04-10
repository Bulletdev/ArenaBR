import { cn } from "@/lib/utils"

interface RetroPanelProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "gold" | "teal"
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
      ? "retro-panel-gold"
      : variant === "teal"
      ? "retro-panel-teal"
      : "retro-panel"

  return (
    <div
      className={cn(
        variantClass,
        corners && "hud-corners",
        padding && "p-5",
        className
      )}
    >
      {children}
    </div>
  )
}
