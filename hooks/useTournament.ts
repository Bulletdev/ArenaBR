"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tournamentApi } from "@/lib/api"

// ─── Query keys ───────────────────────────────────────────────
export const tournamentKeys = {
  all:     ()           => ["tournaments"]             as const,
  list:    ()           => ["tournaments", "list"]     as const,
  detail:  (id: string) => ["tournaments", id]         as const,
  matches: (id: string) => ["tournaments", id, "matches"] as const,
  teams:   (id: string) => ["tournaments", id, "teams"]   as const,
}

// ─── List all tournaments ─────────────────────────────────────
export function useTournaments() {
  return useQuery({
    queryKey: tournamentKeys.list(),
    queryFn:  () => tournamentApi.list().then(r => r.data ?? []),
    staleTime: 60_000,
  })
}

// ─── Single tournament ────────────────────────────────────────
export function useTournament(id: string) {
  return useQuery({
    queryKey: tournamentKeys.detail(id),
    queryFn:  () => tournamentApi.show(id).then(r => r.data ?? null),
    staleTime: 30_000,
    enabled:  !!id,
  })
}

// ─── Tournament matches ───────────────────────────────────────
export function useTournamentMatches(tournamentId: string) {
  return useQuery({
    queryKey: tournamentKeys.matches(tournamentId),
    queryFn:  () => tournamentApi.getMatches(tournamentId).then(r => r.data ?? []),
    staleTime: 15_000,
    enabled:  !!tournamentId,
  })
}

// ─── Tournament teams ─────────────────────────────────────────
export function useTournamentTeams(tournamentId: string) {
  return useQuery({
    queryKey: tournamentKeys.teams(tournamentId),
    queryFn:  () => tournamentApi.getTeams(tournamentId).then(r => r.data ?? []),
    staleTime: 30_000,
    enabled:  !!tournamentId,
  })
}

// ─── Create tournament (admin) ────────────────────────────────
export function useCreateTournament() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<import("@/types").Tournament>) =>
      tournamentApi.create(payload).then(r => r.data ?? null),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tournamentKeys.list() })
    },
  })
}

// ─── Update tournament (admin) ────────────────────────────────
export function useUpdateTournament(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<import("@/types").Tournament>) =>
      tournamentApi.update(id, payload).then(r => r.data ?? null),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tournamentKeys.detail(id) })
      qc.invalidateQueries({ queryKey: tournamentKeys.list() })
    },
  })
}

// ─── Enroll team ──────────────────────────────────────────────
export function useEnrollTeam(tournamentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { team_name?: string; team_tag?: string; logo_url?: string }) =>
      tournamentApi.enrollTeam(tournamentId, payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tournamentKeys.teams(tournamentId) })
      qc.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) })
    },
  })
}

// ─── Approve / reject team (admin) ───────────────────────────
export function useApproveTeam(tournamentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (teamId: string) =>
      tournamentApi.approveTeam(tournamentId, teamId).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tournamentKeys.teams(tournamentId) })
    },
  })
}

export function useRejectTeam(tournamentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (teamId: string) =>
      tournamentApi.rejectTeam(tournamentId, teamId).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tournamentKeys.teams(tournamentId) })
    },
  })
}

// ─── Generate bracket (admin) ────────────────────────────────
export function useGenerateBracket(tournamentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => tournamentApi.generateBracket(tournamentId).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) })
      qc.invalidateQueries({ queryKey: tournamentKeys.matches(tournamentId) })
    },
  })
}
