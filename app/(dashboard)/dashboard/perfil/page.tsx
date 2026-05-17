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
    return <div className="p-6 text-muted text-sm">Carregando perfil...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="retro-label">Conta</p>
        <h1 className="font-display text-3xl font-bold text-text uppercase tracking-wider">
          Meu Perfil
        </h1>
      </div>

      <hr className="retro-sep" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card principal */}
        <RetroPanel variant="crimson" corners className="lg:col-span-1 space-y-4">
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-border">
            <Avatar name={user.full_name || user.email} src={user.avatar_url ?? undefined} size="lg" />
            <div className="text-center">
              <p className="font-display font-bold text-text text-lg uppercase tracking-widest">
                {user.full_name || "—"}
              </p>
              <p className="font-mono text-xs text-muted">{user.email}</p>
            </div>
            <RetroBadge variant="crimson">{user.role_display}</RetroBadge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User size={13} className="text-muted" />
              <span className="text-muted text-xs uppercase tracking-wider font-mono">E-mail</span>
              <span className="ml-auto text-text text-xs truncate max-w-28">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DiscordIcon size={13} className="text-muted" />
              <span className="text-muted text-xs uppercase tracking-wider font-mono">Discord</span>
              <span className="ml-auto font-mono text-xs text-text">
                {user.discord_user_id || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={13} className="text-muted" />
              <span className="text-muted text-xs uppercase tracking-wider font-mono">Membro desde</span>
              <span className="ml-auto text-text text-xs">{formatDate(user.created_at)}</span>
            </div>
          </div>
        </RetroPanel>

        {/* Direita */}
        <div className="lg:col-span-2 space-y-4">
          {/* Elenco */}
          <RetroPanel>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-muted" />
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Elenco da organização
              </span>
              {isLoading && (
                <RefreshCw size={12} className="text-muted animate-spin ml-auto" />
              )}
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-muted text-sm">Carregando jogadores...</div>
            ) : players.length === 0 ? (
              <div className="py-6 text-center text-muted text-sm">
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
              <Shield size={14} className="text-muted" />
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Permissões da conta
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(user.permissions).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className={val ? "text-success" : "text-danger"}>
                    {val ? "✓" : "✗"}
                  </span>
                  <span className="text-muted font-mono">
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
    <div className="flex items-center gap-3 px-3 py-2.5 border border-border hover:border-muted transition-colors">
      <Avatar name={player.summoner_name} src={player.avatar_url ?? undefined} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm text-text truncate">
          {player.professional_name ?? player.summoner_name}
        </p>
        {player.professional_name && (
          <p className="text-xs text-muted font-mono">{player.summoner_name}</p>
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
