// ProPay API client — routed via prostaff-api proxy
// Chain: browser → /api/wallet/* (Next.js) → prostaff-api → ProPay
// Auth handled server-side via arena_token cookie injection

// ─── Domain types ─────────────────────────────────────────────

export interface Transaction {
  id: number
  amount_cents: number
  type: "deposit" | "inscription_debit" | "refund" | "prize_credit" | "saque_debit" | "platform_fee"
  description: string
  balance_after: number
  reference_type?: string
  reference_id?: number
  created_at: string
}

export interface ChargeData {
  txid: string
  status: "pending" | "active" | "paid" | "expired" | "cancelled"
  amount_cents: number
  qr_code?: string
  qr_code_url?: string
  expires_at?: string
  paid_at?: string | null
}

export interface PayoutRequest {
  amount_cents: number
  pix_key_type: "cpf" | "cnpj" | "email" | "phone" | "random"
  pix_key: string
}

export interface PayoutData {
  id: number
  amount_cents: number
  pix_key_type: string
  status: "pending" | "processing" | "completed" | "failed"
  completed_at?: string
  failed_at?: string
  failure_reason?: string
  created_at: string
}

export interface FinancialReport {
  tournament_id: number
  total_collected_cents: number
  platform_fee_cents: number
  prize_pool_cents: number
  status: string
  distributed_at?: string
}

// ─── Fetch wrapper ────────────────────────────────────────────

async function propayFetch<T>(
  path: string,
  options: RequestInit & { idempotent?: boolean } = {},
): Promise<T> {
  const { idempotent, ...fetchOptions } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(idempotent ? { "Idempotency-Key": crypto.randomUUID() } : {}),
  }

  const res = await fetch(path, {
    ...fetchOptions,
    headers: { ...headers, ...(fetchOptions.headers as Record<string, string> ?? {}) },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(body?.error?.message ?? `ProPay error ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ─── API surface ──────────────────────────────────────────────

export const propayApi = {
  getWallet: () =>
    propayFetch<{ data: { balance_cents: number } }>("/api/wallet"),

  getTransactions: () =>
    propayFetch<{ data: Transaction[] }>("/api/wallet/transactions"),

  deposit: (amount_cents: number) =>
    propayFetch<{ data: ChargeData }>("/api/wallet/deposit", {
      method: "POST",
      idempotent: true,
      body: JSON.stringify({ amount_cents }),
    }),

  getCharge: (txid: string) =>
    propayFetch<{ data: ChargeData }>(`/api/wallet/charges/${txid}`),

  requestPayout: (data: PayoutRequest) =>
    propayFetch<{ data: PayoutData }>("/api/wallet/payouts", {
      method: "POST",
      idempotent: true,
      body: JSON.stringify(data),
    }),

  getPayout: (id: string) =>
    propayFetch<{ data: PayoutData }>(`/api/wallet/payouts/${id}`),

  getTournamentFinancialReport: (tournamentId: string) =>
    propayFetch<{ data: FinancialReport }>(`/api/wallet/tournament-report/${tournamentId}`),
}
