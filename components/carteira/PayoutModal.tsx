"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePayout, validatePixKey } from "@/hooks/usePayout"

type PixKeyType = "cpf" | "cnpj" | "email" | "phone" | "random"

const PIX_TYPES: { value: PixKeyType; label: string; placeholder: string; maxLength: number }[] = [
  { value: "cpf",    label: "CPF",             placeholder: "00000000000",    maxLength: 11 },
  { value: "email",  label: "Email",           placeholder: "seu@email.com",  maxLength: 75 },
  { value: "phone",  label: "Celular",         placeholder: "+5511999999999", maxLength: 14 },
  { value: "cnpj",   label: "CNPJ",            placeholder: "00000000000000", maxLength: 14 },
  { value: "random", label: "Chave aleatoria", placeholder: "UUID v4",        maxLength: 36 },
]

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

interface PayoutModalProps {
  balanceCents: number
  onClose: () => void
}

export default function PayoutModal({ balanceCents, onClose }: PayoutModalProps) {
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>("cpf")
  const [pixKey, setPixKey] = useState("")
  const [amountCents, setAmountCents] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [keyError, setKeyError] = useState<string | null>(null)
  const { status, error, payoutId, requestPayout, reset } = usePayout()

  function handleAmountInput(val: string) {
    setInputValue(val)
    const cents = Math.round(parseFloat(val.replace(",", ".")) * 100)
    setAmountCents(isNaN(cents) ? 0 : cents)
  }

  function handleKeyChange(val: string) {
    const sanitized =
      pixKeyType === "cpf" || pixKeyType === "cnpj" ? val.replace(/\D/g, "") : val
    setPixKey(sanitized)
    setKeyError(validatePixKey(pixKeyType, sanitized))
  }

  function handleTypeChange(type: PixKeyType) {
    setPixKeyType(type)
    setPixKey("")
    setKeyError(null)
  }

  async function handleSubmit() {
    const err = validatePixKey(pixKeyType, pixKey)
    if (err) { setKeyError(err); return }
    if (amountCents < 100 || amountCents > balanceCents) return
    await requestPayout(amountCents, pixKeyType, pixKey)
  }

  function handleClose() {
    reset()
    onClose()
  }

  const canSubmit =
    amountCents >= 100 &&
    amountCents <= balanceCents &&
    !keyError &&
    pixKey.length > 0

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,9,11,0.85)] backdrop-blur-sm">
        <motion.div
          className="panel w-full max-w-md mx-4 p-6 border-border"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl text-text">SACAR VIA PIX</h2>
            <button className="text-muted hover:text-text transition-colors" onClick={handleClose}>
              X
            </button>
          </div>

          {status !== "submitted" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Saldo disponivel:{" "}
                <span className="font-mono" style={{ color: balanceCents > 0 ? "var(--color-text)" : "var(--color-danger)" }}>
                  {formatBRL(balanceCents)}
                </span>
              </p>
              {balanceCents === 0 && (
                <p className="text-xs text-center py-2 border border-border text-muted">
                  Saldo insuficiente para saque. Deposite primeiro.
                </p>
              )}

              {/* Tipo de chave PIX */}
              <div>
                <label className="retro-label">Tipo de chave PIX</label>
                <div className="flex gap-2 flex-wrap">
                  {PIX_TYPES.map(t => (
                    <button
                      key={t.value}
                      className={`text-xs px-3 py-1 border transition-colors ${
                        pixKeyType === t.value
                          ? "border-crimson text-crimson bg-crimson/10"
                          : "border-border text-muted hover:border-muted"
                      }`}
                      onClick={() => handleTypeChange(t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chave PIX */}
              <div>
                <label className="retro-label">Chave PIX</label>
                <input
                  className="retro-input"
                  placeholder={PIX_TYPES.find(t => t.value === pixKeyType)?.placeholder}
                  maxLength={PIX_TYPES.find(t => t.value === pixKeyType)?.maxLength}
                  value={pixKey}
                  onChange={e => handleKeyChange(e.target.value)}
                />
                {keyError && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>
                    {keyError}
                  </p>
                )}
              </div>

              {/* Valor */}
              <div>
                <label className="retro-label">Valor (max {formatBRL(balanceCents)})</label>
                <input
                  className="retro-input"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Valor em R$"
                  value={inputValue}
                  onChange={e => handleAmountInput(e.target.value)}
                />
                {amountCents > balanceCents && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>
                    Valor maior que o saldo
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm" style={{ color: "var(--color-danger)" }}>
                  {error}
                </p>
              )}

              <button
                className="btn-primary w-full"
                onClick={handleSubmit}
                disabled={!canSubmit || status === "loading"}
              >
                {status === "loading"
                  ? "Solicitando..."
                  : `Sacar ${amountCents >= 100 ? formatBRL(amountCents) : ""}`}
              </button>
              <p className="text-xs text-center text-muted">
                Saques processados em ate 24h. Anti-fraude ativo.
              </p>
            </div>
          ) : (
            /* Estado: saque solicitado */
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
              <p className="font-display text-xl text-text">SAQUE SOLICITADO</p>
              <p className="text-muted text-sm">
                Sera processado em ate 24h.
                <br />
                ID: #{payoutId}
              </p>
              <button className="btn-secondary w-full" onClick={handleClose}>
                Fechar
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
