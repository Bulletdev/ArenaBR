"use client"

import { motion } from "framer-motion"
import { IconUserPlus, IconTrophy, IconRoster, IconBarChart } from "@/components/ui/NavIcons"

const steps = [
  {
    num: "01",
    icon: IconUserPlus,
    title: "Crie sua conta",
    description: "Cadastre-se com e-mail, valide seu Riot ID via API oficial da Riot Games e informe seu Discord.",
  },
  {
    num: "02",
    icon: IconTrophy,
    title: "Escolha um campeonato",
    description: "Acesse os campeonatos disponíveis, veja premiação, formato e times inscritos antes de decidir.",
  },
  {
    num: "03",
    icon: IconRoster,
    title: "Entre solo ou em equipe",
    description: "Inscreva-se como Free Agent ou forme um time, convide jogadores e pague via Pix (R$100/equipe).",
  },
  {
    num: "04",
    icon: IconBarChart,
    title: "Jogue e acompanhe",
    description: "Acompanhe a classificação em tempo real, veja o elenco dos times e os stats dos jogadores.",
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="retro-badge border-[#C89B3C] text-[#C89B3C] mb-4 inline-flex">Como funciona</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#E8E8E8] uppercase tracking-wider">
            Do cadastro à arena
          </h2>
          <p className="mt-3 text-[#8896A4] max-w-xl mx-auto">
            Em 4 passos simples você está dentro do campeonato e competindo pelos prêmios.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="retro-panel hud-corners hover-lift hover-lift-gold p-5 space-y-3 relative"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-3xl font-bold text-[#252D3D]">{step.num}</span>
                <step.icon size={18} className="text-[#C89B3C]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-sm">
                  {step.title}
                </h3>
                <p className="text-xs text-[#8896A4] mt-1.5 leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 w-4 h-px bg-[#252D3D] z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
