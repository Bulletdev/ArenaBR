"use client"

import { useState } from "react"
import { useWallet } from "@/hooks/useWallet"
import BalanceCard from "@/components/carteira/BalanceCard"
import DepositModal from "@/components/carteira/DepositModal"
import PayoutModal from "@/components/carteira/PayoutModal"
import TransactionList from "@/components/carteira/TransactionList"

export default function CarteiraPage() {
  const [showDeposit, setShowDeposit] = useState(false)
  const [showPayout, setShowPayout] = useState(false)
  const { data: wallet } = useWallet()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <p className="retro-label">ArenaBR</p>
        <h1 className="font-display text-3xl font-bold text-text uppercase tracking-wider">
          Carteira
        </h1>
      </div>

      <hr className="retro-sep" />

      <BalanceCard
        onDeposit={() => setShowDeposit(true)}
        onWithdraw={() => setShowPayout(true)}
      />

      <div className="panel p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="font-display text-base text-text">HISTORICO DE MOVIMENTACOES</p>
        </div>
        <TransactionList />
      </div>

      {showDeposit && (
        <DepositModal onClose={() => setShowDeposit(false)} />
      )}
      {showPayout && (
        <PayoutModal
          balanceCents={wallet?.balance_cents ?? 0}
          onClose={() => setShowPayout(false)}
        />
      )}
    </div>
  )
}
