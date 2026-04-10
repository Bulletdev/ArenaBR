"use client"

import { create } from "zustand"
import type { Match } from "@/types"
import { mockMatches } from "@/lib/mock"

// ─── Bracket progression map ──────────────────────────────────
// Hardcoded para eliminação dupla 8 times (Season 1)
// matchId → onde vai o vencedor e o perdedor
const PROGRESSION: Record<number, {
  winner: { matchId: number; slot: "a" | "b" } | null
  loser:  { matchId: number; slot: "a" | "b" } | null
}> = {
  1:  { winner: { matchId: 5,  slot: "a" }, loser: { matchId: 8,  slot: "a" } },
  2:  { winner: { matchId: 5,  slot: "b" }, loser: { matchId: 9,  slot: "a" } },
  3:  { winner: { matchId: 6,  slot: "a" }, loser: { matchId: 8,  slot: "b" } },
  4:  { winner: { matchId: 6,  slot: "b" }, loser: { matchId: 9,  slot: "b" } },
  5:  { winner: { matchId: 7,  slot: "a" }, loser: { matchId: 10, slot: "a" } },
  6:  { winner: { matchId: 7,  slot: "b" }, loser: { matchId: 11, slot: "a" } },
  7:  { winner: { matchId: 14, slot: "a" }, loser: { matchId: 13, slot: "a" } },
  8:  { winner: { matchId: 10, slot: "b" }, loser: null },
  9:  { winner: { matchId: 11, slot: "b" }, loser: null },
  10: { winner: { matchId: 12, slot: "a" }, loser: null },
  11: { winner: { matchId: 12, slot: "b" }, loser: null },
  12: { winner: { matchId: 13, slot: "b" }, loser: null },
  13: { winner: { matchId: 14, slot: "b" }, loser: null },
  14: { winner: null, loser: null },
}

interface ChampionshipState {
  matches: Match[]

  submitResult: (params: {
    matchId: number
    teamAScore: number
    teamBScore: number
  }) => void

  declareWalkover: (params: {
    matchId: number
    winnerId: number
    winnerIsTeamA: boolean
  }) => void

  resetMatch: (matchId: number) => void
}

function advanceTeam(
  matches: Match[],
  teamId: number | null,
  teamName: string | null,
  teamLogo: string | null,
  target: { matchId: number; slot: "a" | "b" },
): Match[] {
  return matches.map(m => {
    if (m.id !== target.matchId) return m
    if (target.slot === "a") {
      return { ...m, team_a_id: teamId, team_a_name: teamName, team_a_logo: teamLogo }
    } else {
      return { ...m, team_b_id: teamId, team_b_name: teamName, team_b_logo: teamLogo }
    }
  })
}

export const useChampionshipStore = create<ChampionshipState>()((set) => ({
  matches: mockMatches,

  submitResult: ({ matchId, teamAScore, teamBScore }) => {
    set(state => {
      const match = state.matches.find(m => m.id === matchId)
      if (!match) return state

      const winnerId = teamAScore > teamBScore ? match.team_a_id : match.team_b_id
      const loserId  = teamAScore > teamBScore ? match.team_b_id : match.team_a_id
      const winnerName = teamAScore > teamBScore ? match.team_a_name : match.team_b_name
      const winnerLogo = teamAScore > teamBScore ? match.team_a_logo : match.team_b_logo
      const loserName  = teamAScore > teamBScore ? match.team_b_name : match.team_a_name
      const loserLogo  = teamAScore > teamBScore ? match.team_b_logo : match.team_a_logo

      // Update the match itself
      let next = state.matches.map(m =>
        m.id === matchId
          ? { ...m, team_a_score: teamAScore, team_b_score: teamBScore, winner_id: winnerId, status: "completed" as const }
          : m
      )

      // Advance winner and loser to next rounds
      const prog = PROGRESSION[matchId]
      if (prog?.winner) {
        next = advanceTeam(next, winnerId, winnerName, winnerLogo, prog.winner)
      }
      if (prog?.loser) {
        next = advanceTeam(next, loserId, loserName, loserLogo, prog.loser)
      }

      return { matches: next }
    })
  },

  declareWalkover: ({ matchId, winnerId, winnerIsTeamA }) => {
    set(state => {
      const match = state.matches.find(m => m.id === matchId)
      if (!match) return state

      const winnerName = winnerIsTeamA ? match.team_a_name : match.team_b_name
      const winnerLogo = winnerIsTeamA ? match.team_a_logo : match.team_b_logo
      const loserId    = winnerIsTeamA ? match.team_b_id   : match.team_a_id
      const loserName  = winnerIsTeamA ? match.team_b_name : match.team_a_name
      const loserLogo  = winnerIsTeamA ? match.team_b_logo : match.team_a_logo

      let next = state.matches.map(m =>
        m.id === matchId
          ? {
              ...m,
              team_a_score: winnerIsTeamA ? 2 : 0,
              team_b_score: winnerIsTeamA ? 0 : 2,
              winner_id: winnerId,
              status: "walkover" as const,
            }
          : m
      )

      const prog = PROGRESSION[matchId]
      if (prog?.winner) {
        next = advanceTeam(next, winnerId, winnerName, winnerLogo, prog.winner)
      }
      if (prog?.loser) {
        next = advanceTeam(next, loserId, loserName, loserLogo, prog.loser)
      }

      return { matches: next }
    })
  },

  resetMatch: (matchId) => {
    set(state => {
      const original = mockMatches.find(m => m.id === matchId)
      if (!original) return state
      return {
        matches: state.matches.map(m => m.id === matchId ? original : m),
      }
    })
  },
}))
