'use client'
import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { joinChannel } from '@/lib/phoenix-events'
import { tournamentKeys } from './useTournament'
import { matchKeys } from './useMatch'
import type { Channel } from 'phoenix'

interface MatchConfirmedPayload {
  match_id: string
  tournament_id: string
  team_a_score: number
  team_b_score: number
  winner_id: string
}

interface MatchWalkoverPayload {
  match_id: string
  tournament_id: string
  winner_id: string
}

/**
 * Subscribes to the Phoenix tournament channel for a given tournament.
 * Invalidates React Query caches when match results are broadcast,
 * keeping the bracket and match list in sync without polling.
 * Runs in parallel with the existing ActionCable TournamentChannel.
 */
export function usePhoenixTournament(tournamentId: string | undefined) {
  const queryClient = useQueryClient()
  const channelRef = useRef<Channel | null>(null)

  useEffect(() => {
    if (!tournamentId) return
    if (typeof window === 'undefined') return

    const topic = `tournament:${tournamentId}`
    const channel = joinChannel(topic)
    channelRef.current = channel

    channel.on('tournament_match.confirmed', (payload: MatchConfirmedPayload) => {
      queryClient.invalidateQueries({ queryKey: tournamentKeys.matches(tournamentId) })
      queryClient.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) })

      if (payload.match_id) {
        queryClient.invalidateQueries({
          queryKey: matchKeys.detail(tournamentId, payload.match_id),
        })
      }

      toast.info(`Resultado confirmado: ${payload.team_a_score} x ${payload.team_b_score}`)
    })

    channel.on('tournament_match.walkover', (payload: MatchWalkoverPayload) => {
      queryClient.invalidateQueries({ queryKey: tournamentKeys.matches(tournamentId) })
      queryClient.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) })

      if (payload.match_id) {
        queryClient.invalidateQueries({
          queryKey: matchKeys.detail(tournamentId, payload.match_id),
        })
      }

      toast.info('Partida encerrada por W.O.')
    })

    return () => {
      channel.leave()
      channelRef.current = null
    }
  }, [tournamentId, queryClient])
}
