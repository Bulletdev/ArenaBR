import type { User, Player } from "@/types"
import type { PlayerSession } from "@/stores/auth"

// Todas as chamadas passam por Next.js API Routes (proxy) para:
// 1. Evitar CORS (prostaff-api não tem localhost:4000 em allowed origins)
// 2. Injetar arena_token cookie como Authorization: Bearer server-side

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }))
    throw new Error(err?.error?.message ?? err?.message ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ─── Wrapper prostaff-api ─────────────────────────────────────
export interface ApiSuccess<T> {
  data: T
  message?: string
}

// ─── Auth (via proxy /api/auth/*) ─────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<ApiSuccess<{ user: User; access_token: string; refresh_token: string }>>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),
  register: (payload: { email: string; password: string; full_name: string }) =>
    request<ApiSuccess<{ user: User; access_token: string }>>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(payload) }
    ),
  // Auto-cadastro de jogador via ArenaBR — sem org, free agent
  playerRegister: (payload: {
    player_email: string
    password: string
    password_confirmation: string
    summoner_name: string
    discord_user_id?: string
  }) =>
    request<ApiSuccess<PlayerSession & { access_token: string; refresh_token: string }>>(
      "/api/auth/player-register",
      { method: "POST", body: JSON.stringify(payload) }
    ),
  // Login de jogador — usa player_email (não email)
  playerLogin: (player_email: string, password: string) =>
    request<ApiSuccess<PlayerSession & { access_token: string; refresh_token: string }>>(
      "/api/auth/player-login",
      { method: "POST", body: JSON.stringify({ player_email, password }) }
    ),
  logout: () =>
    request("/api/auth/logout", { method: "POST" }),
  me: () =>
    request<ApiSuccess<User>>("/api/profile"),
}

// ─── Players (elenco da org logada) ───────────────────────────
// Proxia para prostaff-api /api/v1/players (já filtrado pela org do token)
export const playerApi = {
  list: (params?: { role?: string; status?: string; search?: string }) => {
    const qs = new URLSearchParams()
    if (params?.role) qs.set("role", params.role)
    if (params?.status) qs.set("status", params.status)
    if (params?.search) qs.set("search", params.search)
    const query = qs.toString() ? `?${qs}` : ""
    return request<ApiSuccess<{ players: Player[]; pagination: unknown }>>(`/api/players${query}`)
  },
  show: (id: number) =>
    request<ApiSuccess<{ player: Player }>>(`/api/players/${id}`),
  searchRiotId: (summoner_name: string) =>
    request<ApiSuccess<Player[]>>(`/api/players/search?q=${encodeURIComponent(summoner_name)}`),
  freeAgents: () =>
    request<ApiSuccess<{
      free_agents: Array<{ player: Player; previous_organization: string | null; removed_at: string | null; removed_reason: string | null }>
      pagination: unknown
    }>>("/api/free-agents"),
}

// ─── Championships (mock — módulo ArenaBR a implementar) ──────
export const championshipApi = {
  list: () => Promise.reject(new Error("Championship module not implemented")),
  show: (_id: number) => Promise.reject(new Error("Championship module not implemented")),
  standings: (_id: number) => Promise.reject(new Error("Championship module not implemented")),
}

// ─── Enrollment (mock — módulo ArenaBR a implementar) ─────────
export const enrollmentApi = {
  enroll: (_payload: { championship_id: number; type: "team" | "free_agent"; player_ids?: number[] }) =>
    Promise.reject(new Error("Enrollment module not implemented")),
}

// ─── Invites (mock — módulo ArenaBR a implementar) ────────────
export const inviteApi = {
  list: () => Promise.reject(new Error("Invite module not implemented")),
  accept: (_id: number) => Promise.reject(new Error("Invite module not implemented")),
  refuse: (_id: number) => Promise.reject(new Error("Invite module not implemented")),
  send: (_payload: { player_id: number; team_enrollment_id: number }) =>
    Promise.reject(new Error("Invite module not implemented")),
}
