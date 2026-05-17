"use client"

import { useState, useEffect, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { propayApi } from "@/lib/propay"

interface DepositState {
  txid: string | null
  qrCode: string | null
  qrCodeUrl: string | null
  expiresAt: string | null
  status: "idle" | "loading" | "awaiting_payment" | "paid" | "expired" | "error"
  error: string | null
}

const INITIAL_STATE: DepositState = {
  txid: null,
  qrCode: null,
  qrCodeUrl: null,
  expiresAt: null,
  status: "idle",
  error: null,
}

export function useDeposit() {
  const queryClient = useQueryClient()
  const [state, setState] = useState<DepositState>(INITIAL_STATE)

  // Polling: verifica status do charge a cada 3s enquanto awaiting_payment
  useEffect(() => {
    if (state.status !== "awaiting_payment" || !state.txid) return

    const interval = setInterval(async () => {
      try {
        const { data } = await propayApi.getCharge(state.txid!)
        if (data.status === "paid") {
          setState(s => ({ ...s, status: "paid" }))
          queryClient.invalidateQueries({ queryKey: ["wallet"] })
          queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] })
          clearInterval(interval)
        } else if (data.status === "expired" || data.status === "cancelled") {
          setState(s => ({ ...s, status: "expired" }))
          clearInterval(interval)
        }
      } catch {
        // ignora erros de polling — tentara novamente no proximo ciclo
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [state.status, state.txid, queryClient])

  const initiateDeposit = useCallback(async (amount_cents: number) => {
    setState({ ...INITIAL_STATE, status: "loading" })
    try {
      const { data } = await propayApi.deposit(amount_cents)
      setState({
        txid: data.txid,
        qrCode: data.qr_code ?? null,
        qrCodeUrl: data.qr_code_url ?? null,
        expiresAt: data.expires_at ?? null,
        status: "awaiting_payment",
        error: null,
      })
    } catch (e) {
      setState(s => ({ ...s, status: "error", error: (e as Error).message }))
    }
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return { ...state, initiateDeposit, reset }
}
