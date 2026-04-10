"use client"

import { User, Shield, Calendar, RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Avatar from "@/components/ui/Avatar"
import { DiscordIcon } from "@/components/ui/Icons"
import { useAuthStore } from "@/stores/auth"
import { playerApi } from "@/lib/api"
import { mockPlayers } from "@/lib/mock"
import { formatDate, getEloColor, getRoleLabel } from "@/lib/utils"
import type { Player } from "@/types"

export default function PerfilPage() {
  const { user } = useAuthStore()

  const { data: playersData, isLoading } = useQuery({
    queryKey: ["my-players"],
    queryFn: () => playerApi.list(),
    retry: false,
  })

  const players: Player[] = Array.isArray(playersData?.data?.players) ? playersData.data.players : mockPlayers

  if (!user) {
    return <div className="p-6 text-[#8896A4] text-sm">Carregando perfil...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="retro-label">Conta</p>
        <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
          Meu Perfil
        </h1>
      </div>

      <hr className="retro-sep" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card principal */}
        <RetroPanel variant="gold" corners className="lg:col-span-1 space-y-4">
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-[#252D3D]">
            <Avatar name={user.full_name || user.email} src={user.avatar_url ?? undefined} size="lg" />
            <div className="text-center">
              <p className="font-display font-bold text-[#E8E8E8] text-lg uppercase tracking-widest">
                {user.full_name || "—"}
              </p>
              <p className="font-mono text-xs text-[#8896A4]">{user.email}</p>
            </div>
            <RetroBadge variant="gold">{user.role_display}</RetroBadge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User size={13} className="text-[#C89B3C]" />
              <span className="text-[#8896A4] text-xs uppercase tracking-wider font-mono">E-mail</span>
              <span className="ml-auto text-[#E8E8E8] text-xs truncate max-w-28">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DiscordIcon size={13} className="text-[#C89B3C]" />
              <span className="text-[#8896A4] text-xs uppercase tracking-wider font-mono">Discord</span>
              <span className="ml-auto font-mono text-xs text-[#E8E8E8]">
                {user.discord_user_id || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={13} className="text-[#C89B3C]" />
              <span className="text-[#8896A4] text-xs uppercase tracking-wider font-mono">Membro desde</span>
              <span className="ml-auto text-[#E8E8E8] text-xs">{formatDate(user.created_at)}</span>
            </div>
          </div>
        </RetroPanel>

        {/* Direita */}
        <div className="lg:col-span-2 space-y-4">
          {/* Elenco */}
          <RetroPanel>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-[#C89B3C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
                Elenco da organização
              </span>
              {isLoading && (
                <RefreshCw size={12} className="text-[#8896A4] animate-spin ml-auto" />
              )}
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-[#8896A4] text-sm">Carregando jogadores...</div>
            ) : players.length === 0 ? (
              <div className="py-6 text-center text-[#8896A4] text-sm">
                Nenhum jogador no elenco.
              </div>
            ) : (
              <div className="space-y-2">
                {players.map((player) => (
                  <PlayerRow key={player.id} player={player} />
                ))}
              </div>
            )}
          </RetroPanel>

          {/* Permissões */}
          <RetroPanel>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-[#C89B3C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
                Permissões da conta
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(user.permissions).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className={val ? "text-[#00D364]" : "text-[#FF4444]"}>
                    {val ? "✓" : "✗"}
                  </span>
                  <span className="text-[#8896A4] font-mono">
                    {key.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </RetroPanel>
        </div>
      </div>
    </div>
  )
}

function PlayerRow({ player }: { player: Player }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 border border-[#252D3D] hover:border-[#8896A4] transition-colors">
      <Avatar name={player.summoner_name} src={player.avatar_url ?? undefined} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm text-[#E8E8E8] truncate">
          {player.professional_name ?? player.summoner_name}
        </p>
        {player.professional_name && (
          <p className="text-xs text-[#8896A4] font-mono">{player.summoner_name}</p>
        )}
      </div>
      <RetroBadge variant="muted" className="text-[9px]">{getRoleLabel(player.role)}</RetroBadge>
      <span className="font-mono text-xs" style={{ color: getEloColor(player.solo_queue_tier) }}>
        {player.current_rank ?? "Unranked"}
      </span>
      <RetroBadge
        variant={player.status === "active" ? "success" : "muted"}
        className="text-[9px]"
      >
        {player.status === "active" ? "Ativo" : player.status}
      </RetroBadge>
    </div>
  )
}
