"use client"

import { memo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn, formatDatetime } from "@/lib/utils"
import RetroBadge from "@/components/ui/RetroBadge"
import Avatar from "@/components/ui/Avatar"
import { IconChevronDown, IconCalendar } from "@/components/ui/NavIcons"
import type { Match, Game, PlayerStat } from "@/types"

type StatRow = PlayerStat | { divider: true }

// ─── Status ───────────────────────────────────────────────────
const statusLabel: Record<string, string> = {
  scheduled: "Agendada",
  live:      "Ao vivo",
  completed: "Encerrada",
  walkover:  "W.O.",
}

const statusVariant: Record<string, "muted" | "success" | "teal" | "gold"> = {
  scheduled: "muted",
  live:      "teal",
  completed: "success",
  walkover:  "muted",
}

// ─── KDA color ────────────────────────────────────────────────
function kdaColor(kda: number): string {
  if (kda >= 5) return "#C89B3C"
  if (kda >= 3) return "#0596AA"
  if (kda < 1)  return "#FF4444"
  return "#8896A4"
}

// ─── Game duration ────────────────────────────────────────────
function formatDuration(seconds: number | null): string {
  if (!seconds) return "—"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

// ─── Game scoreboard ──────────────────────────────────────────
function GameScoreboard({ game, teamAId }: { game: Game; teamAId: number | null }) {
  const blue = game.player_stats.filter(p => p.side === "blue")
  const red  = game.player_stats.filter(p => p.side === "red")

  // determine winner label
  const winnerLabel = game.winner_id === game.blue_team_id ? "blue" : game.winner_id === game.red_team_id ? "red" : null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8896A4] uppercase tracking-widest px-1">
        <span className={cn("font-bold", winnerLabel === "blue" ? "text-[#0596AA]" : "")}>
          {blue[0]?.team_name ?? "Azul"} {winnerLabel === "blue" && "✓"}
        </span>
        <span>{formatDuration(game.duration_seconds)}</span>
        <span className={cn("font-bold", winnerLabel === "red" ? "text-[#C89B3C]" : "")}>
          {winnerLabel === "red" && "✓ "}{red[0]?.team_name ?? "Vermelho"}
        </span>
      </div>

      {/* Stats table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-[#8896A4] text-[10px] uppercase tracking-wider border-b border-[#252D3D]">
              <th className="text-left py-1 px-2 font-normal">Jogador</th>
              <th className="text-left py-1 px-1 font-normal">Campeão</th>
              <th className="text-center py-1 px-1 font-normal">KDA</th>
              <th className="text-center py-1 px-1 font-normal">K/D/A</th>
              <th className="text-center py-1 px-1 font-normal">CS</th>
              <th className="text-right py-1 px-2 font-normal">Dano</th>
            </tr>
          </thead>
          <tbody>
            {([...blue, { divider: true }, ...red] as StatRow[]).map((stat, i) => {
              if ("divider" in stat) {
                return <tr key="divider"><td colSpan={6} className="py-1 border-t border-[#252D3D]" /></tr>
              }
              const s = stat
              return (
                <tr
                  key={s.player_id}
                  className={cn(
                    "border-b border-[#1A2235] hover:bg-[#1A2235] transition-colors",
                    s.side === "blue" && "bg-[#0596AA]/5",
                    s.side === "red"  && "bg-[#C89B3C]/5",
                  )}
                >
                  <td className="py-1.5 px-2 text-[#E8E8E8]">{s.summoner_name}</td>
                  <td className="py-1.5 px-1 text-[#8896A4]">{s.champion_name}</td>
                  <td className="py-1.5 px-1 text-center">
                    <span style={{ color: kdaColor(s.kda) }} className="font-bold">
                      {s.kda.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-1.5 px-1 text-center">
                    <span className="text-[#00D364]">{s.kills}</span>
                    <span className="text-[#252D3D] mx-0.5">/</span>
                    <span className="text-[#FF4444]">{s.deaths}</span>
                    <span className="text-[#252D3D] mx-0.5">/</span>
                    <span className="text-[#8896A4]">{s.assists}</span>
                  </td>
                  <td className="py-1.5 px-1 text-center text-[#8896A4]">{s.cs}</td>
                  <td className="py-1.5 px-2 text-right text-[#8896A4]">
                    {(s.damage_dealt / 1000).toFixed(1)}k
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Match Card ───────────────────────────────────────────────
const MatchCard = memo(function MatchCard({ match }: { match: Match }) {
  const [open, setOpen] = useState(false)
  const [activeGame, setActiveGame] = useState(0)

  const hasGames = match.games.length > 0
  const isCompleted = match.status === "completed" || match.status === "walkover"

  return (
    <div className={cn("retro-panel overflow-hidden", open && "border-[#252D3D]")}>
      <button
        onClick={() => hasGames && setOpen(!open)}
        aria-expanded={hasGames ? open : undefined}
        aria-label={`${match.team_a_name ?? "TBD"} vs ${match.team_b_name ?? "TBD"}`}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          hasGames ? "hover:bg-[#1A2235] cursor-pointer" : "cursor-default",
        )}
      >
        {/* Team A */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar name={match.team_a_name ?? "TBD"} src={match.team_a_logo ?? undefined} size="sm" />
          <span className={cn(
            "font-display font-bold text-sm uppercase tracking-wider truncate",
            match.winner_id === match.team_a_id ? "text-[#E8E8E8]" : isCompleted ? "text-[#4A5568]" : "text-[#E8E8E8]",
          )}>
            {match.team_a_name ?? "TBD"}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 shrink-0 font-mono text-sm font-bold">
          <span className={match.winner_id === match.team_a_id ? "text-[#00D364]" : isCompleted ? "text-[#4A5568]" : "text-[#E8E8E8]"}>
            {match.team_a_score}
          </span>
          <span className="text-[#252D3D] text-xs">:</span>
          <span className={match.winner_id === match.team_b_id ? "text-[#00D364]" : isCompleted ? "text-[#4A5568]" : "text-[#E8E8E8]"}>
            {match.team_b_score}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className={cn(
            "font-display font-bold text-sm uppercase tracking-wider truncate text-right",
            match.winner_id === match.team_b_id ? "text-[#E8E8E8]" : isCompleted ? "text-[#4A5568]" : "text-[#E8E8E8]",
          )}>
            {match.team_b_name ?? "TBD"}
          </span>
          <Avatar name={match.team_b_name ?? "TBD"} src={match.team_b_logo ?? undefined} size="sm" />
        </div>

        {/* Right meta */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <RetroBadge variant={statusVariant[match.status]}>
            {statusLabel[match.status]}
          </RetroBadge>
          {hasGames && (
            <IconChevronDown
              size={14}
              className={cn("text-[#8896A4] transition-transform duration-200 shrink-0", open && "rotate-180")}
            />
          )}
        </div>
      </button>

      {/* Scheduled datetime */}
      {match.status === "scheduled" && match.scheduled_at && (
        <div className="flex items-center gap-1.5 px-4 pb-2 text-[10px] font-mono text-[#8896A4]">
          <IconCalendar size={10} className="text-[#8896A4]" />
          {formatDatetime(match.scheduled_at)}
        </div>
      )}

      {/* Games expanded */}
      <AnimatePresence initial={false}>
        {open && hasGames && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#252D3D]">
              {/* Game tabs */}
              {match.games.length > 1 && (
                <div className="flex border-b border-[#252D3D] bg-[#0A0E1A]">
                  {match.games.map((game, i) => (
                    <button
                      key={game.id}
                      onClick={() => setActiveGame(i)}
                      className={cn(
                        "px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors",
                        activeGame === i
                          ? "text-[#C89B3C] border-b border-[#C89B3C] -mb-px"
                          : "text-[#8896A4] hover:text-[#E8E8E8]",
                      )}
                    >
                      Game {game.game_number}
                    </button>
                  ))}
                </div>
              )}

              {/* Active game scoreboard */}
              <div className="p-4">
                {match.games[activeGame]?.player_stats.length > 0 ? (
                  <GameScoreboard game={match.games[activeGame]} teamAId={match.team_a_id} />
                ) : (
                  <p className="text-xs text-[#8896A4] text-center py-4">Stats indisponíveis para esta partida.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default MatchCard
