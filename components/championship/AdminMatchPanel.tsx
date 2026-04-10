"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import Avatar from "@/components/ui/Avatar"
import Modal from "@/components/ui/Modal"
import { IconTrophy, IconShield, IconChevronDown } from "@/components/ui/NavIcons"
import { useChampionshipStore } from "@/stores/championship"
import type { Match } from "@/types"

// ─── Score validator ──────────────────────────────────────────
// BO3: resultado válido é 2-0 ou 2-1
function isValidScore(a: number, b: number): boolean {
  return (a === 2 && (b === 0 || b === 1)) || (b === 2 && (a === 0 || a === 1))
}

// ─── Result Form ──────────────────────────────────────────────
function MatchResultForm({
  match,
  onDone,
}: {
  match: Match
  onDone: () => void
}) {
  const { submitResult } = useChampionshipStore()
  const [scoreA, setScoreA] = useState(match.team_a_score)
  const [scoreB, setScoreB] = useState(match.team_b_score)

  const valid = isValidScore(scoreA, scoreB)
  const winnerName = scoreA > scoreB ? match.team_a_name : scoreB > scoreA ? match.team_b_name : null

  const handleSubmit = () => {
    if (!valid) return
    submitResult({ matchId: match.id, teamAScore: scoreA, teamBScore: scoreB })
    toast.success(`Resultado registrado — ${winnerName} vence`)
    onDone()
  }

  return (
    <div className="space-y-4">
      {/* Score inputs */}
      <div className="flex items-center justify-center gap-4">
        {/* Team A */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <Avatar name={match.team_a_name ?? "TBD"} src={match.team_a_logo ?? undefined} size="md" />
          <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm text-center">
            {match.team_a_name ?? "TBD"}
          </span>
          <input
            type="number"
            min={0}
            max={2}
            value={scoreA}
            onChange={e => setScoreA(Math.max(0, Math.min(2, parseInt(e.target.value) || 0)))}
            className="w-16 text-center font-mono text-2xl font-bold bg-[#0A0E1A] border border-[#252D3D] text-[#E8E8E8] focus:border-[#C89B3C] outline-none py-2"
          />
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="font-mono text-xs text-[#4A5568] uppercase tracking-widest">BO3</span>
          <span className="font-mono text-[#252D3D] text-lg">×</span>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <Avatar name={match.team_b_name ?? "TBD"} src={match.team_b_logo ?? undefined} size="md" />
          <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm text-center">
            {match.team_b_name ?? "TBD"}
          </span>
          <input
            type="number"
            min={0}
            max={2}
            value={scoreB}
            onChange={e => setScoreB(Math.max(0, Math.min(2, parseInt(e.target.value) || 0)))}
            className="w-16 text-center font-mono text-2xl font-bold bg-[#0A0E1A] border border-[#252D3D] text-[#E8E8E8] focus:border-[#C89B3C] outline-none py-2"
          />
        </div>
      </div>

      {/* Winner preview */}
      <div className={cn(
        "py-2 text-center text-xs font-mono transition-all",
        valid ? "text-[#00D364]" : "text-[#4A5568]"
      )}>
        {valid
          ? <>Vencedor: <strong>{winnerName}</strong></>
          : "Placar inválido — resultado deve ser 2-0 ou 2-1"
        }
      </div>

      <Button
        className="w-full"
        disabled={!valid}
        onClick={handleSubmit}
      >
        <IconTrophy size={14} />
        Confirmar resultado
      </Button>
    </div>
  )
}

// ─── Walkover Modal ───────────────────────────────────────────
function WalkoverModal({
  match,
  onClose,
}: {
  match: Match
  onClose: () => void
}) {
  const { declareWalkover } = useChampionshipStore()

  const declare = (winnerIsTeamA: boolean) => {
    const winnerId = winnerIsTeamA ? match.team_a_id : match.team_b_id
    if (!winnerId) return
    declareWalkover({ matchId: match.id, winnerId, winnerIsTeamA })
    const winnerName = winnerIsTeamA ? match.team_a_name : match.team_b_name
    toast.success(`W.O. declarado — ${winnerName} avança`)
    onClose()
  }

  return (
    <Modal open title="Declarar W.O." onClose={onClose} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-[#8896A4]">
          Qual time compareceu e receberá a vitória por W.O.?
        </p>

        <div className="space-y-2">
          <button
            onClick={() => declare(true)}
            className="w-full flex items-center gap-3 px-4 py-3 border border-[#252D3D] hover:border-[#00D364] hover:bg-[rgba(0,211,100,0.06)] transition-all text-left"
          >
            <Avatar name={match.team_a_name ?? "TBD"} src={match.team_a_logo ?? undefined} size="sm" />
            <div>
              <p className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm">
                {match.team_a_name ?? "TBD"}
              </p>
              <p className="text-xs text-[#8896A4]">compareceu → vence 2-0</p>
            </div>
          </button>

          <button
            onClick={() => declare(false)}
            className="w-full flex items-center gap-3 px-4 py-3 border border-[#252D3D] hover:border-[#00D364] hover:bg-[rgba(0,211,100,0.06)] transition-all text-left"
          >
            <Avatar name={match.team_b_name ?? "TBD"} src={match.team_b_logo ?? undefined} size="sm" />
            <div>
              <p className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm">
                {match.team_b_name ?? "TBD"}
              </p>
              <p className="text-xs text-[#8896A4]">compareceu → vence 2-0</p>
            </div>
          </button>
        </div>

        <div className="retro-panel p-3 border-[#FF4444]">
          <p className="text-xs text-[#8896A4] leading-relaxed">
            O time ausente fica com <span className="text-[#FF4444]">derrota 0-2</span> e poderá ser
            punido conforme o regulamento.
          </p>
        </div>
      </div>
    </Modal>
  )
}

// ─── Match Row ────────────────────────────────────────────────
function AdminMatchRow({ match }: { match: Match }) {
  const { resetMatch } = useChampionshipStore()
  const [expanded, setExpanded] = useState(false)
  const [woOpen, setWoOpen] = useState(false)

  const isDone   = match.status === "completed" || match.status === "walkover"
  const hasBothTeams = !!match.team_a_id && !!match.team_b_id

  const statusColor = isDone
    ? "text-[#00D364]"
    : match.status === "live"
    ? "text-[#0596AA]"
    : "text-[#4A5568]"

  return (
    <>
      <RetroPanel padding={false} className={cn("overflow-hidden", isDone && "opacity-70")}>
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Round */}
          <span className="font-mono text-[10px] text-[#4A5568] uppercase tracking-widest w-20 shrink-0">
            {match.round}
          </span>

          {/* Teams + score */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className={cn(
              "font-display font-bold text-sm uppercase tracking-wider truncate",
              match.winner_id === match.team_a_id && isDone ? "text-[#E8E8E8]" : isDone ? "text-[#4A5568]" : "text-[#E8E8E8]"
            )}>
              {match.team_a_name ?? "TBD"}
            </span>

            <span className="font-mono text-xs shrink-0 text-[#8896A4]">
              <span className={match.winner_id === match.team_a_id ? "text-[#00D364] font-bold" : ""}>
                {match.team_a_score}
              </span>
              {" — "}
              <span className={match.winner_id === match.team_b_id ? "text-[#00D364] font-bold" : ""}>
                {match.team_b_score}
              </span>
            </span>

            <span className={cn(
              "font-display font-bold text-sm uppercase tracking-wider truncate",
              match.winner_id === match.team_b_id && isDone ? "text-[#E8E8E8]" : isDone ? "text-[#4A5568]" : "text-[#E8E8E8]"
            )}>
              {match.team_b_name ?? "TBD"}
            </span>
          </div>

          {/* Status + actions */}
          <div className="flex items-center gap-2 shrink-0">
            {match.status === "walkover" && (
              <span className="font-mono text-[10px] text-[#FF4444] uppercase">W.O.</span>
            )}
            {isDone && (
              <button
                onClick={() => resetMatch(match.id)}
                className="text-[10px] font-mono text-[#4A5568] hover:text-[#8896A4] transition-colors"
                title="Desfazer resultado"
              >
                desfazer
              </button>
            )}
            {!isDone && hasBothTeams && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs font-mono text-[#C89B3C] hover:text-[#E8E8E8] transition-colors"
              >
                Registrar
                <IconChevronDown
                  size={13}
                  className={cn("transition-transform duration-200", expanded && "rotate-180")}
                />
              </button>
            )}
            {!hasBothTeams && (
              <span className="font-mono text-[10px] text-[#4A5568]">aguardando times</span>
            )}
          </div>
        </div>

        {/* Expanded form */}
        {expanded && !isDone && (
          <div className="border-t border-[#252D3D] p-5 space-y-4">
            <MatchResultForm match={match} onDone={() => setExpanded(false)} />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#252D3D]" />
              <span className="text-[10px] font-mono text-[#4A5568] uppercase tracking-widest">ou</span>
              <div className="flex-1 h-px bg-[#252D3D]" />
            </div>

            <Button
              variant="ghost"
              className="w-full text-xs border-[#FF4444] text-[#FF4444] hover:bg-[rgba(255,68,68,0.08)]"
              onClick={() => setWoOpen(true)}
            >
              <IconShield size={13} />
              Declarar W.O.
            </Button>
          </div>
        )}
      </RetroPanel>

      {woOpen && (
        <WalkoverModal match={match} onClose={() => setWoOpen(false)} />
      )}
    </>
  )
}

// ─── Panel ────────────────────────────────────────────────────
export default function AdminMatchPanel({ championshipId }: { championshipId: number }) {
  const matches = useChampionshipStore(s => s.matches.filter(m => m.championship_id === championshipId))

  const pending   = matches.filter(m => m.status === "scheduled" || m.status === "live")
  const completed = matches.filter(m => m.status === "completed" || m.status === "walkover")

  return (
    <div className="space-y-8">
      {/* Aviso de contexto */}
      <div className="flex items-start gap-3 px-4 py-3 border border-[#C89B3C]/30 bg-[rgba(200,155,60,0.05)]">
        <IconShield size={14} className="text-[#C89B3C] mt-0.5 shrink-0" />
        <div className="text-xs text-[#8896A4] leading-relaxed space-y-1">
          <p>
            <strong className="text-[#E8E8E8]">Painel de árbitro</strong> — somente staff autorizado da ArenaBR.
          </p>
          <p>
            Confirme o resultado após receber o print do capitão no Discord com o comando{" "}
            <span className="font-mono text-[#C89B3C] bg-[#1A2235] px-1">WINNER + TAG</span>.
            O bracket e a classificação atualizam automaticamente.
          </p>
        </div>
      </div>

      {/* Partidas pendentes */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            Aguardando resultado
          </span>
          <span className="font-mono text-[10px] text-[#4A5568]">({pending.length})</span>
          <div className="flex-1 h-px bg-[#252D3D]" />
        </div>

        {pending.length === 0 ? (
          <p className="text-sm text-[#4A5568] font-mono text-center py-4">
            Todas as partidas têm resultado registrado.
          </p>
        ) : (
          <div className="space-y-2">
            {pending.map(m => <AdminMatchRow key={m.id} match={m} />)}
          </div>
        )}
      </section>

      {/* Partidas encerradas */}
      {completed.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
              Encerradas
            </span>
            <span className="font-mono text-[10px] text-[#4A5568]">({completed.length})</span>
            <div className="flex-1 h-px bg-[#252D3D]" />
          </div>
          <div className="space-y-2">
            {completed.map(m => <AdminMatchRow key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  )
}
