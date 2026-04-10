"use client"

import { motion } from "framer-motion"
import { IconTacticalBoard, IconRoster, IconTrendingUp } from "@/components/ui/NavIcons"

const PILLARS = [
  {
    icon: IconTacticalBoard,
    title: "Formato Suíço",
    text: "Confrontos equilibrados que garantem aprendizado e evolução a cada partida, independente do resultado.",
  },
  {
    icon: IconRoster,
    title: "Hub Competitivo",
    text: "Um espaço para times se conectarem, criarem rivalidades saudáveis e construírem reputação dentro da comunidade.",
  },
  {
    icon: IconTrendingUp,
    title: "Crescimento Real",
    text: "Dar voz e visibilidade a quem se dedica de verdade ao jogo, inspirando comprometimento e evolução contínua.",
  },
]

export default function About() {
  return (
    <section id="sobre" className="py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="retro-badge border-[#C89B3C] text-[#C89B3C] inline-flex">
            Nossa missão
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#E8E8E8] uppercase tracking-wider">
            Bem-vindo à Arena BR
          </h2>
        </motion.div>

        {/* Manifesto */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#8896A4] leading-relaxed border-l-2 border-[#C89B3C] pl-4">
              A Arena BR nasceu com um propósito claro: fortalecer o cenário competitivo Tier 3 de League of Legends e dar às equipes High Elo a chance de jogar de forma constante, organizada e valorizada.
            </p>
            <p className="text-[#8896A4] leading-relaxed border-l-2 border-[#252D3D] pl-4">
              Aqui, cada torneio não é apenas uma disputa por vitórias — é uma oportunidade de evolução. Nosso formato suíço garante confrontos equilibrados, permitindo que cada equipe se teste, aprenda e melhore a cada partida.
            </p>
            <p className="text-[#8896A4] leading-relaxed border-l-2 border-[#252D3D] pl-4">
              Mais que campeonatos semanais, a Arena BR é um hub competitivo, um espaço onde times podem se conectar, criar rivalidades saudáveis e construir reputação dentro da comunidade.
            </p>
          </motion.div>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Goal card */}
            <div className="retro-panel-gold hud-corners p-6 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#C89B3C]">
                Objetivo final
              </p>
              <p className="text-[#E8E8E8] leading-relaxed text-sm">
                Transformar o Tier 3 em um ambiente consistente, reconhecido e ativo, onde o esforço, o talento e a paixão pelo League of Legends sejam sempre recompensados.
              </p>
            </div>

            {/* Pillars */}
            <div className="space-y-3">
              {PILLARS.map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                >
                  <div className="shrink-0 w-8 h-8 border border-[#252D3D] flex items-center justify-center text-[#C89B3C]">
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider text-xs">
                      {title}
                    </p>
                    <p className="text-xs text-[#8896A4] mt-0.5 leading-relaxed">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
