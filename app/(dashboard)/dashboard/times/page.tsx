"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Crown, Users, FlaskConical } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import Avatar from "@/components/ui/Avatar"
import { playerApi } from "@/lib/api"
import { mockPlayers, mockEnrolledTeams } from "@/lib/mock"
import { getEloColor, getRoleLabel } from "@/lib/utils"
import type { Player, EnrolledTeam } from "@/types"
import Link from "next/link"

export default function TimesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Elenco da org do usuário logado (prostaff-api)
  const { data: playersData, isLoading } = useQuery({
    queryKey: ["my-players"],
    queryFn: () => playerApi.list(),
    retry: false,
  })

  const myPlayers: Player[] = Array.isArray(playersData?.data?.players) ? playersData.data.players : mockPlayers

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="retro-label">ArenaBR Season 1</p>
          <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
            Times
          </h1>
        </div>
        <Link href="/dashboard">
          <Button>
            <Users size={14} />
            Inscrever no campeonato
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
          <span className="text-xs text-[#8896A4] font-mono">— {myPlayers.length} jogadores</span>
        </div>

        {isLoading ? (
          <RetroPanel>
            <p className="text-sm text-[#8896A4] text-center py-4">Carregando elenco...</p>
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
                        <Avatar name={player.summoner_name} src={player.avatar_url ?? undefined} size="sm" />
                        <div>
                          <p className="font-mono text-sm text-[#E8E8E8]">
                            {player.professional_name ?? player.summoner_name}
                          </p>
                          {player.professional_name && (
                            <p className="text-xs text-[#8896A4] font-mono">{player.summoner_name}</p>
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
                      <span className="font-mono text-xs" style={{ color: getEloColor(player.solo_queue_tier) }}>
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
                        {player.status === "active" ? "Ativo" :
                         player.status === "benched" ? "Banco" :
                         player.status === "trial" ? "Trial" : "Inativo"}
                      </RetroBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {myPlayers.length === 0 && (
              <div className="py-10 text-center text-[#8896A4] text-sm">
                Nenhum jogador no elenco.
              </div>
            )}
          </RetroPanel>
        )}
      </section>

      {/* Times inscritos no campeonato */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Users size={14} className="text-[#C89B3C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            Times inscritos no campeonato
          </span>
          <span className="text-xs text-[#8896A4] font-mono">— {mockEnrolledTeams.length}/{8}</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-[#8896A4] font-mono border border-[#252D3D] px-2 py-0.5">
            <FlaskConical size={10} className="text-[#C89B3C]" />
            demonstração
          </span>
        </div>

        <div className="space-y-2">
          {mockEnrolledTeams.map((team) => (
            <EnrolledTeamCard
              key={team.id}
              team={team}
              expanded={expandedId === team.id}
              onToggle={() => setExpandedId(expandedId === team.id ? null : team.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── Enrolled Team Card ────────────────────────────────────────
function EnrolledTeamCard({
  team,
  expanded,
  onToggle,
}: {
  team: EnrolledTeam
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <RetroPanel padding={false} className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#1A2235] transition-colors"
      >
        <Avatar name={team.org_name} src={team.org_logo ?? undefined} size="md" />

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider">
              {team.org_name}
            </span>
            <RetroBadge variant={team.payment_status === "confirmed" ? "success" : "muted"}>
              {team.payment_status === "confirmed" ? "Confirmado" : "Aguardando"}
            </RetroBadge>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-[#8896A4]">
            <span>{team.players.length} jogadores</span>
            <span>·</span>
            <span>{team.org_region}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#00D364]">{team.wins}V</span>
          <span className="text-[#FF4444]">{team.losses}D</span>
          {expanded
            ? <ChevronUp size={14} className="text-[#8896A4]" />
            : <ChevronDown size={14} className="text-[#8896A4]" />
          }
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#252D3D]">
          <div className="px-5 py-2 bg-[#0A0E1A]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8896A4]">Elenco</span>
          </div>
          <div className="divide-y divide-[#252D3D]">
            {team.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#1A2235] transition-colors"
              >
                <Avatar name={player.summoner_name} src={player.avatar_url ?? undefined} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {player.is_captain && <Crown size={11} className="text-[#C89B3C]" />}
                    <span className="font-mono text-sm text-[#E8E8E8]">{player.summoner_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RetroBadge variant="muted" className="text-[9px]">
                    {getRoleLabel(player.role)}
                  </RetroBadge>
                  <span className="font-mono text-xs text-[#8896A4]">
                    {player.current_rank ?? "Unranked"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </RetroPanel>
  )
}
