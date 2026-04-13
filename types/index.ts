// ─── Auth — espelha UserSerializer da prostaff-api ────────────
export interface User {
  id: number
  email: string
  full_name: string
  role: string
  role_display: string
  avatar_url: string | null
  discord_user_id: string | null
  timezone: string | null
  language: string | null
  last_login_at: string | null
  created_at: string
  updated_at: string
  permissions: {
    can_manage_users: boolean
    can_manage_players: boolean
    can_view_analytics: boolean
    is_admin_or_owner: boolean
  }
}

// ─── Organization — espelha OrganizationSerializer ────────────
export interface Organization {
  id: string          // UUID
  name: string
  slug: string
  team_tag: string | null
  region: string
  region_display: string
  tier: string
  tier_display: string
  logo_url: string | null
  statistics: {
    total_players: number
    active_players: number
    total_matches: number
  }
}

// ─── Player — espelha PlayerSerializer da prostaff-api ────────
// Organization.players é o elenco do time no ArenaBR
export interface Player {
  id: number
  summoner_name: string        // Riot ID (ex: "GameName#TAG")
  professional_name: string | null  // IGN de torneio
  real_name: string | null
  role: string                 // top | jungle | mid | adc | support
  status: string               // active | inactive | benched | trial
  riot_puuid: string | null
  solo_queue_tier: string | null   // IRON | BRONZE | ... | CHALLENGER
  solo_queue_rank: string | null   // I | II | III | IV
  solo_queue_lp: number | null
  solo_queue_wins: number | null
  solo_queue_losses: number | null
  current_rank: string | null  // computed: "Platinum II (45 LP)"
  win_rate: number | null      // computed
  profile_icon_id: number | null
  avatar_url: string | null
  discord_user_id: string | null
  jersey_number: number | null
  contract_status: string | null
  last_sync_at: string | null
  sync_status: string | null
}

// ─── Championship (módulo ArenaBR) ────────────────────────────
export type ChampionshipStatus = "open" | "ongoing" | "finished"

export interface Championship {
  id: number
  name: string
  description: string
  status: ChampionshipStatus
  prize_pool: number
  entry_fee: number
  max_teams: number
  enrolled_teams: number
  start_date: string
  end_date: string
  format: string
  banner_url: string | null
}

// ─── Enrolled Team (time inscrito num campeonato) ──────────────
export interface EnrolledTeam {
  id: number
  org_name: string
  org_logo: string | null
  org_region: string
  players: EnrolledPlayer[]
  wins: number
  losses: number
  match_diff: number
  payment_status: "pending" | "confirmed"
  enrolled_at: string
}

export interface EnrolledPlayer {
  id: number
  summoner_name: string
  role: string
  current_rank: string | null
  avatar_url: string | null
  is_captain: boolean
}

// ─── Free Agent (jogador inscrito sem time) ───────────────────
export interface FreeAgent {
  id: number
  summoner_name: string
  discord_user_id: string | null
  current_rank: string | null
  solo_queue_tier: string | null
  role: string
  avatar_url: string | null
  enrolled_at: string
}

// ─── Standings ────────────────────────────────────────────────
export interface StandingRow {
  position: number
  team_id: number
  team_name: string
  team_logo: string | null
  wins: number
  losses: number
  match_diff: number
}

// ─── Invite ───────────────────────────────────────────────────
export type InviteStatus = "pending" | "accepted" | "refused"

export interface Invite {
  id: number
  team_id: number
  team_name: string
  team_logo: string | null
  captain_summoner_name: string
  championship_name: string
  status: InviteStatus
  created_at: string
}

// ─── Match / Game / Stats (módulo de campeonatos) ────────────
export type MatchStatus = "scheduled" | "live" | "completed" | "walkover"
export type BracketSide = "upper" | "lower" | "grand_final"

export interface Match {
  id: number
  championship_id: number
  bracket_side: BracketSide
  round: string           // "UB R1" | "UB R2" | "UB Final" | "LB R1" | etc
  round_order: number     // para ordenação
  match_number: number    // dentro da rodada
  team_a_id: number | null
  team_a_name: string | null
  team_a_logo: string | null
  team_a_score: number
  team_b_id: number | null
  team_b_name: string | null
  team_b_logo: string | null
  team_b_score: number
  status: MatchStatus
  scheduled_at: string | null
  winner_id: number | null
  games: Game[]
}

export interface Game {
  id: number
  match_id: number
  game_number: number
  duration_seconds: number | null
  winner_id: number | null
  blue_team_id: number
  red_team_id: number
  player_stats: PlayerStat[]
}

export interface PlayerStat {
  player_id: number
  summoner_name: string
  team_id: number
  team_name: string
  side: "blue" | "red"
  role: string
  champion_name: string
  kills: number
  deaths: number
  assists: number
  kda: number
  cs: number
  gold: number
  damage_dealt: number
  vision_score: number
}

export interface ChampionStat {
  champion_name: string
  picks: number
  bans: number
  wins: number
  losses: number
  win_rate: number
}

// ─── Pix ──────────────────────────────────────────────────────
export interface PixPayment {
  qr_code: string
  qr_code_url: string
  amount: number
  expires_at: string
}

// ─── API Response wrapper ─────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: {
    current_page: number
    total_pages: number
    total_count: number
  }
}

// ─── Tournament — espelha TournamentSerializer ────────────────
export type TournamentStatus = "draft" | "registration_open" | "seeding" | "in_progress" | "finished" | "cancelled"
export type TournamentFormat = "double_elimination" | "single_elimination"
export type TournamentGame   = "league_of_legends" | "valorant" | "cs2"

export interface Tournament {
  id: string
  name: string
  game: TournamentGame
  format: TournamentFormat
  status: TournamentStatus
  max_teams: number
  enrolled_teams_count: number
  entry_fee_cents: number
  prize_pool_cents: number
  bo_format: number
  scheduled_start_at: string | null
  finished_at: string | null
  bracket_generated: boolean
  slots_available: boolean
  created_at: string
  updated_at: string
}

// ─── TournamentTeam — espelha TournamentTeamSerializer ────────
export type TournamentTeamStatus = "pending" | "approved" | "rejected" | "withdrawn" | "disqualified"

export interface RosterSnapshot {
  player_id: string
  summoner_name: string
  role: string
  position: "starter" | "substitute"
  locked_at: string
}

export interface TournamentTeam {
  id: string
  tournament_id: string
  organization_id: string
  team_name: string
  team_tag: string
  logo_url: string | null
  status: TournamentTeamStatus
  seed: number | null
  approved_at: string | null
  rejected_at: string | null
  enrolled_at: string | null
  roster: RosterSnapshot[]
}

// ─── TournamentMatch — espelha TournamentMatchSerializer ──────
export type TournamentMatchStatus =
  | "scheduled"
  | "checkin_open"
  | "in_progress"
  | "awaiting_report"
  | "awaiting_confirm"
  | "disputed"
  | "confirmed"
  | "completed"
  | "walkover"

export interface TournamentMatch {
  id: string
  tournament_id: string
  bracket_side: BracketSide
  round_label: string       // "UB Round 1", "LB Round 2", "Grand Final"
  round_order: number
  match_number: number
  bo_format: number
  status: TournamentMatchStatus
  team_a_id: string | null
  team_a_name: string | null
  team_a_score: number
  team_b_id: string | null
  team_b_name: string | null
  team_b_score: number
  winner_id: string | null
  loser_id: string | null
  next_match_winner_id: string | null
  next_match_loser_id: string | null
  checkin_deadline_at: string | null
  wo_deadline_at: string | null
  started_at: string | null
  completed_at: string | null
  // from getMatch (authenticated)
  my_team_checked_in?: boolean | null
  opponent_checked_in?: boolean | null
  my_team_has_reported?: boolean | null
}

// ─── MatchReport — espelha MatchReportSerializer ──────────────
export type MatchReportStatus = "submitted" | "confirmed" | "disputed"

export interface MatchReport {
  id: string
  tournament_match_id: string
  tournament_team_id: string
  team_a_score: number
  team_b_score: number
  evidence_url: string
  status: MatchReportStatus
  submitted_at: string
  confirmed_at: string | null
  deadline_at: string
}
