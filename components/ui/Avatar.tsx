import { getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface AvatarProps {
  name: string
  src?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClass = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
}

export default function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-none object-cover border border-[#252D3D]", sizeClass[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center font-mono font-bold border border-[#252D3D]",
        "bg-[#1A2235] text-[#C89B3C]",
        sizeClass[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
