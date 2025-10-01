import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './supabase-browser'

let channel: RealtimeChannel | null = null
let currentConversationId: string | null = null
let statusHandlers: Array<(status: string) => void> = []
let insertHandlers: Array<(payload: any) => void> = []
let subscribed = false
let connecting = false

const notifyStatus = (s: string) => {
  statusHandlers.forEach((cb) => {
    try { cb(s) } catch {}
  })
}

export const isConnected = () => subscribed
export const getConversationId = () => currentConversationId

export async function connect(conversationId: string) {
  if (channel && currentConversationId === conversationId) {
    return channel
  }
  if (connecting) return channel
  connecting = true
  try {
    currentConversationId = conversationId
    // Clean up any previous channel
    if (channel) {
      try { await channel.unsubscribe() } catch {}
      channel = null
      subscribed = false
    }

    channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        insertHandlers.forEach((cb) => {
          try { cb(payload) } catch {}
        })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') subscribed = true
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') subscribed = false
        notifyStatus(status)
      })

    // Failsafe: after 3s, if not subscribed, try once more
    setTimeout(async () => {
      if (!subscribed && currentConversationId === conversationId) {
        try {
          await channel?.unsubscribe()
        } catch {}
        channel = supabase
          .channel(`messages:${conversationId}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            insertHandlers.forEach((cb) => {
              try { cb(payload) } catch {}
            })
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') subscribed = true
            if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') subscribed = false
            notifyStatus(status)
          })
      }
    }, 3000)

    return channel
  } finally {
    connecting = false
  }
}

export function onStatus(cb: (status: string) => void) {
  statusHandlers.push(cb)
  return () => {
    statusHandlers = statusHandlers.filter((f) => f !== cb)
  }
}

export function onInsert(cb: (payload: any) => void) {
  insertHandlers.push(cb)
  return () => {
    insertHandlers = insertHandlers.filter((f) => f !== cb)
  }
}

export async function disconnect() {
  try { await channel?.unsubscribe() } catch {}
  channel = null
  currentConversationId = null
  subscribed = false
}

// Reconnect on network come-back or tab visibility
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    if (currentConversationId) connect(currentConversationId)
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && currentConversationId) connect(currentConversationId)
  })
}
