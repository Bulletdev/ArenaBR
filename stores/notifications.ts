import { create } from 'zustand'

export interface AppNotification {
  id: number
  title: string
  message: string
  type: string
  link_url?: string
  is_read: boolean
  created_at: string
}

interface NotificationsState {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (n: AppNotification) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  setNotifications: (ns: AppNotification[]) => void
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + (n.is_read ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),

  setNotifications: (ns) =>
    set({
      notifications: ns,
      unreadCount: ns.filter((n) => !n.is_read).length,
    }),
}))
