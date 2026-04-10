"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconTrophy, IconRoster, IconDollarSign, IconCalendar } from "@/components/ui/NavIcons"
import RetroBadge from "@/components/ui/RetroBadge"
import Button from "@/components/ui/Button"
import { mockChampionships } from "@/lib/mock"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { ChampionshipStatus } from "@/types"

const statusLabel: Record<ChampionshipStatus, string> = {
  open:     "Inscrições abertas",
  ongoing:  "Em andamento",
  finished: "Encerrado",
}

const statusVariant: Record<ChampionshipStatus, "success" | "teal" | "muted"> = {
  open:     "success",
  ongoing:  "teal",
  finished: "muted",
}

export default function Championships() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockChampionships.map((champ, i) => (
            <motion.div
              key={champ.id}
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
                    {champ.name}
                  </h3>
                </div>
                <RetroBadge variant={statusVariant[champ.status]}>
                  {statusLabel[champ.status]}
                </RetroBadge>
              </div>

              <p className="text-xs text-[#8896A4] leading-relaxed">{champ.description}</p>

              <hr className="retro-sep" />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <IconDollarSign size={12} className="text-[#00D364]" />
                  <div>
                    <div className="text-[#00D364] font-mono font-bold">{formatCurrency(champ.prize_pool)}</div>
                    <div className="text-[#8896A4]">Premiação</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <IconDollarSign size={12} className="text-[#C89B3C]" />
                  <div>
                    <div className="text-[#C89B3C] font-mono font-bold">{formatCurrency(champ.entry_fee)}</div>
                    <div className="text-[#8896A4]">Inscrição</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <IconRoster size={12} className="text-[#0596AA]" />
                  <div>
                    <div className="text-[#E8E8E8] font-mono font-bold">{champ.enrolled_teams}/{champ.max_teams}</div>
                    <div className="text-[#8896A4]">Times inscritos</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <IconCalendar size={12} className="text-[#8896A4]" />
                  <div>
                    <div className="text-[#E8E8E8] font-mono font-bold">{formatDate(champ.start_date)}</div>
                    <div className="text-[#8896A4]">Início</div>
                  </div>
                </div>
              </div>

              <Link href="/register" className="block">
                <Button
                  variant={champ.status === "finished" ? "ghost" : "primary"}
                  className="w-full text-sm py-2.5"
                  disabled={champ.status === "finished"}
                >
                  {champ.status === "open" ? "Inscrever-se" : champ.status === "ongoing" ? "Ver detalhes" : "Encerrado"}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
