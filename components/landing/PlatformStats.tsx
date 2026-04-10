"use client"

import { motion } from "framer-motion"
import { Users, Trophy, Swords, DollarSign } from "lucide-react"

const STATS = [
  { icon: Users,       value: "40+",    label: "Jogadores cadastrados", color: "#0596AA" },
  { icon: Trophy,      value: "1",      label: "Campeonato ativo",      color: "#C89B3C" },
  { icon: Swords,      value: "12",     label: "Partidas realizadas",   color: "#00D364" },
  { icon: DollarSign,  value: "R$500",  label: "Em premiação",          color: "#C89B3C" },
]

export default function PlatformStats() {
  return (
    <section className="stat-strip py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#252D3D]">
          {STATS.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#0F1823] flex flex-col items-center justify-center gap-3 py-8 px-4 text-center"
            >
              <Icon size={20} style={{ color }} />
              <div>
                <div className="font-mono text-2xl font-bold" style={{ color }}>
                  {value}
                </div>
                <div className="text-[11px] text-[#8896A4] uppercase tracking-wider mt-1">
                  {label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
