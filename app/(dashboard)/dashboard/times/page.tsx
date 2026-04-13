"use client"

import { Crown, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Avatar from "@/components/ui/Avatar"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { playerApi } from "@/lib/api"
import { getEloColor, getRoleLabel } from "@/lib/utils"
import type { Player } from "@/types"

export default function TimesPage() {
  const { data: playersData, isLoading } = useQuery({
    queryKey: ["my-players"],
    queryFn: () => playerApi.list(),
    retry: false,
  })

  const myPlayers: Player[] = Array.isArray(playersData?.data?.players)
    ? playersData.data.players
    : []

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="retro-label">ArenaBR</p>
          <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
            Times
          </h1>
        </div>
        <Link href="/dashboard/campeonatos">
          <Button>
            <Users size={14} />
            Ver campeonatos
          </Button>
        </Link>
      </div>

      <hr className="retro-sep" />

      {/* Meu elenco */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Crown size={14} className="text-[#C89B3C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            Meu elenco
          </span>
          {!isLoading && (
            <span className="text-xs text-[#8896A4] font-mono">
              — {myPlayers.length} jogadores
            </span>
          )}
        </div>

        {isLoading ? (
          <RetroPanel>
            <p className="text-sm text-[#8896A4] text-center py-4 animate-pulse">
              Carregando elenco…
            </p>
          </RetroPanel>
        ) : myPlayers.length === 0 ? (
          <RetroPanel>
            <p className="text-sm text-[#4A5568] font-mono text-center py-8">
              Nenhum jogador no elenco.
            </p>
          </RetroPanel>
        ) : (
          <RetroPanel padding={false}>
            <table className="retro-table">
              <thead>
                <tr>
                  <th>Jogador</th>
                  <th className="text-center">Pos.</th>
                  <th>Elo</th>
                  <th>Win Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myPlayers.map((player) => (
                  <tr key={player.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={player.summoner_name}
                          src={player.avatar_url ?? undefined}
                          size="sm"
                        />
                        <div>
                          <p className="font-mono text-sm text-[#E8E8E8]">
                            {player.professional_name ?? player.summoner_name}
                          </p>
                          {player.professional_name && (
                            <p className="text-xs text-[#8896A4] font-mono">
                              {player.summoner_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <RetroBadge variant="muted" className="text-[9px]">
                        {getRoleLabel(player.role)}
                      </RetroBadge>
                    </td>
                    <td>
                      <span
                        className="font-mono text-xs"
                        style={{ color: getEloColor(player.solo_queue_tier) }}
                      >
                        {player.current_rank ?? "Unranked"}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-[#8896A4]">
                      {player.win_rate != null ? `${player.win_rate}%` : "—"}
                    </td>
                    <td>
                      <RetroBadge
                        variant={player.status === "active" ? "success" : "muted"}
                        className="text-[9px]"
                      >
                        {player.status === "active"   ? "Ativo"   :
                         player.status === "benched"  ? "Banco"   :
                         player.status === "trial"    ? "Trial"   : "Inativo"}
                      </RetroBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RetroPanel>
        )}
      </section>
    </div>
  )
}
