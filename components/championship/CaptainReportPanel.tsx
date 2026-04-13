"use client"

import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import RetroPanel from "@/components/ui/RetroPanel"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Avatar from "@/components/ui/Avatar"
import { IconTrophy, IconShield } from "@/components/ui/NavIcons"
import { useSubmitReport, useMatchReport } from "@/hooks/useMatch"

// ─── Score validator ──────────────────────────────────────────
function isValidScore(a: number, b: number, bo: number): boolean {
  const wins = Math.ceil(bo / 2)
  return (a === wins && b < wins) || (b === wins && a < wins)
}

// ─── Component ────────────────────────────────────────────────
export default function CaptainReportPanel({
  tournamentId,
  matchId,
  teamAName,
  teamBName,
  boFormat,
  alreadyReported,
}: {
  tournamentId: string
  matchId: string
  teamAName: string | null
  teamBName: string | null
  boFormat: number
  alreadyReported: boolean | null
}) {
  const [scoreA, setScoreA]   = useState(0)
  const [scoreB, setScoreB]   = useState(0)
  const [evidence, setEvidence] = useState("")
  const { mutate: submit, isPending } = useSubmitReport(tournamentId, matchId)
  const { data: reportData } = useMatchReport(tournamentId, matchId)

  const wins = Math.ceil(boFormat / 2)
  const valid = isValidScore(scoreA, scoreB, boFormat) && evidence.trim().length > 0
  const winnerName = scoreA > scoreB ? teamAName : scoreB > scoreA ? teamBName : null

  const handleSubmit = () => {
    if (!valid) return
    submit(
      { team_a_score: scoreA, team_b_score: scoreB, evidence_url: evidence.trim() },
      {
        onSuccess: () => toast.success("Resultado enviado!"),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  // Already submitted — show status
  if (alreadyReported || reportData?.my_report) {
    const opponentReported = reportData?.opponent_reported

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 border border-[#00D364]/30 bg-[rgba(0,211,100,0.05)]">
          <span className="text-[#00D364] text-lg leading-none">✓</span>
          <div>
            <p className="text-sm font-mono text-[#00D364]">Resultado enviado</p>
            {reportData?.my_report && (
              <p className="text-xs text-[#8896A4] mt-0.5">
                {reportData.my_report.team_a_score} — {reportData.my_report.team_b_score}
              </p>
            )}
          </div>
        </div>

        {opponentReported ? (
          <div className="flex items-center gap-3 px-4 py-3 border border-[#0596AA]/30 bg-[rgba(5,150,170,0.05)]">
            <span className="text-[#0596AA] text-lg leading-none">✓</span>
            <p className="text-sm font-mono text-[#0596AA]">
              Adversário também reportou — aguardando confirmação automática
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 border border-[#252D3D]">
            <span className="text-[#4A5568] text-xs font-mono animate-pulse">○</span>
            <p className="text-sm font-mono text-[#8896A4]">
              Aguardando o adversário confirmar o resultado…
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Context */}
      <div className="flex items-start gap-3 px-4 py-3 border border-[#252D3D] bg-[#0A0E1A]">
        <IconShield size={13} className="text-[#8896A4] mt-0.5 shrink-0" />
        <p className="text-xs text-[#8896A4] leading-relaxed">
          Envie o resultado do <span className="text-[#E8E8E8]">BO{boFormat}</span> com o print da tela de pós-jogo como evidência.
          O adversário receberá o resultado para confirmar. Em caso de divergência, um árbitro resolverá.
        </p>
      </div>

      {/* Score inputs */}
      <div className="flex items-center justify-center gap-4">
        {/* Team A */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <Avatar name={teamAName ?? "TBD"} size="md" />
          <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm text-center truncate max-w-full">
            {teamAName ?? "TBD"}
          </span>
          <input
            type="number"
            min={0}
            max={wins}
            value={scoreA}
            onChange={e => setScoreA(Math.max(0, Math.min(wins, parseInt(e.target.value) || 0)))}
            className="w-16 text-center font-mono text-2xl font-bold bg-[#0A0E1A] border border-[#252D3D] text-[#E8E8E8] focus:border-[#C89B3C] outline-none py-2"
          />
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="font-mono text-xs text-[#4A5568] uppercase tracking-widest">
            BO{boFormat}
          </span>
          <span className="font-mono text-[#252D3D] text-lg">×</span>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <Avatar name={teamBName ?? "TBD"} size="md" />
          <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm text-center truncate max-w-full">
            {teamBName ?? "TBD"}
          </span>
          <input
            type="number"
            min={0}
            max={wins}
            value={scoreB}
            onChange={e => setScoreB(Math.max(0, Math.min(wins, parseInt(e.target.value) || 0)))}
            className="w-16 text-center font-mono text-2xl font-bold bg-[#0A0E1A] border border-[#252D3D] text-[#E8E8E8] focus:border-[#C89B3C] outline-none py-2"
          />
        </div>
      </div>

      {/* Winner preview */}
      <div className={cn(
        "py-2 text-center text-xs font-mono transition-all",
        valid ? "text-[#00D364]" : "text-[#4A5568]",
      )}>
        {valid
          ? <><IconTrophy size={11} className="inline mr-1" />Vencedor: <strong>{winnerName}</strong></>
          : `Placar inválido — resultado deve ter ${wins} vitórias`
        }
      </div>

      {/* Evidence URL */}
      <div className="space-y-1.5">
        <label className="font-mono text-[10px] uppercase tracking-widest text-[#8896A4]">
          URL da evidência (print / Imgur / drive)
        </label>
        <Input
          type="url"
          placeholder="https://i.imgur.com/..."
          value={evidence}
          onChange={e => setEvidence(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        disabled={!valid || isPending}
        onClick={handleSubmit}
      >
        <IconTrophy size={14} />
        {isPending ? "Enviando…" : "Enviar resultado"}
      </Button>
    </div>
  )
}
