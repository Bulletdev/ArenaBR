"use client"

import { create } from "zustand"
import { mockInvites } from "@/lib/mock"
import type { Invite } from "@/types"

interface InvitesState {
  invites: Invite[]
  setInvites: (invites: Invite[]) => void
  respond: (id: number, status: "accepted" | "refused") => void
}

export const useInvitesStore = create<InvitesState>()((set) => ({
  invites: mockInvites,
  setInvites: (invites) => set({ invites }),
  respond: (id, status) =>
    set((state) => ({
      invites: state.invites.map((inv) =>
        inv.id === id ? { ...inv, status } : inv
      ),
    })),
}))

export function usePendingInvites() {
  return useInvitesStore((s) => s.invites.filter((i) => i.status === "pending").length)
}
