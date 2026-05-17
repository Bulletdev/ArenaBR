"use client"

import { useWallet } from "@/hooks/useWallet"

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

interface BalanceCardProps {
  onDeposit: () => void
  onWithdraw: () => void
}

export default function BalanceCard({ onDeposit, onWithdraw }: BalanceCardProps) {
  const { data: wallet, isLoading } = useWallet()

  return (
    <div className="panel-crimson bracket-corners p-6">
      <p className="retro-label">Saldo disponivel</p>
      {isLoading ? (
        <div className="h-10 w-32 bg-elevated animate-pulse mt-2" />
      ) : (
        <p className="font-mono text-4xl font-semibold text-text mt-1">
          {formatBRL(wallet?.balance_cents ?? 0)}
        </p>
      )}
      <div className="flex gap-3 mt-5">
        <button className="btn-primary flex-1" onClick={onDeposit}>
          Depositar
        </button>
        <button className="btn-secondary flex-1" onClick={onWithdraw}>
          Sacar
        </button>
      </div>
    </div>
  )
}
