"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDeposit } from "@/hooks/useDeposit"

function friendlyError(msg: string): string {
  if (msg.includes("401") || msg.includes("403")) return "Servico de pagamento indisponivel. Tente novamente mais tarde."
  if (msg.includes("timeout") || msg.includes("Timeout")) return "O servico demorou demais para responder. Tente novamente."
  if (msg.includes("insufficient_funds")) return "Saldo insuficiente."
  if (msg.includes("invalid_pix_key")) return "Chave PIX invalida."
  return "Erro ao processar pagamento. Tente novamente."
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// Atalhos de valor em centavos
const PRESETS = [1000, 2000, 5000, 10000, 20000]

interface DepositModalProps {
  onClose: () => void
}

export default function DepositModal({ onClose }: DepositModalProps) {
  const [amountCents, setAmountCents] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const { status, qrCodeUrl, expiresAt, error, initiateDeposit, reset } = useDeposit()

  function handleAmountInput(val: string) {
    setInputValue(val)
    const cents = Math.round(parseFloat(val.replace(",", ".")) * 100)
    setAmountCents(isNaN(cents) ? 0 : cents)
  }

  async function handleSubmit() {
    if (amountCents < 100) return
    await initiateDeposit(amountCents)
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,9,11,0.85)] backdrop-blur-sm">
        <motion.div
          className="panel-crimson bracket-corners w-full max-w-md mx-4 p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl text-text">DEPOSITAR VIA PIX</h2>
            <button className="text-muted hover:text-text transition-colors" onClick={handleClose}>
              X
            </button>
          </div>

          {/* Estado: selecao de valor */}
          {(status === "idle" || status === "error") && (
            <div className="space-y-4">
              <div>
                <label className="retro-label">Valor</label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {PRESETS.map(p => (
                    <button
                      key={p}
                      className={`text-xs px-3 py-1 border transition-colors ${
                        amountCents === p
                          ? "border-crimson text-crimson bg-[rgba(185,28,28,0.08)]"
                          : "border-border text-muted hover:border-muted"
                      }`}
                      onClick={() => {
                        setAmountCents(p)
                        setInputValue((p / 100).toFixed(2))
                      }}
                    >
                      {formatBRL(p)}
                    </button>
                  ))}
                </div>
                <input
                  className="retro-input"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Outro valor (R$)"
                  value={inputValue}
                  onChange={e => handleAmountInput(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm" style={{ color: "var(--color-danger)" }}>
                  {friendlyError(error)}
                </p>
              )}
              <button
                className="btn-primary w-full"
                onClick={handleSubmit}
                disabled={amountCents < 100}
              >
                Gerar QR Code — {amountCents >= 100 ? formatBRL(amountCents) : "minimo R$1,00"}
              </button>
            </div>
          )}

          {/* Estado: gerando QR */}
          {status === "loading" && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted text-sm mt-3">Gerando QR Code...</p>
            </div>
          )}

          {/* Estado: aguardando pagamento */}
          {status === "awaiting_payment" && (
            <div className="text-center space-y-4">
              <p className="text-muted text-sm">Escaneie o QR Code no seu banco</p>
              {qrCodeUrl && (
                <a
                  href={qrCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-crimson p-4 hover:bg-[rgba(185,28,28,0.05)] transition-colors"
                >
                  <p className="font-mono text-xs text-crimson break-all">{qrCodeUrl}</p>
                  <p className="text-muted text-xs mt-2">Toque para abrir no banco</p>
                </a>
              )}
              <div className="flex items-center gap-2 justify-center">
                <div className="w-3 h-3 border border-crimson border-t-transparent rounded-full animate-spin" />
                <p className="text-muted text-sm">Aguardando pagamento...</p>
              </div>
              {expiresAt && (
                <p className="text-xs text-muted">
                  Expira em: {new Date(expiresAt).toLocaleTimeString("pt-BR")}
                </p>
              )}
            </div>
          )}

          {/* Estado: pago */}
          {status === "paid" && (
            <div className="text-center py-6 space-y-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{
                  background: "rgba(22,163,74,0.15)",
                  border: "1px solid var(--color-success)",
                }}
              >
                <span className="text-xl" style={{ color: "var(--color-success)" }}>
                  V
                </span>
              </div>
              <p className="font-display text-xl" style={{ color: "var(--color-success)" }}>
                DEPOSITO CONFIRMADO
              </p>
              <p className="text-muted text-sm">Seu saldo foi atualizado.</p>
              <button className="btn-primary w-full" onClick={handleClose}>
                Fechar
              </button>
            </div>
          )}

          {/* Estado: expirado */}
          {status === "expired" && (
            <div className="text-center py-6 space-y-3">
              <p className="font-display text-xl" style={{ color: "var(--color-danger)" }}>
                QR CODE EXPIRADO
              </p>
              <button className="btn-secondary w-full" onClick={reset}>
                Gerar novo QR Code
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
