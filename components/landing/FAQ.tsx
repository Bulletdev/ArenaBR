"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconChevronDown } from "@/components/ui/NavIcons"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "Como funciona a inscrição no campeonato?",
    a: "Crie sua conta, valide seu Riot ID e escolha entre se inscrever como Free Agent (sem time) ou inscrever sua equipe. Para equipes, o capitão monta o elenco convidando jogadores já cadastrados na plataforma e realiza o pagamento via Pix.",
  },
  {
    q: "Qual é o formato do campeonato?",
    a: "A Season 1 utiliza o formato de Eliminação Dupla com 8 times. Cada time disputa ao menos 2 rodadas antes de ser eliminado, garantindo mais partidas por inscrição.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "O pagamento é único por equipe: R$100,00 via Pix. Não aceitamos cartão de crédito para evitar chargebacks. A confirmação é processada em até 30 minutos após o pagamento.",
  },
  {
    q: "O que é um Free Agent?",
    a: "Free Agent é um jogador inscrito no campeonato que ainda não pertence a nenhum time. Capitães de equipes podem visualizar a lista de Free Agents e enviar convites para completar seus elencos.",
  },
  {
    q: "Como convidar jogadores para minha equipe?",
    a: "Na área de Times, ao criar ou gerenciar sua equipe, você pode buscar jogadores cadastrados na plataforma pelo Riot ID. Ao convidar, o jogador recebe uma notificação e pode aceitar ou recusar o convite.",
  },
  {
    q: "Quantos jogadores preciso para formar um time?",
    a: "É necessário um mínimo de 5 jogadores por time (titulares). Você pode inscrever reservas adicionais, respeitando o limite definido pelo regulamento do campeonato.",
  },
  {
    q: "Em quanto tempo meu pagamento é confirmado?",
    a: "Pagamentos via Pix são confirmados em até 30 minutos. Após a confirmação, seu time aparece como inscrito no campeonato e você recebe uma notificação na plataforma.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="retro-badge border-[#C89B3C] text-[#C89B3C] mb-4 inline-flex">Dúvidas frequentes</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#E8E8E8] uppercase tracking-wider">FAQ</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className={cn("retro-panel overflow-hidden", open === i && "border-[#252D3D]")}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#1A2235] transition-colors"
              >
                <span className="font-medium text-sm text-[#E8E8E8]">{faq.q}</span>
                <IconChevronDown
                  size={16}
                  className={cn(
                    "text-[#C89B3C] shrink-0 transition-transform duration-200",
                    open === i && "rotate-180"
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
                    <div className="px-5 pb-4 border-t border-[#252D3D]">
                      <p className="text-sm text-[#8896A4] leading-relaxed pt-3">{faq.a}</p>
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
