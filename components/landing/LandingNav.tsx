"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Button from "@/components/ui/Button"
import { IconMenu, IconClose } from "@/components/ui/NavIcons"
import { cn } from "@/lib/utils"

export default function LandingNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-[#252D3D] bg-[#0A0E1A]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <img src="/arenabrlogo.png" alt="ArenaBR" className="h-32 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#sobre"         className="text-[#8896A4] hover:text-[#E8E8E8] transition-colors">Sobre</a>
          <a href="#como-funciona" className="text-[#8896A4] hover:text-[#E8E8E8] transition-colors">Como funciona</a>
          <a href="#campeonatos"   className="text-[#8896A4] hover:text-[#E8E8E8] transition-colors">Campeonatos</a>
          <a href="#faq"           className="text-[#8896A4] hover:text-[#E8E8E8] transition-colors">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-sm py-2 px-4">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button className="text-sm py-2 px-4">Inscreva-se</Button>
          </Link>
        </div>

        <button className="md:hidden text-[#8896A4] hover:text-[#E8E8E8]" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <IconClose size={20} /> : <IconMenu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#252D3D] bg-[#0A0E1A] px-6 py-4 space-y-3">
          <a href="#sobre"         className="block text-sm text-[#8896A4]" onClick={() => setOpen(false)}>Sobre</a>
          <a href="#como-funciona" className="block text-sm text-[#8896A4]" onClick={() => setOpen(false)}>Como funciona</a>
          <a href="#campeonatos"   className="block text-sm text-[#8896A4]" onClick={() => setOpen(false)}>Campeonatos</a>
          <a href="#faq"           className="block text-sm text-[#8896A4]" onClick={() => setOpen(false)}>FAQ</a>
          <div className="flex gap-3 pt-2">
            <Link href="/login"    className="flex-1"><Button variant="ghost" className="w-full">Entrar</Button></Link>
            <Link href="/register" className="flex-1"><Button className="w-full">Inscreva-se</Button></Link>
          </div>
        </div>
      )}
    </header>
  )
}
