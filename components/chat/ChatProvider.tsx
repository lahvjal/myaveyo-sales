"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from '@/lib/supabase-browser'

export type ChatMessage = {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
  userRole?: string
}

interface ChatContextValue {
  open: boolean
  setOpen: (v: boolean) => void
  messages: ChatMessage[]
  sendMessage: (content: string) => Promise<void>
  unread: number
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const roleCache = React.useRef<Map<string, string>>(new Map())
  const [unread, setUnread] = useState<number>(0)

  // Clear unread when opened
  useEffect(() => {
    if (open && unread) setUnread(0)
  }, [open])

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || !conversationId) return
    try {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id
      if (!uid) {
        setLastError('Not authenticated')
        return
      }
      setMyId(uid)
      // Optimistic append
      const optimistic: ChatMessage = {
        id: `tmp-${Date.now()}`,
        userId: uid,
        userName: 'You',
        content: trimmed,
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, optimistic])

      const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, user_id: uid, content: trimmed })
      if (error) {
        console.error('[chat] insert error', error)
        setLastError(error.message)
        // Rollback optimistic (optional). We keep it for now; can reconcile on reload.
        return
      }
      // Realtime will deliver it; no need to optimistically append unless channel is slow
    } catch (e: any) {
      console.error('[chat] insert exception', e)
      setLastError(e?.message || 'Unexpected error')
    }
  }, [conversationId])

  // Bootstrap + load + subscribe
  useEffect(() => {
    let mounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null
    const init = async () => {
      try {
        // Ensure membership and get conversation ID
        const res = await fetch('/api/chat/bootstrap', { cache: 'no-store' })
        if (!res.ok) {
          const t = await res.text().catch(() => '')
          console.error('[chat/bootstrap] failed', res.status, t)
          setLastError('Chat bootstrap failed')
          return
        }
        const { conversationId } = await res.json()
        if (!mounted) return
        setConversationId(conversationId)
        console.log('[chat] bootstrapped conversation', conversationId)

        // Load last messages
        const { data, error: loadErr } = await supabase
          .from('messages')
          .select('id, user_id, content, created_at')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(200)
        if (loadErr) {
          console.error('[chat] load messages error', loadErr)
          setLastError(loadErr.message)
        }

        const { data: user } = await supabase.auth.getUser()
        const myIdLocal = user.user?.id || null
        setMyId(myIdLocal)

        // Fetch roles for distinct other participants
        const ids = Array.from(new Set((data || []).map((m: any) => m.user_id))).filter((id: string) => !!id)
        const toFetch = ids.filter((id: string) => !roleCache.current.has(id))
        if (toFetch.length > 0) {
          const { data: userRows, error: rolesErr } = await supabase
            .from('users')
            .select('id, role')
            .in('id', toFetch)
          if (rolesErr) {
            console.warn('[chat] roles fetch error', rolesErr)
          } else {
            (userRows || []).forEach((u: any) => roleCache.current.set(u.id, u.role))
          }
        }

        const mapped = (data || []).map((m: any) => ({
          id: m.id,
          userId: m.user_id,
          userName: m.user_id === myIdLocal ? 'You' : 'Member',
          content: m.content,
          createdAt: m.created_at,
          userRole: roleCache.current.get(m.user_id) || undefined,
        })) as ChatMessage[]
        if (mounted) setMessages(mapped)

        // Subscribe
        channel = supabase
          .channel(`messages:${conversationId}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
            const m: any = payload.new
            console.log('[chat] realtime insert', m)
            const role = roleCache.current.get(m.user_id)
            const msg: ChatMessage = {
              id: m.id,
              userId: m.user_id,
              userName: m.user_id === (myId || '') ? 'You' : 'Member',
              content: m.content,
              createdAt: m.created_at,
              userRole: role,
            }
            setMessages(prev => [...prev, msg])
            if (!open && m.user_id !== myId) setUnread(u => u + 1)
          })
          .subscribe((status) => {
            console.log('[chat] channel status', status)
          })
      } catch (e) {
        // noop
      }
    }
    init()
    return () => {
      mounted = false
      channel?.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ open, setOpen, messages, sendMessage, unread }), [open, messages, sendMessage, unread])

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used within ChatProvider")
  return ctx
}
