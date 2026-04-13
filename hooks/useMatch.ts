"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tournamentApi } from "@/lib/api"
import { tournamentKeys } from "./useTournament"

// ─── Query keys ───────────────────────────────────────────────
export const matchKeys = {
  detail: (tournamentId: string, matchId: string) =>
    ["tournaments", tournamentId, "matches", matchId] as const,
  report: (tournamentId: string, matchId: string) =>
    ["tournaments", tournamentId, "matches", matchId, "report"] as const,
}

// ─── Single match detail ──────────────────────────────────────
export function useMatch(tournamentId: string, matchId: string) {
  return useQuery({
    queryKey: matchKeys.detail(tournamentId, matchId),
    queryFn:  () => tournamentApi.getMatch(tournamentId, matchId).then(r => r.data ?? null),
    staleTime: 15_000,
    enabled:  !!tournamentId && !!matchId,
  })
}

// ─── Match report ──────────────────────────────────────────────
export function useMatchReport(tournamentId: string, matchId: string) {
  return useQuery({
    queryKey: matchKeys.report(tournamentId, matchId),
    queryFn:  () => tournamentApi.getReport(tournamentId, matchId).then(r => r.data ?? null),
    staleTime: 15_000,
    enabled:  !!tournamentId && !!matchId,
  })
}

// ─── Check-in ─────────────────────────────────────────────────
export function useCheckin(tournamentId: string, matchId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => tournamentApi.checkin(tournamentId, matchId).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.detail(tournamentId, matchId) })
      qc.invalidateQueries({ queryKey: tournamentKeys.matches(tournamentId) })
    },
  })
}

// ─── Submit report ────────────────────────────────────────────
export function useSubmitReport(tournamentId: string, matchId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { team_a_score: number; team_b_score: number; evidence_url: string }) =>
      tournamentApi.submitReport(tournamentId, matchId, payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.detail(tournamentId, matchId) })
      qc.invalidateQueries({ queryKey: matchKeys.report(tournamentId, matchId) })
      qc.invalidateQueries({ queryKey: tournamentKeys.matches(tournamentId) })
    },
  })
}

// ─── Admin resolve dispute ────────────────────────────────────
export function useAdminResolve(tournamentId: string, matchId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (winnerId: string) =>
      tournamentApi.adminResolveDispute(tournamentId, matchId, winnerId).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.detail(tournamentId, matchId) })
      qc.invalidateQueries({ queryKey: tournamentKeys.matches(tournamentId) })
      qc.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) })
    },
  })
}
