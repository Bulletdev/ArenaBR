"use client"

import { Mail, Check, X, Trophy } from "lucide-react"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import Avatar from "@/components/ui/Avatar"
import { useInvitesStore } from "@/stores/invites"
import { formatDate } from "@/lib/utils"
import type { Invite } from "@/types"

export default function ConvitesPage() {
  const { invites, respond } = useInvitesStore()

  const pending = invites.filter((i) => i.status === "pending")
  const resolved = invites.filter((i) => i.status !== "pending")

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="retro-label">Notificações</p>
        <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
          Convites
        </h1>
      </div>

      <hr className="retro-sep" />

      {/* Pendentes */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-[#C89B3C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            Pendentes
          </span>
          {pending.length > 0 && (
            <RetroBadge variant="gold">{pending.length}</RetroBadge>
          )}
        </div>

        {pending.length === 0 ? (
          <RetroPanel>
            <p className="text-[#8896A4] text-sm text-center py-6">
              Nenhum convite pendente.
            </p>
          </RetroPanel>
        ) : (
          pending.map((invite) => (
            <InviteCard key={invite.id} invite={invite} onRespond={respond} />
          ))
        )}
      </section>

      {/* Respondidos */}
      {resolved.length > 0 && (
        <section className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            Respondidos
          </span>
          {resolved.map((invite) => (
            <InviteCard key={invite.id} invite={invite} onRespond={respond} />
          ))}
        </section>
      )}
    </div>
  )
}

function InviteCard({
  invite,
  onRespond,
}: {
  invite: Invite
  onRespond: (id: number, action: "accepted" | "refused") => void
}) {
  return (
    <RetroPanel
      variant={invite.status === "accepted" ? "teal" : "default"}
      className="flex items-start gap-4 flex-wrap"
    >
      <Avatar name={invite.team_name} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider">
            {invite.team_name}
          </span>
          <RetroBadge
            variant={
              invite.status === "pending" ? "gold"
              : invite.status === "accepted" ? "success"
              : "danger"
            }
          >
            {invite.status === "pending" ? "Pendente"
             : invite.status === "accepted" ? "Aceito"
             : "Recusado"}
          </RetroBadge>
        </div>

        <div className="text-xs text-[#8896A4] mt-1 space-y-0.5">
          <div className="flex items-center gap-1">
            <Trophy size={11} className="text-[#C89B3C]" />
            <span>{invite.championship_name}</span>
          </div>
          <div>
            Capitão:{" "}
            <span className="font-mono text-[#E8E8E8]">{invite.captain_summoner_name}</span>
          </div>
          <div>{formatDate(invite.created_at)}</div>
        </div>
      </div>

      {invite.status === "pending" && (
        <div className="flex gap-2 mt-1">
          <Button
            variant="secondary"
            className="text-xs py-1.5 px-3 text-[#00D364] border-[#00D364] hover:bg-[rgba(0,211,100,0.08)]"
            onClick={() => onRespond(invite.id, "accepted")}
          >
            <Check size={12} />
            Aceitar
          </Button>
          <Button
            variant="danger"
            className="text-xs py-1.5 px-3"
            onClick={() => onRespond(invite.id, "refused")}
          >
            <X size={12} />
            Recusar
          </Button>
        </div>
      )}
    </RetroPanel>
  )
}
