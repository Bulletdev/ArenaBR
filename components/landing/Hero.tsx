"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconChevronDown, IconTrophy, IconRoster, IconDollarSign, IconSwords } from "@/components/ui/NavIcons"

const STATS = [
  { icon: IconDollarSign, value: "R$500",  label: "Premiação total",    color: "var(--color-gold)" },
  { icon: IconTrophy,     value: "8",      label: "Vagas por edição",   color: "var(--color-crimson)" },
  { icon: IconRoster,     value: "5v5",    label: "Formato de equipe",  color: "var(--color-text)" },
  { icon: IconSwords,     value: "2x",     label: "Elim. dupla",        color: "var(--color-crimson)" },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video de fundo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }}
      >
        <source src="/hero.webm" type="video/webm" />
      </video>

      {/* Gradiente sobre o video */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(185,28,28,0.06) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(9,9,11,0.35) 0%, rgba(9,9,11,0.60) 50%, rgba(9,9,11,0.88) 100%)
          `,
        }}
      />

      {/* Grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(185,28,28,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,28,28,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Cantos decorativos — top-left e bottom-right em crimson, top-right e bottom-left em gold/border */}
      <div className="absolute top-20 left-8 w-20 h-20 border-t-2 border-l-2 border-crimson/40 pointer-events-none" />
      <div className="absolute top-20 right-8 w-14 h-14 border-t border-r border-white/20 pointer-events-none" />
      <div className="absolute bottom-20 right-8 w-20 h-20 border-b-2 border-r-2 border-crimson/40 pointer-events-none" />
      <div className="absolute bottom-20 left-8 w-14 h-14 border-b border-l border-white/20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="inline-block h-px w-5 bg-crimson" />
          <span className="font-mono text-[10px] tracking-[3px] text-crimson uppercase">
            Season 1
          </span>
          <span className="border border-white/20 bg-white/5 px-2 py-0.5 font-mono text-[9px] tracking-[2px] text-white/60 rounded-sm">
            Inscricoes abertas
          </span>
          <span className="inline-block h-px w-5 bg-crimson" />
        </motion.div>

        {/* Titulo */}
        <motion.h1
          className="font-display font-bold uppercase leading-[1.05] tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="block text-5xl md:text-7xl text-text">Prove seu valor</span>
          <span className="block text-5xl md:text-7xl text-crimson mt-1">na arena</span>
        </motion.h1>

        {/* Descricao */}
        <motion.p
          className="mt-5 text-[13px] text-muted max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          A plataforma de campeonatos de League of Legends para o cenario amador brasileiro.
          Inscreva sua equipe, compita e acompanhe seu desempenho em tempo real.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-7 flex items-center justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Link
            href="/register"
            className="btn-primary rounded-sm px-5 py-3 font-mono text-[11px] font-semibold tracking-[2px] after:ml-2 after:content-['→']"
          >
            Inscreva-se agora
          </Link>
          <a
            href="#campeonatos"
            className="btn-secondary rounded-sm px-5 py-3 font-mono text-[11px] tracking-[2px]"
          >
            Ver campeonatos
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-9 flex items-center justify-center gap-7 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="text-center">
              <div className="font-display text-[28px] font-bold leading-none" style={{ color }}>{value}</div>
              <div className="mt-1 font-mono text-[10px] tracking-wide text-muted/60 uppercase">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#como-funciona"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted hover:text-crimson transition-colors"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <IconChevronDown size={20} />
      </motion.a>
    </section>
  )
}
