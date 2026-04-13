"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal"
import Avatar from "@/components/ui/Avatar"
import {
  IconTrophy, IconRoster, IconDollarSign, IconCalendar, IconBarChart,
} from "@/components/ui/NavIcons"
import { useTournaments, useTournamentTeams, useEnrollTeam, useCreateTournament } from "@/hooks/useTournament"
import { useAuthStore } from "@/stores/auth"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Tournament, TournamentStatus, TournamentGame, TournamentFormat } from "@/types"

// ─── Status config ────────────────────────────────────────────
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

const GAME_LABEL: Record<string, string> = {
  league_of_legends: "League of Legends",
  valorant:          "Valorant",
  cs2:               "CS2",
}

const FORMAT_LABEL: Record<string, string> = {
  double_elimination: "Dupla eliminação",
  single_elimination: "Eliminação simples",
  swiss:              "Suíço",
}

// ─── Descriptions ─────────────────────────────────────────────
type FormatOption = {
  value: TournamentFormat | "swiss"
  label: string
  desc:  string
  rec:   string
  available: boolean
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    value:     "double_elimination",
    label:     "Dupla eliminação",
    desc:      "Cada time pode perder uma partida e continuar. Quem perde na chave principal cai para a chave de repescagem. Só é eliminado ao perder pela segunda vez.",
    rec:       "Recomendado — mais justo, dá segunda chance a todos.",
    available: true,
  },
  {
    value:     "single_elimination",
    label:     "Eliminação simples",
    desc:      "Perdeu, saiu. Cada derrota elimina o time imediatamente. O bracket é direto e rápido.",
    rec:       "Bom para muitos times ou torneios curtos.",
    available: true,
  },
  {
    value:     "swiss",
    label:     "Suíço",
    desc:      "Todos jogam o mesmo número de rodadas sem eliminação. Os melhores colocados avançam ao final.",
    rec:       "Em breve.",
    available: false,
  },
]

const BO_INFO: Record<number, { label: string; desc: string }> = {
  1: { label: "BO1 — Melhor de 1",  desc: "Uma partida decide o resultado. Mais rápido, mas menos margem para recuperação." },
  3: { label: "BO3 — Melhor de 3",  desc: "Vence quem ganhar 2 partidas primeiro. Equilibra velocidade e consistência. Padrão em torneios amadores." },
  5: { label: "BO5 — Melhor de 5",  desc: "Vence quem ganhar 3 partidas primeiro. Mais longo e definitivo. Usual em finais e grandes eventos." },
}

// ─── Create Tournament Modal (admin) ─────────────────────────
function CreateTournamentModal({ onClose }: { onClose: () => void }) {
  const { mutate: create, isPending } = useCreateTournament()

  const [name,      setName]      = useState("")
  const [game,      setGame]      = useState<TournamentGame>("league_of_legends")
  const [format,    setFormat]    = useState<TournamentFormat>("double_elimination")
  const [maxTeams,  setMaxTeams]  = useState(16)
  const [boFormat,  setBoFormat]  = useState(1)
  const [prize,     setPrize]     = useState("")
  const [fee,       setFee]       = useState("")
  const [startDate, setStartDate] = useState("")

  const valid = name.trim().length >= 3 && maxTeams >= 2

  const handleCreate = () => {
    if (!valid) return
    create(
      {
        name:               name.trim(),
        game,
        format,
        status:             "registration_open" as const,
        max_teams:          maxTeams,
        bo_format:          boFormat,
        prize_pool_cents:   Math.round((parseFloat(prize) || 0) * 100),
        entry_fee_cents:    Math.round((parseFloat(fee)   || 0) * 100),
        scheduled_start_at: startDate || undefined,
      } as Partial<Tournament>,
      {
        onSuccess: () => { toast.success("Torneio criado!"); onClose() },
        onError:   (err) => toast.error(err.message),
      },
    )
  }

  const selectClass = "w-full bg-[#0A0E1A] border border-[#252D3D] text-[#E8E8E8] text-xs font-mono px-3 py-2 focus:border-[#C89B3C] outline-none"

  const fmtInfo = FORMAT_OPTIONS.find(f => f.value === format)!
  const boInfo  = BO_INFO[boFormat]

  return (
    <Modal open title="Criar torneio" onClose={onClose} size="md">
      <div className="space-y-4">
        <Input
          label="Nome do torneio"
          placeholder="ex: ArenaBR Season 1"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="retro-label">Jogo</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "league_of_legends", label: "League of Legends", available: true  },
              { value: "valorant",          label: "Valorant",          available: false },
              { value: "cs2",               label: "CS2",               available: false },
            ] as { value: TournamentGame; label: string; available: boolean }[]).map(g => (
              <button
                key={g.value}
                type="button"
                disabled={!g.available}
                onClick={() => g.available && setGame(g.value)}
                className={cn(
                  "relative px-3 py-2.5 border text-xs font-mono text-left transition-all",
                  !g.available
                    ? "border-[#1A2235] text-[#4A5568] cursor-not-allowed bg-[#0A0E1A]"
                    : game === g.value
                    ? "border-[#C89B3C] text-[#C89B3C] bg-[rgba(200,155,60,0.08)]"
                    : "border-[#252D3D] text-[#8896A4] hover:border-[#8896A4] hover:text-[#E8E8E8]",
                )}
              >
                {g.label}
                {!g.available && (
                  <span className="absolute top-1 right-1.5 font-mono text-[9px] text-[#4A5568] uppercase tracking-widest">
                    em breve
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Formato do bracket */}
        <div className="space-y-1.5">
          <label className="retro-label">Formato do bracket</label>
          <div className="grid grid-cols-3 gap-2">
            {FORMAT_OPTIONS.map(f => (
              <button
                key={f.value}
                type="button"
                disabled={!f.available}
                onClick={() => f.available && setFormat(f.value as TournamentFormat)}
                className={cn(
                  "relative px-3 py-2 border text-xs font-mono text-left transition-all",
                  !f.available
                    ? "border-[#1A2235] text-[#4A5568] cursor-not-allowed bg-[#0A0E1A]"
                    : format === f.value
                    ? "border-[#C89B3C] text-[#C89B3C] bg-[rgba(200,155,60,0.08)]"
                    : "border-[#252D3D] text-[#8896A4] hover:border-[#8896A4] hover:text-[#E8E8E8]",
                )}
              >
                {f.label}
                {!f.available && (
                  <span className="block text-[9px] text-[#4A5568] uppercase tracking-widest mt-0.5">
                    em breve
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Descrição dinâmica do formato */}
          <div className="px-3 py-2.5 border border-[#252D3D] bg-[#0A0E1A] space-y-1">
            <p className="text-xs text-[#E8E8E8] leading-relaxed">{fmtInfo.desc}</p>
            <p className="text-[10px] text-[#00D364] font-mono">{fmtInfo.rec}</p>
          </div>
        </div>

        {/* Formato de partida (BO) */}
        <div className="space-y-1.5">
          <label className="retro-label">Formato de partida</label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 3, 5].map(bo => (
              <button
                key={bo}
                type="button"
                onClick={() => setBoFormat(bo)}
                className={cn(
                  "px-3 py-2 border text-xs font-mono text-center transition-all",
                  boFormat === bo
                    ? "border-[#C89B3C] text-[#C89B3C] bg-[rgba(200,155,60,0.08)]"
                    : "border-[#252D3D] text-[#8896A4] hover:border-[#8896A4] hover:text-[#E8E8E8]",
                )}
              >
                BO{bo}
              </button>
            ))}
          </div>
          {/* Descrição dinâmica do BO */}
          <div className="px-3 py-2.5 border border-[#252D3D] bg-[#0A0E1A]">
            <p className="text-xs text-[#E8E8E8] leading-relaxed">{boInfo.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="retro-label">Máx. times</label>
            <select value={maxTeams} onChange={e => setMaxTeams(Number(e.target.value))} className={selectClass}>
              {[4, 8, 16, 32].map(n => <option key={n} value={n}>{n} times</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="retro-label">Início (opcional)</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className={selectClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Premiação (R$)"
            placeholder="ex: 1000.00"
            type="number"
            min={0}
            value={prize}
            onChange={e => setPrize(e.target.value)}
          />
          <Input
            label="Taxa de inscrição (R$)"
            placeholder="ex: 100.00"
            type="number"
            min={0}
            value={fee}
            onChange={e => setFee(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          disabled={!valid || isPending}
          onClick={handleCreate}
        >
          <IconTrophy size={14} />
          {isPending ? "Criando…" : "Criar torneio"}
        </Button>
      </div>
    </Modal>
  )
}

// ─── Enroll Modal ─────────────────────────────────────────────
function EnrollModal({
  tournament,
  onClose,
}: {
  tournament: Tournament
  onClose: () => void
}) {
  const { organization } = useAuthStore()
  const [teamName, setTeamName] = useState(organization?.name ?? "")
  const [teamTag,  setTeamTag]  = useState(organization?.team_tag ?? "")
  const [logoUrl,  setLogoUrl]  = useState(organization?.logo_url ?? "")
  const { mutate: enroll, isPending } = useEnrollTeam(tournament.id)

  const valid = teamName.trim().length >= 2 && teamTag.trim().length >= 2

  const handleSubmit = () => {
    if (!valid) return
    enroll(
      { team_name: teamName.trim(), team_tag: teamTag.trim().toUpperCase(), logo_url: logoUrl.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Inscrição enviada! Aguarde aprovação do staff.")
          onClose()
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  return (
    <Modal open title={`Inscrever no ${tournament.name}`} onClose={onClose} size="sm">
      <div className="space-y-4">
        <p className="text-xs text-[#8896A4]">
          Sua inscrição ficará com status <strong className="text-[#C89B3C]">Pendente</strong> até aprovação do staff.
          {tournament.entry_fee_cents > 0 && (
            <> O valor da inscrição ({formatCurrency(tournament.entry_fee_cents / 100)}) será cobrado via Discord após aprovação.</>
          )}
        </p>

        <Input
          label="Nome do time"
          placeholder="ex: Furious Gaming"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          maxLength={50}
        />

        <Input
          label="Tag (2–5 caracteres)"
          placeholder="ex: FG"
          value={teamTag}
          onChange={e => setTeamTag(e.target.value.toUpperCase())}
          maxLength={5}
        />

        <Input
          label="Logo URL (opcional)"
          placeholder="https://..."
          type="url"
          value={logoUrl}
          onChange={e => setLogoUrl(e.target.value)}
        />

        <Button
          className="w-full"
          disabled={!valid || isPending}
          onClick={handleSubmit}
        >
          <IconTrophy size={14} />
          {isPending ? "Enviando…" : "Enviar inscrição"}
        </Button>
      </div>
    </Modal>
  )
}

// ─── Tournament card ──────────────────────────────────────────
function TournamentCard({ tournament }: { tournament: Tournament }) {
  const [enrollOpen, setEnrollOpen] = useState(false)
  const { user, organization } = useAuthStore()

  const isAdmin  = !!(user?.permissions?.is_admin_or_owner || user?.permissions?.can_manage_users)
  const hasSlots = tournament.enrolled_teams_count < tournament.max_teams

  // Check if this org is already enrolled (only fetch when relevant)
  const { data: teams = [] } = useTournamentTeams(
    !isAdmin && !!user && !!organization ? tournament.id : ""
  )
  const myEnrollment = organization
    ? teams.find(t => t.organization_id === organization.id)
    : null

  const canEnroll = !isAdmin && !!user && !!organization &&
    tournament.status === "registration_open" && hasSlots && !myEnrollment

  return (
    <>
      <RetroPanel variant="gold" corners className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <IconTrophy size={16} className="text-[#C89B3C] shrink-0" />
            <h2 className="font-display text-lg font-bold text-[#E8E8E8] uppercase tracking-wider truncate">
              {tournament.name}
            </h2>
          </div>
          <RetroBadge variant={STATUS_VARIANT[tournament.status]} className="shrink-0">
            {STATUS_LABEL[tournament.status]}
          </RetroBadge>
        </div>

        {/* Game + format */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#4A5568] border border-[#252D3D] px-2 py-0.5">
            {GAME_LABEL[tournament.game] ?? tournament.game}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#4A5568] border border-[#252D3D] px-2 py-0.5">
            {FORMAT_LABEL[tournament.format] ?? tournament.format}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#4A5568] border border-[#252D3D] px-2 py-0.5">
            BO{tournament.bo_format}
          </span>
        </div>

        {/* Meta grid */}
        <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#00D364]">
            <IconDollarSign size={11} className="shrink-0" />
            <span className="font-bold">{formatCurrency(tournament.prize_pool_cents / 100)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8896A4]">
            <IconRoster size={11} className="shrink-0" />
            <span>
              {tournament.enrolled_teams_count}/{tournament.max_teams} times
              {!hasSlots && (
                <span className="text-[#FF4444] ml-1">· Lotado</span>
              )}
            </span>
          </div>
          {tournament.entry_fee_cents > 0 && (
            <div className="flex items-center gap-1.5 text-[#C89B3C]">
              <IconDollarSign size={11} className="shrink-0" />
              <span>{formatCurrency(tournament.entry_fee_cents / 100)} inscrição</span>
            </div>
          )}
          {tournament.scheduled_start_at && (
            <div className="flex items-center gap-1.5 text-[#8896A4]">
              <IconCalendar size={11} className="shrink-0" />
              <span>{formatDate(tournament.scheduled_start_at)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/dashboard/campeonatos/${tournament.id}`} className="flex-1">
            <Button variant="secondary" className="w-full text-xs py-2">
              <IconBarChart size={13} />
              Ver partidas
            </Button>
          </Link>
          {myEnrollment && (
            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#252D3D] font-mono text-xs">
              <span className={
                myEnrollment.status === "approved"  ? "text-[#00D364]" :
                myEnrollment.status === "rejected"  ? "text-[#FF4444]" :
                myEnrollment.status === "withdrawn" ? "text-[#4A5568]" : "text-[#C89B3C]"
              }>
                {myEnrollment.status === "approved"  ? "✓ Aprovado" :
                 myEnrollment.status === "rejected"  ? "✗ Rejeitado" :
                 myEnrollment.status === "withdrawn" ? "Retirado"   : "⏳ Aguardando"}
              </span>
            </div>
          )}
          {canEnroll && (
            <Button
              className="flex-1 text-xs py-2"
              onClick={() => setEnrollOpen(true)}
            >
              <IconTrophy size={13} />
              Inscrever time
            </Button>
          )}
        </div>
      </RetroPanel>

      {enrollOpen && (
        <EnrollModal tournament={tournament} onClose={() => setEnrollOpen(false)} />
      )}
    </>
  )
}

// ─── Filter tabs ──────────────────────────────────────────────
type Filter = "all" | TournamentStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",              label: "Todos"              },
  { key: "registration_open", label: "Inscrições abertas" },
  { key: "in_progress",      label: "Em andamento"       },
  { key: "finished",         label: "Encerrados"          },
]

// ─── Page ─────────────────────────────────────────────────────
export default function CampeonatosPage() {
  const { data: tournaments = [], isLoading } = useTournaments()
  const [filter, setFilter] = useState<Filter>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const { user } = useAuthStore()
  const isAdmin = !!(user?.permissions?.is_admin_or_owner || user?.permissions?.can_manage_users)

  const visible = filter === "all"
    ? tournaments
    : tournaments.filter(t => t.status === filter)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="retro-label">ArenaBR</p>
          <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
            Campeonatos
          </h1>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateOpen(true)}>
            <IconTrophy size={14} />
            Criar torneio
          </Button>
        )}
      </div>

      <hr className="retro-sep" />

      {/* Filter tabs */}
      <div role="tablist" className="flex gap-1 border-b border-[#252D3D] -mb-3 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0",
              filter === f.key
                ? "text-[#C89B3C] border-b-2 border-[#C89B3C] -mb-px"
                : "text-[#8896A4] hover:text-[#E8E8E8]",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="retro-panel h-56 animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-mono text-sm text-[#4A5568]">
            Nenhum torneio encontrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {visible.map(t => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}

      {createOpen && <CreateTournamentModal onClose={() => setCreateOpen(false)} />}
    </div>
  )
}
