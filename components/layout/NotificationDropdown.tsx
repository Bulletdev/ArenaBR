'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useNotificationsStore } from '@/stores/notifications'

const TYPE_LABELS: Record<string, string> = {
  match_result: 'Resultado',
  tournament:   'Torneio',
  invite:       'Convite',
  system:       'Sistema',
}

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsStore()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  function handleNotificationClick(n: (typeof notifications)[0]) {
    if (!n.is_read) markAsRead(n.id)
    if (n.link_url) router.push(n.link_url)
    onClose()
  }

  return (
    <div
      ref={ref}
      className="fixed w-80 panel border-border shadow-xl z-50 overflow-hidden"
      style={{ left: '11rem', bottom: '5rem', maxHeight: '420px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="font-display text-sm text-text">NOTIFICACOES</p>
        {unreadCount > 0 && (
          <button
            className="text-xs text-muted hover:text-crimson transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onClick={markAllAsRead}
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            <p>Nenhuma notificacao</p>
          </div>
        ) : (
          notifications.map((n) => {
            const typeLabel = TYPE_LABELS[n.type] ?? n.type
            return (
              <button
                key={n.id}
                className="w-full text-left px-4 py-3 border-b border-border hover:bg-elevated transition-colors"
                style={{ background: n.is_read ? 'transparent' : 'rgba(185,28,28,0.04)' }}
                onClick={() => handleNotificationClick(n)}
                aria-label={`${typeLabel}: ${n.title}`}
              >
                <div className="flex items-start gap-2">
                  {!n.is_read && (
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: 'var(--color-crimson)' }}
                    />
                  )}
                  <div className={!n.is_read ? '' : 'ml-3.5'}>
                    <p className="text-sm text-text font-medium leading-snug">{n.title}</p>
                    <p className="text-xs text-muted mt-0.5 leading-snug">{n.message}</p>
                    <p className="text-xs text-muted mt-1 opacity-60">
                      {new Date(n.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
