"use client"

import { useState } from "react"
import { Search, UserPlus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Avatar from "@/components/ui/Avatar"
import Button from "@/components/ui/Button"
import { playerApi } from "@/lib/api"
import { mockFreeAgents } from "@/lib/mock"
import { getEloColor, getRoleLabel, eloWeight } from "@/lib/utils"
import type { Player } from "@/types"

const TIERS = ["Todos", "DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE"]
const ROLES = ["Todos", "top", "jungle", "mid", "adc", "support"]

export default function JogadoresPage() {
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState("Todos")
  const [roleFilter, setRoleFilter] = useState("Todos")

  // Tenta carregar free agents do prostaff; fallback para mock
  const { data } = useQuery({
    queryKey: ["free-agents"],
    queryFn: () => playerApi.freeAgents(),
    retry: false,
  })

  // prostaff-api: { data: { free_agents: [{ player: {...}, ... }] } }
  const rawFreeAgents = data?.data?.free_agents
  const players: Player[] = Array.isArray(rawFreeAgents)
    ? rawFreeAgents.map((item: { player: Player }) => item.player)
    : mockFreeAgents

  const filtered = players
    .filter((p) => {
      const matchSearch =
        !search ||
        p.summoner_name.toLowerCase().includes(search.toLowerCase()) ||
        (p.discord_user_id ?? "").toLowerCase().includes(search.toLowerCase())
      const matchTier =
        tierFilter === "Todos" ||
        (p.solo_queue_tier ?? "").toUpperCase() === tierFilter
      const matchRole =
        roleFilter === "Todos" ||
        p.role.toLowerCase() === roleFilter.toLowerCase()
      return matchSearch && matchTier && matchRole
    })
    .sort((a, b) => eloWeight(b.solo_queue_tier) - eloWeight(a.solo_queue_tier))

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="retro-label">ArenaBR Season 1</p>
        <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
          Free Agents
        </h1>
      </div>

      <hr className="retro-sep" />

      {/* Filters */}
      <RetroPanel>
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-1 min-w-48 space-y-1.5">
            <label className="retro-label">Buscar</label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8896A4]" />
              <input
                className="retro-input pl-8"
                placeholder="Summoner name ou Discord..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tier filter */}
          <div className="space-y-1.5">
            <label className="retro-label">Elo</label>
            <div className="flex gap-1 flex-wrap">
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`retro-badge cursor-pointer transition-colors ${
                    tierFilter === tier
                      ? "border-[#C89B3C] text-[#C89B3C]"
                      : "border-[#252D3D] text-[#8896A4] hover:border-[#8896A4]"
                  }`}
                >
                  {tier === "Todos" ? "Todos" :
                   tier === "DIAMOND" ? "Diamante" :
                   tier === "PLATINUM" ? "Platina" :
                   tier === "GOLD" ? "Ouro" :
                   tier === "SILVER" ? "Prata" : "Bronze"}
                </button>
              ))}
            </div>
          </div>

          {/* Role filter */}
          <div className="space-y-1.5">
            <label className="retro-label">Posição</label>
            <div className="flex gap-1 flex-wrap">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`retro-badge cursor-pointer transition-colors ${
                    roleFilter === role
                      ? "border-[#0596AA] text-[#0596AA]"
                      : "border-[#252D3D] text-[#8896A4] hover:border-[#8896A4]"
                  }`}
                >
                  {role === "Todos" ? "Todos" : getRoleLabel(role)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </RetroPanel>

      {/* Table */}
      <RetroPanel padding={false}>
        <div className="px-5 py-3 border-b border-[#252D3D]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            {filtered.length} free agent{filtered.length !== 1 ? "s" : ""} disponíveis
          </span>
        </div>

        <table className="retro-table">
          <thead>
            <tr>
              <th>Jogador</th>
              <th className="text-center">Pos.</th>
              <th>Elo</th>
              <th>Win Rate</th>
              <th>Discord</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => (
              <tr key={player.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar name={player.summoner_name} src={player.avatar_url ?? undefined} size="sm" />
                    <span className="font-mono text-sm text-[#E8E8E8]">{player.summoner_name}</span>
                  </div>
                </td>
                <td className="text-center">
                  <RetroBadge variant="muted" className="text-[9px]">
                    {getRoleLabel(player.role)}
                  </RetroBadge>
                </td>
                <td>
                  <span className="font-mono text-sm" style={{ color: getEloColor(player.solo_queue_tier) }}>
                    {player.current_rank ?? "Unranked"}
                  </span>
                </td>
                <td className="font-mono text-xs text-[#8896A4]">
                  {player.win_rate != null ? `${player.win_rate}%` : "—"}
                </td>
                <td className="text-sm text-[#8896A4] font-mono">
                  {player.discord_user_id ?? "—"}
                </td>
                <td>
                  <Button
                    variant="secondary"
                    className="text-xs py-1 px-2"
                    onClick={() => {
                      // TODO: abrir modal de convite quando enrollment API existir
                      import("sonner").then(({ toast }) =>
                        toast.info("Sistema de convites em breve.")
                      )
                    }}
                  >
                    <UserPlus size={11} />
                    Convidar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#8896A4] text-sm">
            Nenhum free agent com os filtros aplicados.
          </div>
        )}
      </RetroPanel>
    </div>
  )
}
