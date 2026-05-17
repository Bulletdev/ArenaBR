"use client"

import { useTransactions } from "@/hooks/useWallet"
import type { Transaction } from "@/lib/propay"

const TYPE_LABELS: Record<Transaction["type"], string> = {
  deposit:           "Deposito",
  inscription_debit: "Inscricao",
  refund:            "Reembolso",
  prize_credit:      "Premiacao",
  saque_debit:       "Saque",
  platform_fee:      "Taxa da plataforma",
}

const TYPE_COLORS: Record<Transaction["type"], string> = {
  deposit:           "var(--color-success)",
  prize_credit:      "var(--color-gold)",
  refund:            "var(--color-success)",
  inscription_debit: "var(--color-danger)",
  saque_debit:       "var(--color-danger)",
  platform_fee:      "var(--color-text-muted)",
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatSign(cents: number): string {
  return cents > 0 ? `+${formatBRL(cents)}` : formatBRL(cents)
}

export default function TransactionList() {
  const { data: transactions, isLoading } = useTransactions()

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-elevated animate-pulse" />
        ))}
      </div>
    )
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-10 text-muted">
        <p className="font-display text-lg">SEM MOVIMENTACOES</p>
        <p className="text-sm mt-1">Faca um deposito para comecar.</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {transactions.map(tx => (
        <div
          key={tx.id}
          className="flex items-center justify-between px-4 py-3 bg-surface hover:bg-elevated transition-colors border-b border-border last:border-b-0"
        >
          <div>
            <p className="text-sm text-text">{TYPE_LABELS[tx.type] ?? tx.type}</p>
            {tx.description && (
              <p className="text-xs text-muted">{tx.description}</p>
            )}
            <p className="text-xs text-muted">
              {new Date(tx.created_at).toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <p
              className="font-mono font-semibold text-sm"
              style={{ color: TYPE_COLORS[tx.type] ?? "var(--color-text)" }}
            >
              {formatSign(tx.amount_cents)}
            </p>
            <p className="text-xs text-muted">Saldo: {formatBRL(tx.balance_after)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
