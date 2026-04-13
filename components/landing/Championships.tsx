"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconTrophy, IconRoster, IconDollarSign, IconCalendar } from "@/components/ui/NavIcons"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import { useTournaments } from "@/hooks/useTournament"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { TournamentStatus } from "@/types"

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

export default function Championships() {
  const { data: tournaments = [], isLoading } = useTournaments()

  // Landing shows only open + in_progress, max 4
  const visible = tournaments
    .filter(t => t.status === "registration_open" || t.status === "in_progress")
    .slice(0, 4)

  return (
    <section id="campeonatos" className="py-20 px-6 bg-[#0F1823]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="retro-badge border-[#0596AA] text-[#0596AA] mb-4 inline-flex">Competições</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#E8E8E8] uppercase tracking-wider">
            Campeonatos disponíveis
          </h2>
          <p className="mt-3 text-[#8896A4] max-w-xl mx-auto">
            Confira os campeonatos ativos e próximos. Inscrições abertas agora.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map(i => (
              <div key={i} className="retro-panel-gold hud-corners h-64 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-mono text-sm text-[#4A5568]">Nenhum torneio aberto no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visible.map((tournament, i) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="retro-panel-gold hud-corners hover-lift hover-lift-gold p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <IconTrophy size={16} className="text-[#C89B3C] shrink-0" />
                    <h3 className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm leading-tight">
                      {tournament.name}
                    </h3>
                  </div>
                  <RetroBadge variant={STATUS_VARIANT[tournament.status]}>
                    {STATUS_LABEL[tournament.status]}
                  </RetroBadge>
                </div>

                <hr className="retro-sep" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <IconDollarSign size={12} className="text-[#00D364]" />
                    <div>
                      <div className="text-[#00D364] font-mono font-bold">
                        {formatCurrency(tournament.prize_pool_cents / 100)}
                      </div>
                      <div className="text-[#8896A4]">Premiação</div>
                    </div>
                  </div>
                  {tournament.entry_fee_cents > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <IconDollarSign size={12} className="text-[#C89B3C]" />
                      <div>
                        <div className="text-[#C89B3C] font-mono font-bold">
                          {formatCurrency(tournament.entry_fee_cents / 100)}
                        </div>
                        <div className="text-[#8896A4]">Inscrição</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <IconRoster size={12} className="text-[#0596AA]" />
                    <div>
                      <div className="text-[#E8E8E8] font-mono font-bold">
                        {tournament.enrolled_teams_count}/{tournament.max_teams}
                      </div>
                      <div className="text-[#8896A4]">Times inscritos</div>
                    </div>
                  </div>
                  {tournament.scheduled_start_at && (
                    <div className="flex items-center gap-2 text-xs">
                      <IconCalendar size={12} className="text-[#8896A4]" />
                      <div>
                        <div className="text-[#E8E8E8] font-mono font-bold">
                          {formatDate(tournament.scheduled_start_at)}
                        </div>
                        <div className="text-[#8896A4]">Início</div>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/register" className="block">
                  <Button
                    variant={tournament.status === "registration_open" ? "primary" : "ghost"}
                    className="w-full text-sm py-2.5"
                    disabled={!tournament.slots_available && tournament.status === "registration_open"}
                  >
                    {tournament.status === "registration_open"
                      ? tournament.slots_available ? "Inscrever-se" : "Vagas esgotadas"
                      : "Ver detalhes"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
