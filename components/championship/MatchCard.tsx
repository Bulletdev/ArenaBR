"use client"

import { memo } from "react"
import Link from "next/link"
import { cn, formatDatetime } from "@/lib/utils"
import RetroBadge from "@/components/ui/RetroBadge"
import Avatar from "@/components/ui/Avatar"
import { IconCalendar } from "@/components/ui/NavIcons"
import type { TournamentMatch } from "@/types"

// ─── Status display ───────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  scheduled:        "Agendada",
  checkin_open:     "Check-in",
  in_progress:      "Ao vivo",
  awaiting_report:  "Aguard. resultado",
  awaiting_confirm: "Confirmando",
  disputed:         "Disputa",
  confirmed:        "Confirmada",
  completed:        "Encerrada",
  walkover:         "W.O.",
}

const STATUS_VARIANT: Record<string, "muted" | "success" | "teal" | "gold"> = {
  scheduled:        "muted",
  checkin_open:     "teal",
  in_progress:      "teal",
  awaiting_report:  "gold",
  awaiting_confirm: "gold",
  disputed:         "gold",
  confirmed:        "success",
  completed:        "success",
  walkover:         "muted",
}

// ─── Match Card ───────────────────────────────────────────────
const MatchCard = memo(function MatchCard({
  match,
  tournamentId,
}: {
  match: TournamentMatch
  tournamentId?: string
}) {
  const isCompleted = match.status === "completed" || match.status === "walkover" || match.status === "confirmed"
  const hasDeadline = match.checkin_deadline_at && match.status === "checkin_open"

  const inner = (
    <div className={cn("retro-panel overflow-hidden", tournamentId && "hover:border-[#0596AA]/40 transition-colors")}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Team A */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar name={match.team_a_name ?? "TBD"} size="sm" />
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
          <Avatar name={match.team_b_name ?? "TBD"} size="sm" />
        </div>

        {/* Right meta */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <RetroBadge variant={STATUS_VARIANT[match.status] ?? "muted"}>
            {STATUS_LABEL[match.status] ?? match.status}
          </RetroBadge>
          {tournamentId && (
            <span className="text-[#4A5568] text-xs font-mono">›</span>
          )}
        </div>
      </div>

      {/* Checkin deadline */}
      {hasDeadline && (
        <div className="flex items-center gap-1.5 px-4 pb-2 text-[10px] font-mono text-[#0596AA]">
          <IconCalendar size={10} />
          Check-in até {formatDatetime(match.checkin_deadline_at!)}
        </div>
      )}

      {/* BO format */}
      <div className="px-4 pb-2">
        <span className="font-mono text-[10px] text-[#4A5568]">BO{match.bo_format}</span>
      </div>
    </div>
  )

  if (tournamentId) {
    return (
      <Link href={`/dashboard/campeonatos/${tournamentId}/partidas/${match.id}`}>
        {inner}
      </Link>
    )
  }

  return inner
})

export default MatchCard
