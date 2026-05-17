"use client"

import { useQuery } from "@tanstack/react-query"
import { propayApi } from "@/lib/propay"

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => propayApi.getWallet().then(r => r.data),
    staleTime: 30_000, // 30s — saldo pode mudar apos pagamento
  })
}

export function useTransactions() {
  return useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: () => propayApi.getTransactions().then(r => r.data),
  })
}
