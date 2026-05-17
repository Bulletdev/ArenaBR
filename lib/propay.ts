// ProPay API client — PIX payment gateway
// Auth: JWT from arena_token cookie (same token as prostaff-api)
// Mutations MUST include Idempotency-Key header (crypto.randomUUID())

const PROPAY_URL = process.env.NEXT_PUBLIC_PROPAY_URL ?? "http://localhost:3000/v1"

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

// ─── Cookie helper ────────────────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

// ─── Fetch wrapper ────────────────────────────────────────────

async function propayFetch<T>(
  path: string,
  options: RequestInit & { idempotent?: boolean } = {},
): Promise<T> {
  const token = getCookie("arena_token")
  const { idempotent, ...fetchOptions } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(idempotent ? { "Idempotency-Key": crypto.randomUUID() } : {}),
  }

  const res = await fetch(`${PROPAY_URL}${path}`, {
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
    propayFetch<{ data: { balance_cents: number } }>("/wallet"),

  getTransactions: () =>
    propayFetch<{ data: Transaction[] }>("/wallet/transactions"),

  deposit: (amount_cents: number) =>
    propayFetch<{ data: ChargeData }>("/wallet/deposit", {
      method: "POST",
      idempotent: true,
      body: JSON.stringify({ amount_cents }),
    }),

  getCharge: (txid: string) =>
    propayFetch<{ data: ChargeData }>(`/charges/${txid}`),

  requestPayout: (data: PayoutRequest) =>
    propayFetch<{ data: PayoutData }>("/wallet/payouts", {
      method: "POST",
      idempotent: true,
      body: JSON.stringify(data),
    }),

  getPayout: (id: string) =>
    propayFetch<{ data: PayoutData }>(`/wallet/payouts/${id}`),

  getTournamentFinancialReport: (tournamentId: string) =>
    propayFetch<{ data: FinancialReport }>(`/tournaments/${tournamentId}/financial_report`),
}
