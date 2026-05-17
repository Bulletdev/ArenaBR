"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import Avatar from "@/components/ui/Avatar"
import Modal from "@/components/ui/Modal"
import { IconShield, IconTrophy, IconRoster } from "@/components/ui/NavIcons"
import {
  useTournamentMatches,
  useTournamentTeams,
  useApproveTeam,
  useRejectTeam,
  useGenerateBracket,
} from "@/hooks/useTournament"
import { useAdminResolve } from "@/hooks/useMatch"
import type { TournamentMatch, TournamentTeam } from "@/types"

// ─── Dispute resolve modal ────────────────────────────────────
function DisputeModal({
  match,
  tournamentId,
  onClose,
}: {
  match: TournamentMatch
  tournamentId: string
  onClose: () => void
}) {
  const resolve = useAdminResolve(tournamentId, match.id)

  const pick = (winnerId: string, winnerName: string | null) => {
    resolve.mutate(winnerId, {
      onSuccess: () => { toast.success(`Disputa resolvida — ${winnerName ?? "time"} vence`); onClose() },
      onError:   (err) => toast.error(err.message),
    })
  }

  return (
    <Modal open title="Resolver disputa" onClose={onClose} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Analise as evidências e escolha o vencedor.
        </p>
        <div className="space-y-2">
          {([
            { id: match.team_a_id, name: match.team_a_name },
            { id: match.team_b_id, name: match.team_b_name },
          ] as { id: string | null; name: string | null }[]).map(team =>
            team.id && (
              <button
                key={team.id}
                onClick={() => pick(team.id!, team.name)}
                disabled={resolve.isPending}
                className="w-full flex items-center gap-3 px-4 py-3 border border-border hover:border-success hover:bg-[rgba(22,163,74,0.06)] transition-all text-left disabled:opacity-50"
              >
                <Avatar name={team.name ?? "TBD"} size="sm" />
                <span className="font-display font-bold text-text uppercase tracking-wider text-sm">
                  {team.name ?? "TBD"}
                </span>
              </button>
            )
          )}
        </div>
        <div className="panel p-3 border-danger">
          <p className="text-xs text-muted">
            Esta ação é <span className="text-danger">irreversível</span>. Confirme após análise completa.
          </p>
        </div>
      </div>
    </Modal>
  )
}

// ─── Match row ────────────────────────────────────────────────
function AdminMatchRow({ match, tournamentId }: { match: TournamentMatch; tournamentId: string }) {
  const [disputeOpen, setDisputeOpen] = useState(false)

  const isDone     = match.status === "completed" || match.status === "walkover" || match.status === "confirmed"
  const isDisputed = match.status === "disputed"
  const hasBothTeams = !!match.team_a_id && !!match.team_b_id

  return (
    <>
      <RetroPanel padding={false} className={cn("overflow-hidden", isDone && !isDisputed && "opacity-60")}>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest w-28 shrink-0">
            {match.round_label}
          </span>
          <div className="flex-1 flex items-center gap-2 min-w-0 font-mono text-xs">
            <span className={cn("font-display font-bold text-sm uppercase truncate",
              match.winner_id === match.team_a_id && isDone ? "text-text" : isDone ? "text-muted" : "text-text"
            )}>
              {match.team_a_name ?? "TBD"}
            </span>
            <span className="text-muted shrink-0">
              <span className={match.winner_id === match.team_a_id ? "text-success font-bold" : ""}>{match.team_a_score}</span>
              {" — "}
              <span className={match.winner_id === match.team_b_id ? "text-success font-bold" : ""}>{match.team_b_score}</span>
            </span>
            <span className={cn("font-display font-bold text-sm uppercase truncate",
              match.winner_id === match.team_b_id && isDone ? "text-text" : isDone ? "text-muted" : "text-text"
            )}>
              {match.team_b_name ?? "TBD"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isDisputed && (
              <RetroBadge variant="danger">Disputa</RetroBadge>
            )}
            {isDisputed && hasBothTeams && (
              <Button
                variant="ghost"
                className="text-xs border-[var(--color-crimson)] text-crimson hover:bg-[rgba(185,28,28,0.08)] py-1 px-2"
                onClick={() => setDisputeOpen(true)}
              >
                Resolver
              </Button>
            )}
            {isDone && !isDisputed && (
              <RetroBadge variant="success">{match.status === "walkover" ? "W.O." : "Encerrada"}</RetroBadge>
            )}
            {!isDone && !isDisputed && (
              <span className="font-mono text-[10px] text-muted">{match.status}</span>
            )}
          </div>
        </div>
      </RetroPanel>
      {disputeOpen && (
        <DisputeModal match={match} tournamentId={tournamentId} onClose={() => setDisputeOpen(false)} />
      )}
    </>
  )
}

// ─── Team enrollment row ──────────────────────────────────────
function TeamEnrollRow({ team, tournamentId }: { team: TournamentTeam; tournamentId: string }) {
  const [open, setOpen] = useState(false)
  const approve = useApproveTeam(tournamentId)
  const reject  = useRejectTeam(tournamentId)

  const statusVariant: Record<string, "gold" | "success" | "danger" | "muted"> = {
    pending:      "gold",
    approved:     "success",
    rejected:     "danger",
    withdrawn:    "muted",
    disqualified: "danger",
  }

  const starters    = team.roster?.filter(r => r.position === "starter")    ?? []
  const substitutes = team.roster?.filter(r => r.position === "substitute") ?? []

  return (
    <RetroPanel padding={false}>
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar name={team.team_name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-text uppercase tracking-wider text-sm">
            {team.team_name}
            <span className="font-mono text-[10px] text-muted ml-2 normal-case">[{team.team_tag}]</span>
          </p>
          {team.roster && team.roster.length > 0 && (
            <button
              onClick={() => setOpen(o => !o)}
              className="font-mono text-[10px] text-muted hover:text-[var(--color-text)] transition-colors"
            >
              {open ? "▲" : "▼"} {team.roster.length} jogadores
            </button>
          )}
          {team.roster?.length === 0 && team.status === "pending" && (
            <p className="font-mono text-[10px] text-muted">Elenco será travado na aprovação</p>
          )}
        </div>
        <RetroBadge variant={statusVariant[team.status] ?? "muted"}>
          {team.status}
        </RetroBadge>
        {team.status === "pending" && (
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              className="text-xs border-success text-success hover:bg-[rgba(22,163,74,0.08)] py-1 px-3"
              disabled={approve.isPending}
              onClick={() => approve.mutate(team.id, {
                onSuccess: () => toast.success(`${team.team_name} aprovado — elenco travado`),
                onError:   (err) => toast.error(err.message),
              })}
            >
              Aprovar
            </Button>
            <Button
              variant="ghost"
              className="text-xs border-danger text-danger hover:bg-[rgba(220,38,38,0.08)] py-1 px-3"
              disabled={reject.isPending}
              onClick={() => reject.mutate(team.id, {
                onSuccess: () => toast.success(`${team.team_name} rejeitado`),
                onError:   (err) => toast.error(err.message),
              })}
            >
              Rejeitar
            </Button>
          </div>
        )}
      </div>

      {open && team.roster && team.roster.length > 0 && (
        <div className="border-t border-border px-4 py-3 space-y-1">
          {starters.length > 0 && (
            <>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1.5">Titulares</p>
              {starters.map(p => (
                <div key={p.player_id} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-muted uppercase text-[10px] w-16 shrink-0">{p.role}</span>
                  <span className="text-text">{p.summoner_name}</span>
                </div>
              ))}
            </>
          )}
          {substitutes.length > 0 && (
            <>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted mt-2 mb-1.5">Reservas</p>
              {substitutes.map(p => (
                <div key={p.player_id} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-muted uppercase text-[10px] w-16 shrink-0">{p.role}</span>
                  <span className="text-text">{p.summoner_name}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </RetroPanel>
  )
}

// ─── Panel ────────────────────────────────────────────────────
export default function AdminMatchPanel({ tournamentId }: { tournamentId: string }) {
  const { data: matches = [], isLoading: loadingMatches } = useTournamentMatches(tournamentId)
  const { data: teams   = [], isLoading: loadingTeams   } = useTournamentTeams(tournamentId)
  const generateBracket = useGenerateBracket(tournamentId)

  const disputed  = matches.filter(m => m.status === "disputed")
  const pending   = matches.filter(m =>
    m.status === "scheduled" || m.status === "checkin_open" ||
    m.status === "in_progress" || m.status === "awaiting_report" || m.status === "awaiting_confirm"
  )
  const completed = matches.filter(m =>
    m.status === "completed" || m.status === "walkover" || m.status === "confirmed"
  )

  const pendingTeams  = teams.filter(t => t.status === "pending")
  const approvedTeams = teams.filter(t => t.status === "approved")
  const bracketExists = matches.length > 0

  if (loadingMatches || loadingTeams) {
    return <div className="py-8 text-center font-mono text-xs text-muted animate-pulse">Carregando…</div>
  }

  return (
    <div className="space-y-8">
      {/* Header notice */}
      <div className="flex items-start gap-3 px-4 py-3 border border-gold/30 bg-[rgba(200,155,60,0.05)]">
        <IconShield size={14} className="text-gold mt-0.5 shrink-0" />
        <div className="text-xs text-muted leading-relaxed">
          <strong className="text-text">Painel de árbitro</strong> — somente staff autorizado da ArenaBR.
        </div>
      </div>

      {/* ── Inscrições de times ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <IconRoster size={13} className="text-muted" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            Inscrições de times
          </span>
          {pendingTeams.length > 0 && (
            <RetroBadge variant="gold">{pendingTeams.length} pendente{pendingTeams.length > 1 ? "s" : ""}</RetroBadge>
          )}
          <div className="sep" />
        </div>

        {teams.length === 0 ? (
          <p className="text-sm text-muted font-mono text-center py-4">Nenhum time inscrito ainda.</p>
        ) : (
          <div className="space-y-2">
            {/* Pending primeiro */}
            {pendingTeams.map(t => <TeamEnrollRow key={t.id} team={t} tournamentId={tournamentId} />)}
            {/* Aprovados e rejeitados */}
            {teams.filter(t => t.status !== "pending").map(t => (
              <TeamEnrollRow key={t.id} team={t} tournamentId={tournamentId} />
            ))}
          </div>
        )}
      </section>

      {/* ── Gerar bracket ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <IconTrophy size={13} className="text-gold" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Bracket</span>
          <div className="sep" />
        </div>

        {bracketExists ? (
          <div className="flex items-center gap-3 px-4 py-3 border border-success/20 bg-[rgba(22,163,74,0.04)]">
            <span className="text-success">✓</span>
            <span className="text-sm font-mono text-success">Bracket gerado — {matches.length} partidas</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted">
              Times aprovados: <strong className="text-text">{approvedTeams.length}</strong>.
              Gere o bracket quando todas as vagas estiverem preenchidas.
            </p>
            <Button
              className="w-full"
              disabled={approvedTeams.length < 2 || generateBracket.isPending}
              onClick={() => generateBracket.mutate(undefined, {
                onSuccess: () => toast.success("Bracket gerado com sucesso!"),
                onError:   (err) => toast.error(err.message),
              })}
            >
              <IconTrophy size={14} />
              {generateBracket.isPending ? "Gerando…" : `Gerar bracket (${approvedTeams.length} times)`}
            </Button>
          </div>
        )}
      </section>

      {/* ── Disputas pendentes ── */}
      {disputed.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-danger">Disputas pendentes</span>
            <RetroBadge variant="danger">{disputed.length}</RetroBadge>
            <div className="sep" />
          </div>
          <div className="space-y-2">
            {disputed.map(m => <AdminMatchRow key={m.id} match={m} tournamentId={tournamentId} />)}
          </div>
        </section>
      )}

      {/* ── Partidas pendentes ── */}
      {bracketExists && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Em andamento / Aguardando
            </span>
            <span className="font-mono text-[10px] text-muted">({pending.length})</span>
            <div className="sep" />
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-muted font-mono text-center py-4">Nenhuma partida pendente.</p>
          ) : (
            <div className="space-y-2">
              {pending.map(m => <AdminMatchRow key={m.id} match={m} tournamentId={tournamentId} />)}
            </div>
          )}
        </section>
      )}

      {/* ── Encerradas ── */}
      {completed.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Encerradas</span>
            <span className="font-mono text-[10px] text-muted">({completed.length})</span>
            <div className="sep" />
          </div>
          <div className="space-y-2">
            {completed.map(m => <AdminMatchRow key={m.id} match={m} tournamentId={tournamentId} />)}
          </div>
        </section>
      )}
    </div>
  )
}
