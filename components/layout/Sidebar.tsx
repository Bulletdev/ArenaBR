"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Mail, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { usePendingInvites } from "@/stores/invites"
import Avatar from "@/components/ui/Avatar"
import RetroBadge from "@/components/ui/RetroBadge"
import {
  IconTrophy,
  IconRoster,
  IconScouting,
  IconPerson,
} from "@/components/ui/NavIcons"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, player, logout } = useAuthStore()
  const pendingCount = usePendingInvites()

  // Identidade exibida — staff ou jogador
  const displayName = user?.full_name || player?.summoner_name || "—"
  const displayRole = user?.role_display || (player ? "Jogador" : "—")
  const displayAvatar = user?.avatar_url ?? undefined

  const isPlayer = !!player && !user

  const navItems: { href: string; label: string; icon: React.ReactNode; badge?: number }[] = [
    { href: "/dashboard",           label: "Campeonatos", icon: <IconTrophy size={16} /> },
    { href: "/dashboard/times",     label: "Times",       icon: <IconRoster size={16} /> },
    { href: "/dashboard/jogadores", label: "Free Agents", icon: <IconScouting size={16} /> },
    { href: "/dashboard/perfil",    label: "Meu Perfil",  icon: <IconPerson size={16} /> },
    ...(isPlayer ? [{
      href: "/dashboard/convites",
      label: "Convites",
      icon: <Mail size={16} />,
      badge: pendingCount,
    }] : []),
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/login?reason=logout")
  }

  return (
    <aside className="w-44 h-full flex flex-col border-r border-[#252D3D] bg-[#0A0E1A] overflow-y-auto shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#252D3D]">
        <Link href="/">
          <img src="/arenabrlogo.png" alt="ArenaBR" className="h-32 w-auto" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map(({ href, label, icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn("nav-link", active && "active")}
            >
              {icon}
              <span>{label}</span>
              {badge != null && badge > 0 && (
                <RetroBadge variant="gold" className="ml-auto text-[9px] px-1.5 py-0">
                  {badge}
                </RetroBadge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      {(user || player) && (
        <div className="border-t border-[#252D3D] p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar name={displayName} src={displayAvatar} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#E8E8E8] truncate">{displayName}</p>
              <p className="text-xs text-[#8896A4] truncate">{displayRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost w-full text-xs justify-start gap-2 py-1.5 px-2"
          >
            <LogOut size={13} />
            Sair
          </button>
        </div>
      )}
    </aside>
  )
}
