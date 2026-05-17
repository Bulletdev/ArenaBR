"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconChevronDown } from "@/components/ui/NavIcons"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "Como funciona a inscricao no campeonato?",
    a: "Crie sua conta, valide seu Riot ID e escolha entre se inscrever como Free Agent (sem time) ou inscrever sua equipe. Para equipes, o capitao monta o elenco convidando jogadores ja cadastrados na plataforma e realiza o pagamento via Pix.",
  },
  {
    q: "Qual e o formato do campeonato?",
    a: "A Season 1 utiliza o formato de Eliminacao Dupla com 8 times. Cada time disputa ao menos 2 rodadas antes de ser eliminado, garantindo mais partidas por inscricao.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "O pagamento e unico por equipe: R$100,00 via Pix. Nao aceitamos cartao de credito para evitar chargebacks. A confirmacao e processada em ate 30 minutos apos o pagamento.",
  },
  {
    q: "O que e um Free Agent?",
    a: "Free Agent e um jogador inscrito no campeonato que ainda nao pertence a nenhum time. Capitaes de equipes podem visualizar a lista de Free Agents e enviar convites para completar seus elencos.",
  },
  {
    q: "Como convidar jogadores para minha equipe?",
    a: "Na area de Times, ao criar ou gerenciar sua equipe, voce pode buscar jogadores cadastrados na plataforma pelo Riot ID. Ao convidar, o jogador recebe uma notificacao e pode aceitar ou recusar o convite.",
  },
  {
    q: "Quantos jogadores preciso para formar um time?",
    a: "E necessario um minimo de 5 jogadores por time (titulares). Voce pode inscrever reservas adicionais, respeitando o limite definido pelo regulamento do campeonato.",
  },
  {
    q: "Em quanto tempo meu pagamento e confirmado?",
    a: "Pagamentos via Pix sao confirmados em ate 30 minutos. Apos a confirmacao, seu time aparece como inscrito no campeonato e voce recebe uma notificacao na plataforma.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge border-crimson text-crimson mb-4 inline-flex">Duvidas frequentes</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text uppercase tracking-wider">FAQ</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className={cn("panel overflow-hidden", open === i && "border-crimson")}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-elevated transition-colors"
              >
                <span className={cn("font-medium text-sm", open === i ? "text-crimson" : "text-text")}>{faq.q}</span>
                <IconChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 transition-transform duration-200",
                    open === i ? "text-crimson rotate-180" : "text-muted"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 border-t border-border">
                      <p className="text-sm text-muted leading-relaxed pt-3">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
