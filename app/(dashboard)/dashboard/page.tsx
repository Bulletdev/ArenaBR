"use client"

import { memo, useState } from "react"
import { CheckCircle2, FlaskConical, Mail, Sword, UserCircle2, Building2, AlertTriangle, MessageSquare, ClipboardList } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import Link from "next/link"
import RetroPanel from "@/components/ui/RetroPanel"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import Avatar from "@/components/ui/Avatar"
import Modal from "@/components/ui/Modal"
import {
  IconTrophy, IconRoster, IconCalendar, IconDollarSign,
  IconChevronDown, IconBarChart,
} from "@/components/ui/NavIcons"
import { playerApi } from "@/lib/api"
import { mockChampionships, mockStandings, mockPlayers, mockPixPayment } from "@/lib/mock"
import { formatDate, formatCurrency, getEloColor, getRoleLabel } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { usePendingInvites } from "@/stores/invites"
import type { Player } from "@/types"

// ─── Position icon ─────────────────────────────────────────────
function PositionIcon({ pos }: { pos: number }) {
  const color = pos === 1 ? "#00D364" : pos === 2 ? "#8896A4" : "#FF4444"
  const symbol = pos === 1 ? "▲" : pos === 2 ? "—" : "▼"
  return <span className="font-mono text-[10px]" style={{ color }}>{symbol}</span>
}

// ─── Main Page ─────────────────────────────────────────────────
export default function DashboardPage() {
  const [enrollOpen, setEnrollOpen] = useState(false)
  const { user, player } = useAuthStore()
  const pendingInvites = usePendingInvites()
  const championship = mockChampionships[0]
  const standings = mockStandings

  const isPlayer = !!player && !user

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="retro-label">Área de competição</p>
          <h1 className="font-display text-3xl font-bold text-[#E8E8E8] uppercase tracking-wider">
            Campeonatos
          </h1>
        </div>
        {!isPlayer && (
          <Button onClick={() => setEnrollOpen(true)}>
            <IconTrophy size={14} />
            Inscrever meu time
          </Button>
        )}
      </div>

      <hr className="retro-sep" />

      {/* Player context — só aparece quando jogador está logado */}
      {isPlayer && (
        <PlayerContextCard pendingInvites={pendingInvites} />
      )}

      {/* Mock data notice */}
      <div className="flex items-center gap-2 px-3 py-2 border border-[#252D3D] bg-[#0F1823] text-xs text-[#8896A4] font-mono">
        <FlaskConical size={12} className="text-[#C89B3C] shrink-0" />
        <span>
          Módulo de campeonatos em desenvolvimento — dados abaixo são de demonstração.
          Elencos e free agents são carregados da API real.
        </span>
      </div>

      {/* Championship cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {mockChampionships.map(champ => (
          <RetroPanel key={champ.id} variant="gold" corners className="flex flex-col gap-4">
            {/* Título + badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <IconTrophy size={16} className="text-[#C89B3C] shrink-0" />
                <h2 className="font-display text-lg font-bold text-[#E8E8E8] uppercase tracking-wider truncate">
                  {champ.name}
                </h2>
              </div>
              <RetroBadge variant={champ.status === "ongoing" ? "teal" : champ.status === "open" ? "success" : "muted"} className="shrink-0">
                {champ.status === "ongoing" ? "Em andamento" : champ.status === "open" ? "Aberto" : "Encerrado"}
              </RetroBadge>
            </div>

            {/* Descrição — altura fixa para alinhar o conteúdo abaixo */}
            <p className="text-[#8896A4] text-xs leading-relaxed line-clamp-2">{champ.description}</p>

            {/* Meta — empurra o botão para baixo com flex-1 */}
            <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-[#00D364]">
                <IconDollarSign size={11} className="shrink-0" />
                <span className="font-bold">{formatCurrency(champ.prize_pool)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8896A4]">
                <IconRoster size={11} className="shrink-0" />
                <span>{champ.enrolled_teams}/{champ.max_teams} times</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8896A4]">
                <IconCalendar size={11} className="shrink-0" />
                <span>{formatDate(champ.start_date)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#C89B3C]">
                <IconTrophy size={11} className="shrink-0" />
                <span>{champ.format}</span>
              </div>
            </div>

            {/* Botão sempre na base do card */}
            <Link href={`/dashboard/campeonatos/${champ.id}`}>
              <Button variant="secondary" className="w-full text-xs py-2">
                <IconBarChart size={13} />
                Ver partidas & stats
              </Button>
            </Link>
          </RetroPanel>
        ))}
      </div>

      {/* Standings */}
      <RetroPanel padding={false}>
        <div className="px-5 py-3 border-b border-[#252D3D] flex items-center gap-2">
          <IconRoster size={14} className="text-[#C89B3C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            Classificação — {championship.name}
          </span>
        </div>

        <table className="retro-table">
          <thead>
            <tr>
              <th className="w-10 text-center">#</th>
              <th>Time</th>
              <th className="text-center">V</th>
              <th className="text-center">D</th>
              <th className="text-center">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr key={row.team_id}>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <PositionIcon pos={row.position} />
                    <span className="font-mono text-xs text-[#8896A4]">{row.position}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.team_name} size="sm" />
                    <span className="font-medium text-[#E8E8E8]">{row.team_name}</span>
                  </div>
                </td>
                <td className="text-center font-mono text-[#00D364]">{row.wins}</td>
                <td className="text-center font-mono text-[#FF4444]">{row.losses}</td>
                <td className="text-center font-mono text-[#8896A4]">
                  {row.match_diff > 0 ? `+${row.match_diff}` : row.match_diff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </RetroPanel>

      {/* Protocolo do dia de jogo */}
      <GameDayProtocol />

      {enrollOpen && <EnrollModal onClose={() => setEnrollOpen(false)} isPlayer={isPlayer} />}
    </div>
  )
}

// ─── Player Context Card ───────────────────────────────────────
const PlayerContextCard = memo(function PlayerContextCard({ pendingInvites }: { pendingInvites: number }) {
  const { player } = useAuthStore()
  if (!player) return null

  return (
    <div className="space-y-3">
      {/* Pending invites banner */}
      {pendingInvites > 0 && (
        <Link href="/dashboard/convites">
          <div className="flex items-center gap-3 px-4 py-3 border border-[#0596AA] bg-[rgba(5,150,170,0.06)] hover:bg-[rgba(5,150,170,0.12)] transition-colors cursor-pointer">
            <Mail size={13} className="text-[#0596AA] shrink-0" />
            <span className="text-sm text-[#E8E8E8] flex-1">
              Você tem{" "}
              <strong className="text-[#0596AA]">
                {pendingInvites} convite{pendingInvites > 1 ? "s" : ""} pendente{pendingInvites > 1 ? "s" : ""}
              </strong>{" "}
              de time.
            </span>
            <RetroBadge variant="teal">{pendingInvites}</RetroBadge>
          </div>
        </Link>
      )}

      {/* Player profile card */}
      <RetroPanel variant="teal" className="flex items-center gap-4 flex-wrap">
        <Avatar name={player.summoner_name} src={player.avatar_url ?? undefined} size="md" />

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider">
              {player.summoner_name}
            </span>
            {player.is_free_agent ? (
              <RetroBadge variant="teal">Free Agent</RetroBadge>
            ) : (
              <RetroBadge variant="gold">
                <Building2 size={9} className="inline mr-0.5" />
                {player.organization_name}
              </RetroBadge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-[#8896A4] font-mono flex-wrap">
            {player.role && (
              <span className="flex items-center gap-1">
                <Sword size={11} />
                {getRoleLabel(player.role)}
              </span>
            )}
            {player.current_rank && (
              <span style={{ color: getEloColor(player.solo_queue_tier ?? undefined) }}>
                {player.current_rank}
              </span>
            )}
          </div>
        </div>

        <Link href="/dashboard/perfil">
          <Button variant="secondary" className="text-xs py-1.5 px-3">
            <UserCircle2 size={12} />
            Meu Perfil
          </Button>
        </Link>
      </RetroPanel>
    </div>
  )
})

// ─── Game Day Protocol ─────────────────────────────────────────
const PROTOCOL_STEPS = [
  {
    time: "18h40",
    stage: "Preparação",
    action: "Garantir os 5 jogadores online no Discord com Nick + TAG da equipe",
    command: null,
  },
  {
    time: "18h50",
    stage: "Check-in",
    action: "Enviar o comando no chat de capitães confirmando a equipe pronta e aguardar a liberação da staff",
    command: "CHECKIN + TAG",
  },
  {
    time: "19h00",
    stage: "Criação do Lobby",
    action: "Criar o lobby, convidar os jogadores e enviar o print do lobby",
    command: "LOBBY + TAG",
  },
  {
    time: "19h05",
    stage: "W.O.",
    action: "Início da contagem de W.O. — prazo de 10 minutos para ambas as equipes entrarem no lobby",
    command: null,
    alert: true,
  },
  {
    time: "19h15",
    stage: "Draft / Picks",
    action: "Início do Draft. Cada equipe tem direito a UM remake em caso de erro técnico, bug do client ou erro de pick.",
    command: null,
  },
  {
    time: "19h20",
    stage: "Partida",
    action: "Início da partida. Cada equipe tem direito a até 5 minutos de pausa. O uso do /all deve ser evitado. Atitudes antiesportivas não são toleradas e podem resultar em punição.",
    command: null,
  },
  {
    time: "Após o término",
    stage: "Report de resultado",
    action: "Enviar print da tela final com o placar",
    command: "WINNER + TAG",
  },
]

function GameDayProtocol() {
  const [open, setOpen] = useState(false)

  return (
    <RetroPanel padding={false}>
      {/* Header — sempre visível */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Protocolo do dia de jogo"
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#1A2235] transition-colors"
      >
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-[#C89B3C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#8896A4]">
            Protocolo do dia de jogo
          </span>
        </div>
        <IconChevronDown
          size={14}
          className={`text-[#8896A4] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-[#252D3D]">
          {/* Tabela principal */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252D3D] bg-[#0A0E1A]">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#8896A4] whitespace-nowrap">
                    Horário
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#8896A4] whitespace-nowrap">
                    Etapa
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#8896A4]">
                    Ação do Capitão
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#8896A4] whitespace-nowrap">
                    Comando
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D3D]">
                {PROTOCOL_STEPS.map((step) => (
                  <tr
                    key={step.stage}
                    className={`hover:bg-[#1A2235] transition-colors ${step.alert ? "bg-[rgba(255,68,68,0.04)]" : ""}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#C89B3C] whitespace-nowrap align-top">
                      {step.alert && (
                        <AlertTriangle size={11} className="inline mr-1 text-[#FF4444]" />
                      )}
                      {step.time}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap align-top">
                      <span className={`font-display text-xs font-bold uppercase tracking-wider ${
                        step.alert ? "text-[#FF4444]" : "text-[#E8E8E8]"
                      }`}>
                        {step.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8896A4] leading-relaxed align-top max-w-sm">
                      {step.action}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {step.command && (
                        <span className="font-mono text-xs bg-[#1A2235] border border-[#C89B3C] text-[#C89B3C] px-2 py-1 whitespace-nowrap">
                          {step.command}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Suporte */}
          <div className="px-5 py-4 border-t border-[#252D3D] flex items-start gap-3 bg-[#0F1823]">
            <MessageSquare size={13} className="text-[#0596AA] mt-0.5 shrink-0" />
            <div className="text-xs text-[#8896A4] leading-relaxed">
              Em último caso, acesse o canal{" "}
              <span className="font-mono text-[#E8E8E8]">#suporte-campeonato</span>{" "}
              e envie{" "}
              <span className="font-mono bg-[#1A2235] border border-[#0596AA] text-[#0596AA] px-1.5 py-0.5">
                HELP + TAG
              </span>{" "}
              da sua equipe. A staff irá até a sala do seu time.
            </div>
          </div>
        </div>
      )}
    </RetroPanel>
  )
}

// ─── Enroll Modal ──────────────────────────────────────────────
type EnrollStep = "choose" | "roster" | "payment" | "done"

function EnrollModal({ onClose, isPlayer }: { onClose: () => void; isPlayer: boolean }) {
  const [step, setStep] = useState<EnrollStep>("choose")
  const [selected, setSelected] = useState<number[]>([])
  const [copied, setCopied] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["my-players"],
    queryFn: () => playerApi.list({ status: "active" }),
    retry: false,
  })

  const players: Player[] = Array.isArray(data?.data?.players) ? data.data.players : mockPlayers

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const copyPix = () => {
    navigator.clipboard.writeText(mockPixPayment.qr_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stepIndex = step === "choose" ? 0 : step === "roster" ? 1 : step === "payment" ? 2 : 3
  const stepLabels = ["Tipo", "Elenco", "Pagamento"]

  return (
    <Modal open title="Inscrever meu time" onClose={onClose} size="md">
      {/* Steps indicator */}
      {step !== "done" && (
        <div className="flex items-center gap-2 mb-5">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-6 h-6 flex items-center justify-center font-mono text-xs border ${
                stepIndex === i
                  ? "border-[#C89B3C] text-[#C89B3C]"
                  : stepIndex > i
                  ? "border-[#00D364] text-[#00D364]"
                  : "border-[#252D3D] text-[#8896A4]"
              }`}>
                {stepIndex > i ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${stepIndex === i ? "text-[#E8E8E8]" : "text-[#8896A4]"}`}>
                {label}
              </span>
              {i < 2 && <div className="w-6 h-px bg-[#252D3D]" />}
            </div>
          ))}
        </div>
      )}

      {/* Passo 1 — Tipo */}
      {step === "choose" && (
        <div className="space-y-4">
          <p className="text-[#8896A4] text-sm">
            Como deseja participar do{" "}
            <strong className="text-[#E8E8E8]">ArenaBR Season 1</strong>?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isPlayer}
              onClick={() => { if (!isPlayer) setStep("roster") }}
              className={
                !isPlayer
                  ? "retro-panel border-[#252D3D] p-4 text-left hover:border-[#C89B3C] hover:bg-[#1A2235] transition-all"
                  : "retro-panel border-[#252D3D] p-4 text-left opacity-40 cursor-not-allowed"
              }
            >
              <IconTrophy size={20} className={!isPlayer ? "text-[#C89B3C] mb-2" : "text-[#4A5568] mb-2"} />
              <p className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm">
                Inscrever meu time
              </p>
              <p className="text-xs text-[#8896A4] mt-1">
                {!isPlayer ? "Confirme seu elenco e pague a inscrição." : "Disponível apenas para coaches e gestores."}
              </p>
            </button>
            <button
              disabled={!isPlayer}
              onClick={() => {
                if (!isPlayer) return
                toast.success("Inscrito como Free Agent! Aguarde convites de capitães.")
                onClose()
              }}
              className={
                isPlayer
                  ? "retro-panel border-[#252D3D] p-4 text-left hover:border-[#0596AA] hover:bg-[#1A2235] transition-all"
                  : "retro-panel border-[#252D3D] p-4 text-left opacity-40 cursor-not-allowed"
              }
            >
              <IconRoster size={20} className={isPlayer ? "text-[#0596AA] mb-2" : "text-[#4A5568] mb-2"} />
              <p className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm">
                Free Agent
              </p>
              <p className="text-xs text-[#8896A4] mt-1">
                {isPlayer ? "Sem time? Entre no pool e receba convites." : "Disponível apenas para jogadores cadastrados."}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Passo 2 — Confirmar elenco */}
      {step === "roster" && (
        <div className="space-y-4">
          <button
            onClick={() => setStep("choose")}
            className="text-xs text-[#8896A4] hover:text-[#E8E8E8] transition-colors"
          >
            ← Voltar
          </button>
          <p className="text-xs text-[#8896A4]">
            Selecione os jogadores do elenco que participarão (mínimo 5).
          </p>

          {isLoading ? (
            <div className="py-6 text-center text-[#8896A4] text-sm">Carregando elenco...</div>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {players.map((player) => {
                const checked = selected.includes(player.id)
                return (
                  <button
                    key={player.id}
                    onClick={() => toggle(player.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 border transition-all text-left ${
                      checked
                        ? "border-[#C89B3C] bg-[rgba(200,155,60,0.08)]"
                        : "border-[#252D3D] hover:border-[#8896A4] hover:bg-[#1A2235]"
                    }`}
                  >
                    <Avatar name={player.summoner_name} src={player.avatar_url ?? undefined} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-[#E8E8E8] truncate">
                        {player.summoner_name}
                      </p>
                      <p className="text-xs text-[#8896A4]">{getRoleLabel(player.role)}</p>
                    </div>
                    <span
                      className="font-mono text-xs shrink-0"
                      style={{ color: getEloColor(player.solo_queue_tier) }}
                    >
                      {player.current_rank ?? "Unranked"}
                    </span>
                    {checked && (
                      <CheckCircle2 size={14} className="text-[#C89B3C] shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          <Button
            className="w-full"
            disabled={selected.length < 5}
            onClick={() => setStep("payment")}
          >
            Confirmar elenco ({selected.length}/5 mín.)
          </Button>
        </div>
      )}

      {/* Passo 3 — Pagamento */}
      {step === "payment" && (
        <div className="space-y-4">
          <button
            onClick={() => setStep("roster")}
            className="text-xs text-[#8896A4] hover:text-[#E8E8E8] transition-colors"
          >
            ← Voltar
          </button>

          <div className="retro-panel-gold hud-corners p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8896A4]">
                Inscrição
              </span>
              <span className="font-mono text-[#C89B3C] text-lg">R$ 100,00</span>
            </div>
            <hr className="retro-sep" />
            <p className="text-xs text-[#8896A4]">Pagamento único via Pix. Sem cartão.</p>
          </div>

          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-36 h-36 bg-[#1A2235] border border-[#C89B3C] flex items-center justify-center">
              <span className="font-mono text-[10px] text-[#8896A4] text-center px-2">
                QR Code Pix
              </span>
            </div>
            <Button variant="secondary" className="text-xs py-1.5 px-3" onClick={copyPix}>
              {copied && <CheckCircle2 size={12} className="text-[#00D364]" />}
              {copied ? "Copiado!" : "Copiar código Pix"}
            </Button>
          </div>

          <div className="retro-panel p-3">
            <p className="text-xs text-[#8896A4]">
              Após o pagamento, confirmação em até{" "}
              <strong className="text-[#E8E8E8]">30 minutos</strong>.
            </p>
          </div>

          <Button className="w-full" onClick={() => setStep("done")}>
            Já paguei, aguardar confirmação
          </Button>
        </div>
      )}

      {/* Passo 4 — Confirmação */}
      {step === "done" && (
        <div className="space-y-4 text-center py-4">
          <CheckCircle2 size={40} className="text-[#00D364] mx-auto" />
          <h3 className="font-display text-lg font-bold text-[#E8E8E8] uppercase tracking-wider">
            Inscrição enviada!
          </h3>
          <p className="text-sm text-[#8896A4]">
            Seu pagamento está sendo verificado. Você aparecerá na tabela de times assim que confirmado.
          </p>
          <Button className="w-full" onClick={onClose}>
            Fechar
          </Button>
        </div>
      )}
    </Modal>
  )
}
