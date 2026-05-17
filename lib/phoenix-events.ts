// Requer: npm install phoenix
import { Socket, type Channel } from 'phoenix'

let socket: Socket | null = null

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[2]) : null
}

export function getSocket(): Socket {
  if (socket) return socket

  const eventsUrl = process.env.NEXT_PUBLIC_EVENTS_URL ?? 'ws://localhost:4000/socket'
  const token = getCookie('arena_token')

  socket = new Socket(eventsUrl, {
    params: token ? { token } : {},
    logger: (kind, msg, data) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Phoenix][${kind}] ${msg}`, data)
      }
    },
  })

  socket.connect()
  return socket
}

export function joinChannel(topic: string): Channel {
  const ch = getSocket().channel(topic, {})
  ch.join().receive('error', ({ reason }) => {
    console.error(`[Phoenix] Failed to join ${topic}:`, reason)
  })
  return ch
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
