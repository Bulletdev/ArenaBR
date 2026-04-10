"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

// Jogador auto-cadastrado via ArenaBR (token entity_type: 'player')
export interface PlayerSession {
  id: number
  summoner_name: string
  player_email: string
  discord_user_id: string | null
  role: string
  status: string
  organization_id: number | null
  organization_name: string | null
  is_free_agent: boolean
  solo_queue_tier: string | null
  solo_queue_rank: string | null
  solo_queue_lp: number | null
  current_rank: string | null
  avatar_url: string | null
}

interface AuthState {
  // Staff (coach/owner/analista) — token user
  user: User | null
  // Jogador auto-cadastrado — token player
  player: PlayerSession | null
  isAuthenticated: boolean
  setAuth: (user: User) => void
  setPlayerAuth: (player: PlayerSession) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      player: null,
      isAuthenticated: false,

      setAuth: (user) => set({ user, player: null, isAuthenticated: true }),

      setPlayerAuth: (player) => set({ player, user: null, isAuthenticated: true }),

      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
        set({ user: null, player: null, isAuthenticated: false })
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "arena-auth",
      partialize: (state) => ({
        user: state.user,
        player: state.player,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
