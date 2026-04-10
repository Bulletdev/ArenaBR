"use client"

import Link from "next/link"
import Button from "@/components/ui/Button"

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#0A0E1A] text-[#E8E8E8] flex items-center justify-center px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url(/bg-404.webp)" }}
      />
      <div className="relative z-10 text-center space-y-6 max-w-sm">
        <p className="font-mono text-[#C89B3C] text-xs uppercase tracking-[0.3em]">
          Erro 404
        </p>

        <h1 className="font-display text-8xl font-extrabold tracking-tight text-[#E8E8E8] opacity-10 select-none">
          404
        </h1>

        <div className="space-y-2 -mt-8">
          <h2 className="font-display text-xl font-bold uppercase tracking-widest text-[#E8E8E8]">
            Página não encontrada
          </h2>
          <p className="text-[#8896A4] text-sm leading-relaxed">
            A rota que você acessou não existe ou foi removida.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Link href="/dashboard">
            <Button className="text-sm">Voltar ao Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-sm">Início</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
