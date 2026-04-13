"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Button from "@/components/ui/Button"
import { IconCalendar } from "@/components/ui/NavIcons"
import { useCheckin } from "@/hooks/useMatch"

// ─── Countdown hook ───────────────────────────────────────────
function useCountdown(deadline: string | null): number | null {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!deadline) return

    const tick = () => setRemaining(Math.max(0, new Date(deadline).getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  return remaining
}

function formatCountdown(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m ${(s % 60).toString().padStart(2, "0")}s`
  return `${s}s`
}

// ─── Component ────────────────────────────────────────────────
export default function CheckinButton({
  tournamentId,
  matchId,
  deadline,
  checkedIn,
  opponentCheckedIn,
}: {
  tournamentId: string
  matchId: string
  deadline: string | null
  checkedIn: boolean | null
  opponentCheckedIn: boolean | null
}) {
  const remaining = useCountdown(deadline)
  const { mutate: checkin, isPending } = useCheckin(tournamentId, matchId)

  const isExpired  = remaining !== null && remaining === 0
  const isWarning  = remaining !== null && remaining > 0 && remaining < 5 * 60 * 1000

  const handleCheckin = () => {
    checkin(undefined, {
      onSuccess: () => toast.success("Check-in realizado!"),
      onError: (err)  => toast.error(err.message),
    })
  }

  return (
    <div className="space-y-4">
      {/* Countdown */}
      {deadline && remaining !== null && !isExpired && (
        <div className={cn(
          "flex items-center gap-2 text-xs font-mono",
          isWarning ? "text-[#FF4444]" : "text-[#8896A4]",
        )}>
          <IconCalendar size={12} className="shrink-0" />
          <span>Check-in encerra em</span>
          <span className={cn("font-bold tabular-nums", isWarning && "animate-pulse")}>
            {formatCountdown(remaining)}
          </span>
          {isWarning && (
            <span className="text-[#FF4444] font-semibold">— W.O. iminente!</span>
          )}
        </div>
      )}

      {/* Status dos dois times */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 border text-xs font-mono",
          checkedIn
            ? "border-[#00D364]/30 bg-[rgba(0,211,100,0.05)] text-[#00D364]"
            : "border-[#252D3D] text-[#4A5568]",
        )}>
          <span className="text-base leading-none">{checkedIn ? "✓" : "○"}</span>
          <span>Meu time</span>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 border text-xs font-mono",
          opponentCheckedIn
            ? "border-[#00D364]/30 bg-[rgba(0,211,100,0.05)] text-[#00D364]"
            : "border-[#252D3D] text-[#4A5568]",
        )}>
          <span className="text-base leading-none">{opponentCheckedIn ? "✓" : "○"}</span>
          <span>Adversário</span>
        </div>
      </div>

      {/* Action */}
      {checkedIn ? (
        <div className="px-4 py-3 border border-[#00D364]/20 bg-[rgba(0,211,100,0.04)] text-center">
          <p className="text-sm font-mono text-[#00D364]">Check-in realizado</p>
          {!opponentCheckedIn && (
            <p className="text-xs text-[#8896A4] mt-1">Aguardando check-in do adversário…</p>
          )}
        </div>
      ) : isExpired ? (
        <div className="px-4 py-3 border border-[#FF4444]/20 bg-[rgba(255,68,68,0.05)] text-center">
          <p className="text-sm font-mono text-[#FF4444]">Tempo de check-in encerrado</p>
        </div>
      ) : (
        <Button
          onClick={handleCheckin}
          disabled={isPending || isExpired}
          className="w-full"
        >
          {isPending ? "Fazendo check-in…" : "Confirmar check-in"}
        </Button>
      )}
    </div>
  )
}
