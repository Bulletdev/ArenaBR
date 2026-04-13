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
import { useTournament, useTournamentMatches } from "@/hooks/useTournament"
import { useTournamentChannel } from "@/hooks/useTournamentChannel"
import { useAuthStore } from "@/stores/auth"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { TournamentStatus, TournamentMatch, BracketSide } from "@/types"

// ─── Types ────────────────────────────────────────────────────
type Tab = "partidas" | "chaveamento" | "classificacao" | "stats" | "admin"

const STATUS_LABEL: Record<TournamentStatus, string> = {
  draft:             "Rascunho",
  registration_open: "Inscrições abertas",
  seeding:           "Seeding",
  in_progress:       "Em andamento",
  finished:          "Encerrado",
  cancelled:         "Cancelado",
}

const STATUS_VARIANT: Record<TournamentStatus, "success" | "teal" | "muted" | "gold"> = {
  draft:             "muted",
  registration_open: "success",
  seeding:           "gold",
  in_progress:       "teal",
  finished:          "muted",
  cancelled:         "muted",
}

const BRACKET_LABEL: Record<BracketSide, string> = {
  upper:       "Upper Bracket",
  lower:       "Lower Bracket",
  grand_final: "Grand Final",
}

// ─── KDA color ────────────────────────────────────────────────
function kdaColor(kda: number): string {
  if (kda >= 5) return "#C89B3C"
  if (kda >= 3) return "#0596AA"
  if (kda < 1)  return "#FF4444"
  return "#8896A4"
}

// ─── Partidas tab ─────────────────────────────────────────────
function PartidasTab({ matches, tournamentId }: { matches: TournamentMatch[]; tournamentId: string }) {
  const groups = useMemo(() => {
    const sideOrder: BracketSide[] = ["upper", "lower", "grand_final"]
    const result: { side: BracketSide; label: string; rounds: { roundLabel: string; roundOrder: number; matches: TournamentMatch[] }[] }[] = []

    for (const side of sideOrder) {
      const sideMatches = matches.filter(m => m.bracket_side === side)
      if (!sideMatches.length) continue

      const roundMap = new Map<number, { label: string; matches: TournamentMatch[] }>()
      for (const m of sideMatches) {
        if (!roundMap.has(m.round_order)) {
          roundMap.set(m.round_order, { label: m.round_label, matches: [] })
        }
        roundMap.get(m.round_order)!.matches.push(m)
      }

      const rounds = Array.from(roundMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([order, { label, matches: rm }]) => ({
          roundLabel: label,
          roundOrder: order,
          matches: rm.sort((a, b) => a.match_number - b.match_number),
        }))

      result.push({ side, label: BRACKET_LABEL[side], rounds })
    }
    return result
  }, [matches])

  if (!matches.length) {
    return (
      <p className="text-sm text-[#4A5568] font-mono text-center py-12">
        O bracket ainda não foi gerado.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {groups.map(({ side, label, rounds }) => (
        <section key={side} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">{label}</span>
            <div className="flex-1 h-px bg-[#252D3D]" />
          </div>

          {rounds.map(({ roundLabel, roundOrder, matches: roundMatches }) => (
            <div key={roundOrder} className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#4A5568] pl-1">
                {roundLabel}
              </p>
              {roundMatches.map(match => (
                <MatchCard key={match.id} match={match} tournamentId={tournamentId} />
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

// ─── Classificacao tab ────────────────────────────────────────
function ClassificacaoTab({ matches }: { matches: TournamentMatch[] }) {
  const displayRows = useMemo(() => {
    const done = matches.filter(m => m.status === "completed" || m.status === "walkover" || m.status === "confirmed")

    const map = new Map<string, {
      team_id: string; team_name: string
      wins: number; losses: number; games_won: number; games_lost: number
    }>()

    for (const match of done) {
      if (!match.team_a_id || !match.team_b_id) continue

      if (!map.has(match.team_a_id)) {
        map.set(match.team_a_id, { team_id: match.team_a_id, team_name: match.team_a_name ?? "TBD", wins: 0, losses: 0, games_won: 0, games_lost: 0 })
      }
      if (!map.has(match.team_b_id)) {
        map.set(match.team_b_id, { team_id: match.team_b_id, team_name: match.team_b_name ?? "TBD", wins: 0, losses: 0, games_won: 0, games_lost: 0 })
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

    return Array.from(map.values())
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins
        return (b.games_won - b.games_lost) - (a.games_won - a.games_lost)
      })
      .map((row, i) => ({ ...row, position: i + 1 }))
  }, [matches])

  if (!displayRows.length) {
    return (
      <p className="text-sm text-[#4A5568] font-mono text-center py-12">
        Nenhuma partida concluída ainda.
      </p>
    )
  }

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
                  <Avatar name={row.team_name} size="sm" />
                  <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm">
                    {row.team_name}
                  </span>
                </div>
              </td>
              <td className="text-center font-mono text-[#00D364] font-bold">{row.wins}</td>
              <td className="text-center font-mono text-[#FF4444] font-bold">{row.losses}</td>
              <td className="text-center font-mono text-xs text-[#8896A4]">
                {row.games_won - row.games_lost > 0
                  ? `+${row.games_won - row.games_lost}`
                  : String(row.games_won - row.games_lost)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RetroPanel>
  )
}

// ─── Stats tab — placeholder until game-level data is available ─
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

function StatsTab() {
  const [sortKey, setSortKey] = useState<SortKey>("kda")
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc")

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc")
    else { setSortKey(key); setSortDir("desc") }
  }, [sortKey])

  return (
    <div className="space-y-8">
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
                <tr>
                  <td colSpan={10} className="py-10 text-center text-[#4A5568]">
                    Estatísticas de jogadores indisponíveis para este torneio.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </RetroPanel>
      </section>
    </div>
  )
}

// ─── Bracket tab ──────────────────────────────────────────────
function BracketSlot({ match }: { match: TournamentMatch; gold?: boolean }) {
  const isCompleted = match.status === "completed" || match.status === "walkover" || match.status === "confirmed"
  return (
    <div className="retro-panel p-2 space-y-1 text-[10px] font-mono">
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

// ─── Bracket helpers ──────────────────────────────────────────
function groupByRoundOrder(matches: TournamentMatch[]) {
  const map = new Map<number, { label: string; items: TournamentMatch[] }>()
  for (const m of matches) {
    if (!map.has(m.round_order)) map.set(m.round_order, { label: m.round_label, items: [] })
    map.get(m.round_order)!.items.push(m)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([order, { label, items }]) => ({
      order, label,
      items: items.sort((a, b) => a.match_number - b.match_number),
    }))
}

// ─── Double elimination view ──────────────────────────────────
function DoubleEliminationBracket({ matches }: { matches: TournamentMatch[] }) {
  const { upperRounds, lowerRounds, grandFinal } = useMemo(() => ({
    upperRounds: groupByRoundOrder(matches.filter(m => m.bracket_side === "upper")),
    lowerRounds: groupByRoundOrder(matches.filter(m => m.bracket_side === "lower")),
    grandFinal:  matches.find(m => m.bracket_side === "grand_final"),
  }), [matches])

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[860px] space-y-8">

        {upperRounds.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] text-[#8896A4] uppercase tracking-widest">Upper Bracket</span>
              <div className="flex-1 h-px bg-[#252D3D]" />
            </div>
            <div className="flex gap-4 mb-2">
              {upperRounds.map(r => <div key={r.order} className="flex-1"><p className="font-mono text-[9px] text-[#4A5568] uppercase">{r.label}</p></div>)}
            </div>
            <div className="flex gap-4" style={{ height: 280 }}>
              {upperRounds.map(r => (
                <div key={r.order} className="flex-1 flex flex-col justify-around gap-2">
                  {r.items.map(m => <BracketSlot key={m.id} match={m} />)}
                </div>
              ))}
            </div>
          </section>
        )}

        {lowerRounds.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] text-[#8896A4] uppercase tracking-widest">Lower Bracket</span>
              <div className="flex-1 h-px bg-[#252D3D]" />
            </div>
            <div className="flex gap-4 mb-2">
              {lowerRounds.map(r => <div key={r.order} className="flex-1"><p className="font-mono text-[9px] text-[#4A5568] uppercase">{r.label}</p></div>)}
            </div>
            <div className="flex gap-4" style={{ height: 160 }}>
              {lowerRounds.map(r => (
                <div key={r.order} className="flex-1 flex flex-col justify-around gap-2">
                  {r.items.map(m => <BracketSlot key={m.id} match={m} />)}
                </div>
              ))}
            </div>
          </section>
        )}

        {grandFinal && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] text-[#C89B3C] uppercase tracking-widest">Grand Final</span>
              <div className="flex-1 h-px bg-[#C89B3C]/20" />
            </div>
            <div className="max-w-[220px]">
              <BracketSlot match={grandFinal} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ─── Single elimination view ──────────────────────────────────
function SingleEliminationBracket({ matches }: { matches: TournamentMatch[] }) {
  const rounds = useMemo(() => groupByRoundOrder(matches), [matches])
  const final  = rounds.at(-1)
  const others = rounds.slice(0, -1)

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[600px] space-y-8">
        {others.length > 0 && (
          <section>
            <div className="flex gap-4 mb-2">
              {others.map(r => <div key={r.order} className="flex-1"><p className="font-mono text-[9px] text-[#4A5568] uppercase">{r.label}</p></div>)}
            </div>
            <div className="flex gap-4" style={{ height: 280 }}>
              {others.map(r => (
                <div key={r.order} className="flex-1 flex flex-col justify-around gap-2">
                  {r.items.map(m => <BracketSlot key={m.id} match={m} />)}
                </div>
              ))}
            </div>
          </section>
        )}

        {final && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] text-[#C89B3C] uppercase tracking-widest">Final</span>
              <div className="flex-1 h-px bg-[#C89B3C]/20" />
            </div>
            <div className="max-w-[220px]">
              {final.items.map(m => <BracketSlot key={m.id} match={m} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ─── Chaveamento tab dispatcher ───────────────────────────────
function ChaveamentoTab({ matches, format }: { matches: TournamentMatch[]; format: import("@/types").TournamentFormat }) {
  if (!matches.length) {
    return (
      <p className="text-sm text-[#4A5568] font-mono text-center py-12">
        O chaveamento ainda não foi gerado.
      </p>
    )
  }

  if (format === "single_elimination") {
    return <SingleEliminationBracket matches={matches} />
  }

  return <DoubleEliminationBracket matches={matches} />
}

// ─── Page ─────────────────────────────────────────────────────
export default function CampeonatoPage() {
  const { id } = useParams<{ id: string }>()
  const tournamentId = id ?? ""

  const { data: tournament, isLoading: loadingTournament, error } = useTournament(tournamentId)
  const { data: matches = [], isLoading: loadingMatches } = useTournamentMatches(tournamentId)
  useTournamentChannel(tournamentId)

  const [tab, setTab] = useState<Tab>("partidas")
  const { user } = useAuthStore()
  const isAdmin = !!(user?.permissions?.is_admin_or_owner || user?.permissions?.can_manage_users)

  if (loadingTournament) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="font-mono text-xs text-[#4A5568] uppercase tracking-widest animate-pulse">
          Carregando torneio…
        </p>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="p-6">
        <p className="text-[#8896A4]">Torneio não encontrado.</p>
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

  // Format prize / entry fee (cents → BRL)
  const prizeBrl    = tournament.prize_pool_cents / 100
  const formatLabel = tournament.format.replace(/_/g, " ")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="retro-label">ArenaBR</p>
            <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
              {tournament.name}
            </h1>
          </div>
          <RetroBadge variant={STATUS_VARIANT[tournament.status]}>
            {STATUS_LABEL[tournament.status]}
          </RetroBadge>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#00D364]">
            <IconDollarSign size={12} />
            <span className="font-bold">{formatCurrency(prizeBrl)}</span>
            <span className="text-[#8896A4]">premiação</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8896A4]">
            <IconRoster size={12} />
            <span>{tournament.enrolled_teams_count}/{tournament.max_teams} times</span>
          </div>
          {tournament.scheduled_start_at && (
            <div className="flex items-center gap-1.5 text-[#8896A4]">
              <IconCalendar size={12} />
              <span>
                {formatDate(tournament.scheduled_start_at)}
                {tournament.finished_at ? ` → ${formatDate(tournament.finished_at)}` : ""}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[#8896A4]">
            <IconTrophy size={12} />
            <span className="capitalize">{formatLabel}</span>
          </div>
        </div>
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
                ? "text-[#C89B3C] border-b-2 border-[#C89B3C] -mb-px"
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
        {tab === "partidas"      && (
          loadingMatches
            ? <p className="text-sm text-[#4A5568] font-mono text-center py-12 animate-pulse">Carregando partidas…</p>
            : <PartidasTab matches={matches} tournamentId={tournamentId} />
        )}
        {tab === "chaveamento"   && (
          loadingMatches
            ? <p className="text-sm text-[#4A5568] font-mono text-center py-12 animate-pulse">Carregando chaveamento…</p>
            : <ChaveamentoTab matches={matches} format={tournament.format} />
        )}
        {tab === "classificacao" && (
          loadingMatches
            ? <p className="text-sm text-[#4A5568] font-mono text-center py-12 animate-pulse">Carregando classificação…</p>
            : <ClassificacaoTab matches={matches} />
        )}
        {tab === "stats"         && <StatsTab />}
        {tab === "admin"         && isAdmin && <AdminMatchPanel tournamentId={tournamentId} />}
      </div>
    </div>
  )
}
