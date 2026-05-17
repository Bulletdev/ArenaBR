'use client'
import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationDropdown from './NotificationDropdown'

/**
 * Notification bell icon with unread badge for the layout header/sidebar.
 * Reads unread count from Zustand store — updates reactively as Phoenix
 * events arrive via useNotifications hook mounted at a higher level.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const unreadCount = useNotificationsStore((s) => s.unreadCount)

  return (
    <div className="relative">
      <button
        className="relative p-2 text-muted hover:text-text transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificacoes"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-mono font-bold"
            style={{
              background: 'var(--color-crimson)',
              color: 'var(--color-text)',
              borderRadius: '2px',
              padding: '0 3px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  )
}
