import type { User, Player, Tournament, TournamentTeam, TournamentMatch, MatchReport } from "@/types"
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
    request<ApiSuccess<{ user: User; organization: import("@/types").Organization | null; access_token: string; refresh_token: string }>>(
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

// ─── Tournaments ──────────────────────────────────────────────
export const tournamentApi = {
  list: () =>
    request<ApiSuccess<Tournament[]>>("/api/tournaments"),

  show: (id: string) =>
    request<ApiSuccess<Tournament>>(`/api/tournaments/${id}`),

  create: (payload: Partial<Tournament>) =>
    request<ApiSuccess<Tournament>>("/api/tournaments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<Tournament>) =>
    request<ApiSuccess<Tournament>>(`/api/tournaments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  generateBracket: (id: string) =>
    request<ApiSuccess<Tournament>>(`/api/tournaments/${id}/generate-bracket`, {
      method: "POST",
    }),

  // ─── Teams / enrollment ─────────────────────────────────────
  getTeams: (tournamentId: string) =>
    request<ApiSuccess<TournamentTeam[]>>(`/api/tournaments/${tournamentId}/teams`),

  enrollTeam: (tournamentId: string, payload: { team_name?: string; team_tag?: string; logo_url?: string }) =>
    request<ApiSuccess<TournamentTeam>>(`/api/tournaments/${tournamentId}/teams`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  approveTeam: (tournamentId: string, teamId: string) =>
    request<ApiSuccess<TournamentTeam>>(`/api/tournaments/${tournamentId}/teams/${teamId}/approve`, {
      method: "PATCH",
    }),

  rejectTeam: (tournamentId: string, teamId: string) =>
    request<ApiSuccess<TournamentTeam>>(`/api/tournaments/${tournamentId}/teams/${teamId}/reject`, {
      method: "PATCH",
    }),

  // ─── Matches ────────────────────────────────────────────────
  getMatches: (tournamentId: string) =>
    request<ApiSuccess<TournamentMatch[]>>(`/api/tournaments/${tournamentId}/matches`),

  getMatch: (tournamentId: string, matchId: string) =>
    request<ApiSuccess<TournamentMatch & { my_team_checked_in: boolean | null; opponent_checked_in: boolean | null }>>
      (`/api/tournaments/${tournamentId}/matches/${matchId}`),

  checkin: (tournamentId: string, matchId: string) =>
    request<ApiSuccess<{ checked_in: boolean; match_status: string }>>
      (`/api/tournaments/${tournamentId}/matches/${matchId}/checkin`, { method: "POST" }),

  // ─── Match reports ──────────────────────────────────────────
  getReport: (tournamentId: string, matchId: string) =>
    request<ApiSuccess<{ my_report: MatchReport | null; opponent_reported: boolean; match_status: string }>>
      (`/api/tournaments/${tournamentId}/matches/${matchId}/report`),

  submitReport: (tournamentId: string, matchId: string, payload: {
    team_a_score: number
    team_b_score: number
    evidence_url: string
  }) =>
    request<ApiSuccess<{ status: string; report: MatchReport }>>
      (`/api/tournaments/${tournamentId}/matches/${matchId}/report`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

  adminResolveDispute: (tournamentId: string, matchId: string, winnerId: string) =>
    request<ApiSuccess<TournamentMatch>>(
      `/api/tournaments/${tournamentId}/matches/${matchId}/report/admin-resolve`,
      {
        method: "POST",
        body: JSON.stringify({ winner_team_id: winnerId }),
      }
    ),
}

// ─── Invites (mock — módulo a implementar) ────────────────────
export const inviteApi = {
  list: () => Promise.reject(new Error("Invite module not implemented")),
  accept: (_id: number) => Promise.reject(new Error("Invite module not implemented")),
  refuse: (_id: number) => Promise.reject(new Error("Invite module not implemented")),
  send: (_payload: { player_id: number; team_enrollment_id: number }) =>
    Promise.reject(new Error("Invite module not implemented")),
}
