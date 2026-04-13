"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Avatar from "@/components/ui/Avatar"
import { IconChevronDown, IconShield, IconTrophy } from "@/components/ui/NavIcons"
import CheckinButton from "@/components/championship/CheckinButton"
import CaptainReportPanel from "@/components/championship/CaptainReportPanel"
import { useMatch } from "@/hooks/useMatch"
import { useTournamentChannel } from "@/hooks/useTournamentChannel"
import { useAuthStore } from "@/stores/auth"
import type { TournamentMatchStatus } from "@/types"

// ─── Status display ───────────────────────────────────────────
const STATUS_LABEL: Record<TournamentMatchStatus, string> = {
  scheduled:        "Agendada",
  checkin_open:     "Check-in",
  in_progress:      "Em andamento",
  awaiting_report:  "Aguardando resultado",
  awaiting_confirm: "Confirmando resultado",
  disputed:         "Disputa",
  confirmed:        "Confirmada",
  completed:        "Encerrada",
  walkover:         "W.O.",
}

const STATUS_VARIANT: Record<TournamentMatchStatus, "muted" | "success" | "teal" | "gold"> = {
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

// ─── Section heading ──────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">{children}</span>
      <div className="flex-1 h-px bg-[#252D3D]" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────
export default function MatchDetailPage() {
  const { id: tournamentId, matchId } = useParams<{ id: string; matchId: string }>()
  const { data: match, isLoading, error } = useMatch(tournamentId ?? "", matchId ?? "")
  useTournamentChannel(tournamentId ?? "")
  const { user, player } = useAuthStore()

  const isAuthenticated = !!user || !!player
  const isAdmin         = !!(user?.permissions?.is_admin_or_owner || user?.permissions?.can_manage_users)

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="font-mono text-xs text-[#4A5568] uppercase tracking-widest animate-pulse">
          Carregando partida…
        </p>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="p-6">
        <p className="text-[#8896A4]">Partida não encontrada.</p>
      </div>
    )
  }

  const isCompleted = match.status === "completed" || match.status === "walkover" || match.status === "confirmed"
  const showCheckin = isAuthenticated && match.status === "checkin_open" && match.my_team_checked_in !== null
  const showReport  = isAuthenticated && (
    match.status === "awaiting_report" ||
    match.status === "awaiting_confirm"
  ) && match.my_team_checked_in !== null

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#4A5568]">
        <Link href="/dashboard/campeonatos" className="hover:text-[#8896A4] transition-colors">
          Campeonatos
        </Link>
        <span>›</span>
        <Link href={`/dashboard/campeonatos/${tournamentId}`} className="hover:text-[#8896A4] transition-colors">
          Torneio
        </Link>
        <span>›</span>
        <span className="text-[#8896A4]">{match.round_label}</span>
      </nav>

      {/* Match header */}
      <RetroPanel>
        <div className="space-y-4">
          {/* Round + status */}
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#4A5568]">
              {match.round_label}
            </span>
            <RetroBadge variant={STATUS_VARIANT[match.status]}>
              {STATUS_LABEL[match.status]}
            </RetroBadge>
          </div>

          {/* Teams + score */}
          <div className="flex items-center gap-4">
            {/* Team A */}
            <div className={cn(
              "flex flex-col items-center gap-2 flex-1",
              match.winner_id && match.winner_id !== match.team_a_id && "opacity-40",
            )}>
              <Avatar name={match.team_a_name ?? "TBD"} size="lg" />
              <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm text-center">
                {match.team_a_name ?? "TBD"}
              </span>
              {match.winner_id === match.team_a_id && (
                <span className="font-mono text-[10px] text-[#C89B3C] uppercase tracking-widest">vencedor</span>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="flex items-center gap-3 font-mono text-3xl font-bold">
                <span className={match.winner_id === match.team_a_id ? "text-[#00D364]" : isCompleted ? "text-[#4A5568]" : "text-[#E8E8E8]"}>
                  {match.team_a_score}
                </span>
                <span className="text-[#252D3D] text-lg">:</span>
                <span className={match.winner_id === match.team_b_id ? "text-[#00D364]" : isCompleted ? "text-[#4A5568]" : "text-[#E8E8E8]"}>
                  {match.team_b_score}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#4A5568] uppercase">BO{match.bo_format}</span>
            </div>

            {/* Team B */}
            <div className={cn(
              "flex flex-col items-center gap-2 flex-1",
              match.winner_id && match.winner_id !== match.team_b_id && "opacity-40",
            )}>
              <Avatar name={match.team_b_name ?? "TBD"} size="lg" />
              <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm text-center">
                {match.team_b_name ?? "TBD"}
              </span>
              {match.winner_id === match.team_b_id && (
                <span className="font-mono text-[10px] text-[#C89B3C] uppercase tracking-widest">vencedor</span>
              )}
            </div>
          </div>
        </div>
      </RetroPanel>

      {/* Check-in section */}
      {showCheckin && (
        <section className="space-y-3">
          <SectionHeading>Check-in</SectionHeading>
          <RetroPanel>
            <CheckinButton
              tournamentId={tournamentId ?? ""}
              matchId={matchId ?? ""}
              deadline={match.checkin_deadline_at}
              checkedIn={match.my_team_checked_in ?? false}
              opponentCheckedIn={match.opponent_checked_in ?? false}
            />
          </RetroPanel>
        </section>
      )}

      {/* Report section */}
      {showReport && (
        <section className="space-y-3">
          <SectionHeading>Resultado</SectionHeading>
          <RetroPanel>
            <CaptainReportPanel
              tournamentId={tournamentId ?? ""}
              matchId={matchId ?? ""}
              teamAName={match.team_a_name}
              teamBName={match.team_b_name}
              boFormat={match.bo_format}
              alreadyReported={match.my_team_has_reported ?? false}
            />
          </RetroPanel>
        </section>
      )}

      {/* Disputed */}
      {match.status === "disputed" && (
        <section className="space-y-3">
          <SectionHeading>Resultado em disputa</SectionHeading>
          <RetroPanel>
            <div className="flex items-start gap-3">
              <IconShield size={14} className="text-[#C89B3C] mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm text-[#E8E8E8]">Resultados divergentes reportados</p>
                <p className="text-xs text-[#8896A4] leading-relaxed">
                  Os dois times enviaram placares diferentes. Um árbitro da ArenaBR irá analisar as evidências e resolver a disputa.
                </p>
              </div>
            </div>
          </RetroPanel>
        </section>
      )}

      {/* Walkover notice */}
      {match.status === "walkover" && (
        <section className="space-y-3">
          <SectionHeading>W.O.</SectionHeading>
          <RetroPanel>
            <div className="flex items-start gap-3">
              <span className="text-[#FF4444] text-lg leading-none mt-0.5">!</span>
              <div className="space-y-1">
                <p className="text-sm text-[#E8E8E8]">
                  {match.winner_id === match.team_a_id
                    ? `${match.team_a_name} venceu por W.O.`
                    : match.winner_id === match.team_b_id
                    ? `${match.team_b_name} venceu por W.O.`
                    : "Partida encerrada por W.O."}
                </p>
                {match.wo_deadline_at && (
                  <p className="text-xs text-[#8896A4]">
                    Time ausente no check-in até o prazo.
                  </p>
                )}
              </div>
            </div>
          </RetroPanel>
        </section>
      )}

      {/* Not participant — info only hint */}
      {!isAuthenticated && !isCompleted && (
        <p className="text-center text-xs font-mono text-[#4A5568]">
          Faça login como capitão para participar desta partida.
        </p>
      )}
    </div>
  )
}
