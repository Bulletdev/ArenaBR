"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconChevronDown, IconTrophy, IconRoster, IconDollarSign, IconSwords } from "@/components/ui/NavIcons"

const STATS = [
  { icon: IconDollarSign, value: "R$500",  label: "Premiação total",    color: "#00D364" },
  { icon: IconTrophy,     value: "8",      label: "Vagas por edição",   color: "#C89B3C" },
  { icon: IconRoster,     value: "5v5",    label: "Formato de equipe",  color: "#0596AA" },
  { icon: IconSwords,     value: "2x",     label: "Elim. dupla",        color: "#C89B3C" },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanlines">
      {/* Vídeo de fundo */}
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

      {/* Gradiente sobre o vídeo */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,155,60,0.08) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(10,14,26,0.35) 0%, rgba(10,14,26,0.60) 50%, rgba(10,14,26,0.88) 100%)
          `,
        }}
      />

      {/* Grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,155,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,155,60,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Cantos decorativos */}
      <div className="absolute top-20 left-8 w-20 h-20 border-t-2 border-l-2 border-[#C89B3C]/40 pointer-events-none" />
      <div className="absolute top-20 right-8 w-14 h-14 border-t border-r border-[#0596AA]/30 pointer-events-none" />
      <div className="absolute bottom-20 right-8 w-20 h-20 border-b-2 border-r-2 border-[#C89B3C]/40 pointer-events-none" />
      <div className="absolute bottom-20 left-8 w-14 h-14 border-b border-l border-[#0596AA]/30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="inline-block h-px w-5 bg-[#0596AA]" />
          <span className="font-mono text-[10px] tracking-[3px] text-[#0596AA] uppercase">
            Season 1
          </span>
          <span className="border border-[#C89B3C]/30 bg-[#C89B3C]/10 px-2 py-0.5 font-mono text-[9px] tracking-[2px] text-[#C89B3C]/70 rounded-sm">
            Inscrições abertas
          </span>
          <span className="inline-block h-px w-5 bg-[#0596AA]" />
        </motion.div>

        {/* Título */}
        <motion.h1
          className="font-display font-bold uppercase leading-[1.05] tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="block text-5xl md:text-7xl text-[#E8E8E8]">Prove seu valor</span>
          <span className="block text-5xl md:text-7xl text-[#C89B3C] mt-1">na arena</span>
        </motion.h1>

        {/* Descrição */}
        <motion.p
          className="mt-5 text-[13px] text-[#8896A4] max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          A plataforma de campeonatos de League of Legends para o cenário amador brasileiro.
          Inscreva sua equipe, compita e acompanhe seu desempenho em tempo real.
        </motion.p>

        {/* CTAs — estilo scrims */}
        <motion.div
          className="mt-7 flex items-center justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Link
            href="/register"
            className="rounded-sm bg-[#C89B3C] px-5 py-3 font-mono text-[11px] font-semibold tracking-[2px] text-[#0A0E1A] transition-colors hover:bg-[#E8C96A] after:ml-2 after:content-['→']"
          >
            Inscreva-se agora
          </Link>
          <a
            href="#campeonatos"
            className="rounded-sm border border-[#C89B3C]/40 px-5 py-3 font-mono text-[11px] tracking-[2px] text-[#C89B3C] transition-colors hover:bg-[#C89B3C]/10"
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
              <div className="mt-1 font-mono text-[10px] tracking-wide text-[#8896A4]/60 uppercase">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#como-funciona"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#8896A4] hover:text-[#C89B3C] transition-colors"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <IconChevronDown size={20} />
      </motion.a>
    </section>
  )
}
