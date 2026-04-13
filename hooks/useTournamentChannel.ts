"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import cable from "@/lib/cable"
import { tournamentKeys } from "./useTournament"
import { matchKeys } from "./useMatch"

interface ChannelEvent {
  event: string
  match_id?: string
}

/**
 * Subscribes to TournamentChannel for a given tournament.
 * Invalidates React Query caches on any backend broadcast,
 * keeping the UI in sync without polling.
 */
export function useTournamentChannel(tournamentId: string) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!cable || !tournamentId) return

    const subscription = cable.subscriptions.create(
      { channel: "TournamentChannel", tournament_id: tournamentId },
      {
        received(data: ChannelEvent) {
          qc.invalidateQueries({ queryKey: tournamentKeys.matches(tournamentId) })
          qc.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) })

          if (data.match_id) {
            qc.invalidateQueries({
              queryKey: matchKeys.detail(tournamentId, data.match_id),
            })
          }
        },
      }
    )

    return () => { subscription.unsubscribe() }
  }, [tournamentId, qc])
}
