'use client'
import { useEffect } from 'react'
import { joinChannel } from '@/lib/phoenix-events'
import { useNotificationsStore, type AppNotification } from '@/stores/notifications'

interface UseNotificationsOptions {
  userId: number | string | undefined
}

/**
 * Subscribes to the Phoenix notifications channel for the given user.
 * Pushes incoming notifications into the Zustand store so any component
 * reading useNotificationsStore stays reactive without prop-drilling.
 */
export function useNotifications({ userId }: UseNotificationsOptions) {
  const addNotification = useNotificationsStore((s) => s.addNotification)

  useEffect(() => {
    if (!userId) return
    if (typeof window === 'undefined') return

    const topic = `notifications:${userId}`
    const channel = joinChannel(topic)

    channel.on('notification.created', (payload: AppNotification) => {
      addNotification(payload)
    })

    return () => {
      channel.leave()
    }
  }, [userId, addNotification])
}
