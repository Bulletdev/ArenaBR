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
  registration_open: "Inscricoes abertas",
  seeding:           "Seeding",
  in_progress:       "Em andamento",
  finished:          "Encerrado",
  cancelled:         "Cancelado",
}

const STATUS_VARIANT: Record<TournamentStatus, "success" | "crimson" | "muted" | "gold"> = {
  draft:             "muted",
  registration_open: "success",
  seeding:           "gold",
  in_progress:       "crimson",
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
    <section id="campeonatos" className="py-20 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="badge border-crimson text-crimson mb-4 inline-flex">Competicoes</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text uppercase tracking-wider">
            Campeonatos disponiveis
          </h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Confira os campeonatos ativos e proximos. Inscricoes abertas agora.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map(i => (
              <div key={i} className="panel-crimson bracket-corners h-64 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-mono text-sm text-muted">Nenhum torneio aberto no momento.</p>
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
                className="panel-crimson bracket-corners hover-lift p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <IconTrophy size={16} className="text-crimson shrink-0" />
                    <h3 className="font-display font-bold text-text uppercase tracking-wider text-sm leading-tight">
                      {tournament.name}
                    </h3>
                  </div>
                  <RetroBadge variant={STATUS_VARIANT[tournament.status]}>
                    {STATUS_LABEL[tournament.status]}
                  </RetroBadge>
                </div>

                <hr className="sep" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <IconDollarSign size={12} className="text-success" />
                    <div>
                      <div className="text-success font-mono font-bold">
                        {formatCurrency(tournament.prize_pool_cents / 100)}
                      </div>
                      <div className="text-muted">Premiacao</div>
                    </div>
                  </div>
                  {tournament.entry_fee_cents > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <IconDollarSign size={12} className="text-gold" />
                      <div>
                        <div className="text-gold font-mono font-bold">
                          {formatCurrency(tournament.entry_fee_cents / 100)}
                        </div>
                        <div className="text-muted">Inscricao</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <IconRoster size={12} className="text-crimson" />
                    <div>
                      <div className="text-text font-mono font-bold">
                        {tournament.enrolled_teams_count}/{tournament.max_teams}
                      </div>
                      <div className="text-muted">Times inscritos</div>
                    </div>
                  </div>
                  {tournament.scheduled_start_at && (
                    <div className="flex items-center gap-2 text-xs">
                      <IconCalendar size={12} className="text-muted" />
                      <div>
                        <div className="text-text font-mono font-bold">
                          {formatDate(tournament.scheduled_start_at)}
                        </div>
                        <div className="text-muted">Inicio</div>
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
