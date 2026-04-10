"use client"

import { useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Avatar from "@/components/ui/Avatar"
import { IconTrophy, IconCalendar, IconRoster, IconDollarSign, IconBarChart, IconShield } from "@/components/ui/NavIcons"
import MatchCard from "@/components/championship/MatchCard"
import AdminMatchPanel from "@/components/championship/AdminMatchPanel"
import { mockChampionships, mockStandings, mockChampionStats } from "@/lib/mock"
import { useChampionshipStore } from "@/stores/championship"
import { useAuthStore } from "@/stores/auth"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { ChampionshipStatus, BracketSide } from "@/types"

// ─── Types ────────────────────────────────────────────────────
type Tab = "partidas" | "chaveamento" | "classificacao" | "stats" | "admin"

const statusLabel: Record<ChampionshipStatus, string> = {
  open:     "Inscrições abertas",
  ongoing:  "Em andamento",
  finished: "Encerrado",
}

const statusVariant: Record<ChampionshipStatus, "success" | "teal" | "muted"> = {
  open:     "success",
  ongoing:  "teal",
  finished: "muted",
}

// ─── Round order for grouping ─────────────────────────────────
const ROUND_ORDER: Record<string, number> = {
  "UB R1": 1, "UB R2": 2, "UB Final": 3,
  "LB R1": 4, "LB R2": 5, "LB Semi": 6, "LB Final": 7,
  "Grand Final": 8,
}

const BRACKET_LABEL: Record<BracketSide, string> = {
  upper: "Upper Bracket",
  lower: "Lower Bracket",
  grand_final: "Grand Final",
}

// ─── KDA color helper ─────────────────────────────────────────
function kdaColor(kda: number): string {
  if (kda >= 5) return "#C89B3C"
  if (kda >= 3) return "#0596AA"
  if (kda < 1)  return "#FF4444"
  return "#8896A4"
}

// ─── Partidas tab ─────────────────────────────────────────────
function PartidasTab({ championshipId }: { championshipId: number }) {
  const allMatches = useChampionshipStore(s => s.matches)
  const matches = allMatches.filter(m => m.championship_id === championshipId)

  // Group by bracket_side then round
  const groups = useMemo(() => {
    const sideOrder: BracketSide[] = ["upper", "lower", "grand_final"]
    const result: { side: BracketSide; label: string; rounds: { round: string; matches: typeof matches }[] }[] = []

    for (const side of sideOrder) {
      const sideMatches = matches.filter(m => m.bracket_side === side)
      if (!sideMatches.length) continue

      const roundMap = new Map<string, typeof matches>()
      for (const m of sideMatches) {
        if (!roundMap.has(m.round)) roundMap.set(m.round, [])
        roundMap.get(m.round)!.push(m)
      }

      const rounds = Array.from(roundMap.entries())
        .sort(([a], [b]) => (ROUND_ORDER[a] ?? 99) - (ROUND_ORDER[b] ?? 99))
        .map(([round, roundMatches]) => ({ round, matches: roundMatches.sort((a, b) => a.match_number - b.match_number) }))

      result.push({ side, label: BRACKET_LABEL[side], rounds })
    }
    return result
  }, [matches])

  return (
    <div className="space-y-8">
      {groups.map(({ side, label, rounds }) => (
        <section key={side} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">{label}</span>
            <div className="flex-1 h-px bg-[#252D3D]" />
          </div>

          {rounds.map(({ round, matches: roundMatches }) => (
            <div key={round} className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#4A5568] pl-1">{round}</p>
              {roundMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

// ─── Classificacao tab ────────────────────────────────────────
function ClassificacaoTab({ championshipId }: { championshipId: number }) {
  // Derive standings from matches (live from store)
  const allMatches = useChampionshipStore(s => s.matches)
  const matches = allMatches.filter(m => m.championship_id === championshipId && (m.status === "completed" || m.status === "walkover"))

  const { displayRows } = useMemo(() => {
    const map = new Map<number, { team_id: number; team_name: string; team_logo: string | null; wins: number; losses: number; games_won: number; games_lost: number }>()

    for (const match of matches) {
      if (!match.team_a_id || !match.team_b_id) continue

      if (!map.has(match.team_a_id)) {
        map.set(match.team_a_id, { team_id: match.team_a_id, team_name: match.team_a_name!, team_logo: match.team_a_logo, wins: 0, losses: 0, games_won: 0, games_lost: 0 })
      }
      if (!map.has(match.team_b_id)) {
        map.set(match.team_b_id, { team_id: match.team_b_id, team_name: match.team_b_name!, team_logo: match.team_b_logo, wins: 0, losses: 0, games_won: 0, games_lost: 0 })
      }

      const a = map.get(match.team_a_id)!
      const b = map.get(match.team_b_id)!

      if (match.winner_id === match.team_a_id) {
        a.wins++; b.losses++
      } else {
        b.wins++; a.losses++
      }
      a.games_won += match.team_a_score; a.games_lost += match.team_b_score
      b.games_won += match.team_b_score; b.games_lost += match.team_a_score
    }

    const computed = Array.from(map.values())
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins
        return (b.games_won - b.games_lost) - (a.games_won - a.games_lost)
      })
      .map((row, i) => ({ ...row, position: i + 1 }))

    const fallback = computed.length > 0 ? computed : mockStandings.map(r => ({
      ...r, games_won: 0, games_lost: 0
    }))

    return { displayRows: fallback }
  }, [matches])

  return (
    <RetroPanel padding={false}>
      <table className="retro-table">
        <thead>
          <tr>
            <th className="w-8">#</th>
            <th>Time</th>
            <th className="text-center">V</th>
            <th className="text-center">D</th>
            <th className="text-center">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, i) => (
            <tr key={row.team_id} className={i === 0 ? "bg-[#C89B3C]/5" : ""}>
              <td>
                <span className={cn("font-mono text-sm font-bold",
                  row.position === 1 ? "text-[#C89B3C]" :
                  row.position === 2 ? "text-[#8896A4]" :
                  row.position === 3 ? "text-[#9B6B4A]" : "text-[#4A5568]"
                )}>
                  {row.position}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <Avatar name={row.team_name} src={row.team_logo ?? undefined} size="sm" />
                  <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm">
                    {row.team_name}
                  </span>
                </div>
              </td>
              <td className="text-center font-mono text-[#00D364] font-bold">{row.wins}</td>
              <td className="text-center font-mono text-[#FF4444] font-bold">{row.losses}</td>
              <td className="text-center font-mono text-xs text-[#8896A4]">
                {row.games_won > 0 || row.games_lost > 0
                  ? `${row.games_won > row.games_lost ? "+" : ""}${row.games_won - row.games_lost}`
                  : ("match_diff" in row ? ((row as { match_diff: number }).match_diff > 0 ? `+${(row as { match_diff: number }).match_diff}` : String((row as { match_diff: number }).match_diff)) : "—")
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RetroPanel>
  )
}

// ─── Stats tab ────────────────────────────────────────────────
type SortKey = "kda" | "kills" | "deaths" | "assists" | "cs" | "gold" | "damage_dealt"

const STAT_COLS: { key: SortKey; label: string }[] = [
  { key: "kda",          label: "KDA"  },
  { key: "kills",        label: "K"    },
  { key: "deaths",       label: "D"    },
  { key: "assists",      label: "A"    },
  { key: "cs",           label: "CS"   },
  { key: "gold",         label: "Gold" },
  { key: "damage_dealt", label: "Dano" },
]

function StatsTab({ championshipId }: { championshipId: number }) {
  const [sortKey, setSortKey] = useState<SortKey>("kda")
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc")
  const allMatches = useChampionshipStore(s => s.matches)

  // Aggregate player stats across all games
  const playerMap = useMemo(() => {
    const map = new Map<number, {
      player_id: number; summoner_name: string; team_name: string; role: string
      kills: number; deaths: number; assists: number; kda: number
      cs: number; gold: number; damage_dealt: number; games: number
    }>()

    const matches = allMatches.filter(m => m.championship_id === championshipId)
    for (const match of matches) {
      for (const game of match.games) {
        for (const stat of game.player_stats) {
          if (!map.has(stat.player_id)) {
            map.set(stat.player_id, {
              player_id: stat.player_id, summoner_name: stat.summoner_name,
              team_name: stat.team_name, role: stat.role,
              kills: 0, deaths: 0, assists: 0, kda: 0, cs: 0, gold: 0, damage_dealt: 0, games: 0,
            })
          }
          const p = map.get(stat.player_id)!
          p.kills += stat.kills; p.deaths += stat.deaths; p.assists += stat.assists
          p.cs += stat.cs; p.gold += stat.gold; p.damage_dealt += stat.damage_dealt; p.games++
        }
      }
    }

    // Compute averages
    for (const p of map.values()) {
      if (p.games > 0) {
        p.kills = parseFloat((p.kills / p.games).toFixed(1))
        p.deaths = parseFloat((p.deaths / p.games).toFixed(1))
        p.assists = parseFloat((p.assists / p.games).toFixed(1))
        p.cs = Math.round(p.cs / p.games)
        p.gold = Math.round(p.gold / p.games)
        p.damage_dealt = Math.round(p.damage_dealt / p.games)
        p.kda = p.deaths === 0 ? p.kills + p.assists : parseFloat(((p.kills + p.assists) / p.deaths).toFixed(2))
      }
    }
    return map
  }, [championshipId])

  const sorted = useMemo(() => {
    return Array.from(playerMap.values()).sort((a, b) => {
      const diff = (a[sortKey] as number) - (b[sortKey] as number)
      return sortDir === "desc" ? -diff : diff
    })
  }, [playerMap, sortKey, sortDir])

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc")
    else { setSortKey(key); setSortDir("desc") }
  }, [sortKey])

  // Champion stats
  const champStats = mockChampionStats.slice().sort((a, b) => b.picks - a.picks)

  return (
    <div className="space-y-8">
      {/* Player leaderboard */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <IconBarChart size={14} className="text-[#C89B3C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">Leaderboard de jogadores</span>
          <span className="text-[10px] text-[#4A5568] font-mono">(médias por game)</span>
        </div>

        <RetroPanel padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-[#252D3D] text-[#8896A4] text-[10px] uppercase tracking-wider">
                  <th className="text-left py-2 px-4 font-normal">#</th>
                  <th className="text-left py-2 px-2 font-normal">Jogador</th>
                  <th className="text-left py-2 px-2 font-normal">Time</th>
                  {STAT_COLS.map(col => (
                    <th key={col.key} className="py-2 px-2 font-normal">
                      <button
                        onClick={() => handleSort(col.key)}
                        className={cn(
                          "flex items-center gap-0.5 mx-auto transition-colors",
                          sortKey === col.key ? "text-[#C89B3C]" : "hover:text-[#E8E8E8]"
                        )}
                      >
                        {col.label}
                        {sortKey === col.key && (
                          <span className="text-[8px]">{sortDir === "desc" ? "↓" : "↑"}</span>
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <tr key={p.player_id} className="border-b border-[#1A2235] hover:bg-[#1A2235] transition-colors">
                    <td className="py-2 px-4">
                      <span className={cn("font-bold",
                        i === 0 ? "text-[#C89B3C]" : i === 1 ? "text-[#8896A4]" : i === 2 ? "text-[#9B6B4A]" : "text-[#4A5568]"
                      )}>{i + 1}</span>
                    </td>
                    <td className="py-2 px-2 text-[#E8E8E8]">{p.summoner_name}</td>
                    <td className="py-2 px-2 text-[#8896A4]">{p.team_name}</td>
                    <td className="py-2 px-2 text-center">
                      <span style={{ color: kdaColor(p.kda) }} className="font-bold">{p.kda.toFixed(1)}</span>
                    </td>
                    <td className="py-2 px-2 text-center text-[#00D364]">{p.kills}</td>
                    <td className="py-2 px-2 text-center text-[#FF4444]">{p.deaths}</td>
                    <td className="py-2 px-2 text-center text-[#8896A4]">{p.assists}</td>
                    <td className="py-2 px-2 text-center text-[#8896A4]">{p.cs}</td>
                    <td className="py-2 px-2 text-center text-[#8896A4]">{(p.gold / 1000).toFixed(1)}k</td>
                    <td className="py-2 px-2 text-center text-[#8896A4]">{(p.damage_dealt / 1000).toFixed(1)}k</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RetroPanel>
      </section>

      {/* Champion stats */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <IconTrophy size={14} className="text-[#C89B3C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">Picks & Bans</span>
        </div>

        <RetroPanel padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-[#252D3D] text-[#8896A4] text-[10px] uppercase tracking-wider">
                  <th className="text-left py-2 px-4 font-normal">Campeão</th>
                  <th className="text-center py-2 px-3 font-normal">Picks</th>
                  <th className="text-center py-2 px-3 font-normal">Bans</th>
                  <th className="text-center py-2 px-3 font-normal">Vitórias</th>
                  <th className="text-center py-2 px-3 font-normal">Win%</th>
                </tr>
              </thead>
              <tbody>
                {champStats.map((c) => {
                  const winColor =
                    c.picks === 0 ? "#8896A4" :
                    c.win_rate >= 60 ? "#00D364" :
                    c.win_rate >= 40 ? "#C89B3C" : "#FF4444"
                  return (
                    <tr key={c.champion_name} className="border-b border-[#1A2235] hover:bg-[#1A2235] transition-colors">
                      <td className="py-2 px-4 text-[#E8E8E8]">{c.champion_name}</td>
                      <td className="py-2 px-3 text-center text-[#0596AA]">{c.picks}</td>
                      <td className="py-2 px-3 text-center text-[#8896A4]">{c.bans}</td>
                      <td className="py-2 px-3 text-center text-[#00D364]">{c.wins}</td>
                      <td className="py-2 px-3 text-center">
                        <span style={{ color: winColor }} className="font-bold">
                          {c.picks > 0 ? `${c.win_rate}%` : "—"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </RetroPanel>
      </section>
    </div>
  )
}

// ─── Bracket ──────────────────────────────────────────────────
function ChaveamentoTab({ championshipId }: { championshipId: number }) {
  const allMatches = useChampionshipStore(s => s.matches)
  const matches = allMatches.filter(m => m.championship_id === championshipId)
  const ubR1 = matches.filter(m => m.round === "UB R1").sort((a, b) => a.match_number - b.match_number)
  const ubR2 = matches.filter(m => m.round === "UB R2").sort((a, b) => a.match_number - b.match_number)
  const ubF  = matches.find(m => m.round === "UB Final")
  const lbR1 = matches.filter(m => m.round === "LB R1").sort((a, b) => a.match_number - b.match_number)
  const lbR2 = matches.filter(m => m.round === "LB R2").sort((a, b) => a.match_number - b.match_number)
  const lbS  = matches.find(m => m.round === "LB Semi")
  const lbF  = matches.find(m => m.round === "LB Final")
  const gf   = matches.find(m => m.round === "Grand Final")

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[860px] space-y-8">

        {/* Upper Bracket */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] text-[#8896A4] uppercase tracking-widest">Upper Bracket</span>
            <div className="flex-1 h-px bg-[#252D3D]" />
          </div>
          {/* Labels */}
          <div className="flex gap-4 mb-2">
            {["R1", "R2", "Final"].map(l => (
              <div key={l} className="flex-1">
                <p className="font-mono text-[9px] text-[#4A5568] uppercase">{l}</p>
              </div>
            ))}
          </div>
          {/* Rounds — justify-around garante centro geométrico correto entre rounds */}
          <div className="flex gap-4 h-[280px]">
            <div className="flex-1 flex flex-col justify-around gap-2">
              {ubR1.map(m => <BracketSlot key={m.id} match={m} />)}
            </div>
            <div className="flex-1 flex flex-col justify-around gap-2">
              {ubR2.map(m => <BracketSlot key={m.id} match={m} />)}
            </div>
            <div className="flex-1 flex flex-col justify-around gap-2">
              {ubF && <BracketSlot match={ubF} />}
            </div>
          </div>
        </section>

        {/* Lower Bracket */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] text-[#8896A4] uppercase tracking-widest">Lower Bracket</span>
            <div className="flex-1 h-px bg-[#252D3D]" />
          </div>
          {/* Labels */}
          <div className="flex gap-4 mb-2">
            {["R1", "R2", "Semi", "Final"].map(l => (
              <div key={l} className="flex-1">
                <p className="font-mono text-[9px] text-[#4A5568] uppercase">{l}</p>
              </div>
            ))}
          </div>
          {/* Rounds */}
          <div className="flex gap-4 h-[160px]">
            <div className="flex-1 flex flex-col justify-around gap-2">
              {lbR1.map(m => <BracketSlot key={m.id} match={m} />)}
            </div>
            <div className="flex-1 flex flex-col justify-around gap-2">
              {lbR2.map(m => <BracketSlot key={m.id} match={m} />)}
            </div>
            <div className="flex-1 flex flex-col justify-around gap-2">
              {lbS && <BracketSlot match={lbS} />}
            </div>
            <div className="flex-1 flex flex-col justify-around gap-2">
              {lbF && <BracketSlot match={lbF} />}
            </div>
          </div>
        </section>

        {/* Grand Final */}
        {gf && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] text-[#C89B3C] uppercase tracking-widest">Grand Final</span>
              <div className="flex-1 h-px bg-[#C89B3C]/20" />
            </div>
            <div className="max-w-[220px]">
              <BracketSlot match={gf} gold />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function BracketSlot({ match, gold }: { match: import("@/types").Match; gold?: boolean }) {
  const isCompleted = match.status === "completed"
  return (
    <div className={cn(
      "retro-panel p-2 space-y-1 text-[10px] font-mono",
      gold && "retro-panel-gold",
    )}>
      <div className={cn("flex items-center justify-between gap-2",
        match.winner_id === match.team_a_id ? "text-[#E8E8E8]" : isCompleted ? "text-[#4A5568]" : "text-[#8896A4]"
      )}>
        <span className="truncate">{match.team_a_name ?? "TBD"}</span>
        <span className={cn("font-bold shrink-0", match.winner_id === match.team_a_id ? "text-[#00D364]" : "")}>
          {match.team_a_score}
        </span>
      </div>
      <div className={cn("flex items-center justify-between gap-2",
        match.winner_id === match.team_b_id ? "text-[#E8E8E8]" : isCompleted ? "text-[#4A5568]" : "text-[#8896A4]"
      )}>
        <span className="truncate">{match.team_b_name ?? "TBD"}</span>
        <span className={cn("font-bold shrink-0", match.winner_id === match.team_b_id ? "text-[#00D364]" : "")}>
          {match.team_b_score}
        </span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────
export default function CampeonatoPage() {
  const { id } = useParams<{ id: string }>()
  const championshipId = parseInt(id ?? "1")
  const championship = mockChampionships.find(c => c.id === championshipId)
  const [tab, setTab] = useState<Tab>("partidas")
  const { user } = useAuthStore()
  const isAdmin = !!user?.permissions?.is_admin_or_owner

  if (!championship) {
    return (
      <div className="p-6">
        <p className="text-[#8896A4]">Campeonato não encontrado.</p>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; icon?: React.ReactNode }[] = [
    { key: "partidas",      label: "Partidas"      },
    { key: "chaveamento",   label: "Chaveamento"   },
    { key: "classificacao", label: "Classificação" },
    { key: "stats",         label: "Stats"         },
    ...(isAdmin ? [{ key: "admin" as Tab, label: "Admin", icon: <IconShield size={12} /> }] : []),
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="retro-label">ArenaBR</p>
            <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
              {championship.name}
            </h1>
          </div>
          <RetroBadge variant={statusVariant[championship.status]}>
            {statusLabel[championship.status]}
          </RetroBadge>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#00D364]">
            <IconDollarSign size={12} />
            <span className="font-bold">{formatCurrency(championship.prize_pool)}</span>
            <span className="text-[#8896A4]">premiação</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8896A4]">
            <IconRoster size={12} />
            <span>{championship.enrolled_teams}/{championship.max_teams} times</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8896A4]">
            <IconCalendar size={12} />
            <span>{formatDate(championship.start_date)} → {formatDate(championship.end_date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8896A4]">
            <IconTrophy size={12} />
            <span>{championship.format}</span>
          </div>
        </div>

        <p className="text-sm text-[#8896A4]">{championship.description}</p>
      </div>

      <hr className="retro-sep" />

      {/* Tabs */}
      <div role="tablist" className="flex gap-1 border-b border-[#252D3D] -mb-3 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0",
              tab === t.key
                ? t.key === "admin"
                  ? "text-[#C89B3C] border-b-2 border-[#C89B3C] -mb-px"
                  : "text-[#C89B3C] border-b-2 border-[#C89B3C] -mb-px"
                : t.key === "admin"
                  ? "text-[#8896A4] hover:text-[#C89B3C]"
                  : "text-[#8896A4] hover:text-[#E8E8E8]",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === "partidas"      && <PartidasTab      championshipId={championshipId} />}
        {tab === "chaveamento"   && <ChaveamentoTab   championshipId={championshipId} />}
        {tab === "classificacao" && <ClassificacaoTab championshipId={championshipId} />}
        {tab === "stats"         && <StatsTab         championshipId={championshipId} />}
        {tab === "admin"         && isAdmin && <AdminMatchPanel championshipId={championshipId} />}
      </div>
    </div>
  )
}
