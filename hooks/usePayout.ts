"use client"

import { useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { propayApi } from "@/lib/propay"

type PixKeyType = "cpf" | "cnpj" | "email" | "phone" | "random"

interface PayoutState {
  status: "idle" | "loading" | "submitted" | "error"
  error: string | null
  payoutId: number | null
}

const INITIAL_STATE: PayoutState = {
  status: "idle",
  error: null,
  payoutId: null,
}

// Validacao de chave PIX por tipo
export function validatePixKey(type: PixKeyType, key: string): string | null {
  switch (type) {
    case "cpf":
      return /^\d{11}$/.test(key) ? null : "CPF deve ter 11 digitos numericos"
    case "cnpj":
      return /^\d{14}$/.test(key) ? null : "CNPJ deve ter 14 digitos numericos"
    case "email":
      return key.includes("@") && key.length <= 75 ? null : "Email invalido"
    case "phone":
      return /^\+55\d{10,11}$/.test(key) ? null : "Telefone: +55 + 10 ou 11 digitos"
    case "random":
      return /^[0-9a-f-]{36}$/.test(key) ? null : "Chave aleatoria deve ser UUID v4"
    default:
      return "Tipo de chave invalido"
  }
}

export function usePayout() {
  const queryClient = useQueryClient()
  const [state, setState] = useState<PayoutState>(INITIAL_STATE)

  const requestPayout = useCallback(
    async (amount_cents: number, pix_key_type: PixKeyType, pix_key: string) => {
      const validationError = validatePixKey(pix_key_type, pix_key)
      if (validationError) {
        setState({ status: "error", error: validationError, payoutId: null })
        return
      }

      setState({ status: "loading", error: null, payoutId: null })
      try {
        const { data } = await propayApi.requestPayout({ amount_cents, pix_key_type, pix_key })
        setState({ status: "submitted", error: null, payoutId: data.id })
        queryClient.invalidateQueries({ queryKey: ["wallet"] })
        queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] })
      } catch (e) {
        setState({ status: "error", error: (e as Error).message, payoutId: null })
      }
    },
    [queryClient],
  )

  const reset = useCallback(() => setState(INITIAL_STATE), [])

  return { ...state, requestPayout, reset }
}
