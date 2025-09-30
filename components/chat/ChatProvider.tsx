"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
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
  const [open, setOpen] = useState<boolean>(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const myIdRef = useRef<string | null>(null)
  const roleCache = React.useRef<Map<string, string>>(new Map())
  const nameCache = React.useRef<Map<string, string>>(new Map())
  const [myRepId, setMyRepId] = useState<string | null>(null)
  const [myDisplayName, setMyDisplayName] = useState<string | null>(null)

  const formatName = (id: string, fallbackRole?: string) => {
    if (id === (myId || '')) return 'You'
    const cached = nameCache.current.get(id)
    if (cached) return cached
    return fallbackRole === 'admin' ? 'Member' : 'Member'
  }

  const fromRepName = (repName?: string | null) => {
    if (!repName) return null
    const parts = String(repName).trim().split(/\s+/)
    if (parts.length === 0) return null
    const first = parts[0]
    const lastInitial = parts.length > 1 ? (parts[parts.length - 1][0] || '').toUpperCase() : ''
    return lastInitial ? `${first} ${lastInitial}.` : first
  }
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
      myIdRef.current = uid
      // Ensure we have sender metadata via users.email -> sales_reps.rep_email
      let repId = myRepId
      let displayName = myDisplayName
      if (!repId || !displayName) {
        const { data: urow } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', uid)
          .limit(1)
          .single()
        const email = (urow as any)?.email as string | undefined
        const myRole = (urow as any)?.role as string | undefined
        if (email) {
          const { data: rep } = await supabase
            .from('sales_reps')
            .select('rep_name, rep_id, rep_email')
            .eq('rep_email', email)
            .limit(1)
            .single()
          repId = (rep as any)?.rep_id || null
          const dn = fromRepName((rep as any)?.rep_name)
          if (dn) displayName = dn
        }
        if (repId) setMyRepId(repId)
        if (displayName) setMyDisplayName(displayName)
        if (myRole) roleCache.current.set(uid, myRole)
      }
      const isAdmin = (
        (userData.user as any)?.user_metadata?.isAdmin === true
        || roleCache.current.get(uid) === 'admin'
      )
      const { error } = await supabase.from('messages').insert({ 
        conversation_id: conversationId, 
        user_id: uid, 
        content: trimmed,
        user_rep_id: repId,
        user_display_name: displayName,
        user_is_admin: isAdmin,
      })
      if (error) {
        setLastError(error.message)
        return
      }
      // Realtime will deliver it; no need to optimistically append unless channel is slow
    } catch (e: any) {
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
          await res.text().catch(() => '')
          setLastError('Chat bootstrap failed')
          return
        }
        const { conversationId } = await res.json()
        if (!mounted) return
        setConversationId(conversationId)
        

        // Load last messages
        const { data, error: loadErr } = await supabase
          .from('messages')
          .select('id, user_id, content, created_at, user_display_name, user_rep_id, user_is_admin')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(200)
        if (loadErr) {
          setLastError(loadErr.message)
        }

        const { data: user } = await supabase.auth.getUser()
        const myIdLocal = user.user?.id || null
        setMyId(myIdLocal)
        myIdRef.current = myIdLocal

        // Fetch roles/rep_id for distinct participants
        const ids = Array.from(new Set((data || []).map((m: any) => m.user_id))).filter((id: string) => !!id)
        const toFetch = ids.filter((id: string) => !roleCache.current.has(id) || !nameCache.current.has(id))
        if (toFetch.length > 0) {
          const { data: userRows, error: usersErr } = await supabase
            .from('users')
            .select('id, role, email')
            .in('id', toFetch)
          if (usersErr) {
            console.warn('[chat] users fetch error', usersErr)
          } else {
            (userRows || []).forEach((u: any) => {
              if (u?.role) roleCache.current.set(u.id, u.role)
            })
            const emails = Array.from(new Set((userRows || []).map((u: any) => u?.email).filter(Boolean)))
            if (emails.length) {
              const { data: reps, error: repsErr } = await supabase
                .from('sales_reps')
                .select('rep_name, rep_email, rep_id')
                .in('rep_email', emails)
              if (!repsErr) {
                const nameByEmail = new Map<string, { dn: string, rep_id?: string }>()
                ;(reps || []).forEach((r: any) => {
                  const dn = fromRepName(r?.rep_name)
                  if (dn) nameByEmail.set(r.rep_email, { dn, rep_id: r.rep_id })
                })
                ;(userRows || []).forEach((u: any) => {
                  const hit = nameByEmail.get(u.email)
                  if (hit?.dn) nameCache.current.set(u.id, hit.dn)
                })
              }
            }
          }
        }

        const mapped = (data || []).map((m: any) => ({
          id: m.id,
          userId: m.user_id,
          userName: m.user_id === myIdLocal ? 'You' : (m.user_display_name || 'Member'),
          content: m.content,
          createdAt: m.created_at,
          userRole: m.user_is_admin ? 'admin' : (roleCache.current.get(m.user_id) || undefined),
        })) as ChatMessage[]
        if (mounted) setMessages(mapped)

        // Subscribe
        channel = supabase
          .channel(`messages:${conversationId}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            const m: any = payload.new
            if (m?.conversation_id !== conversationId) return
            const role = m.user_is_admin ? 'admin' : (roleCache.current.get(m.user_id))
            const msg: ChatMessage = {
              id: m.id,
              userId: m.user_id,
              userName: m.user_id === (myIdRef.current || '') ? 'You' : (m.user_display_name || 'Member'),
              content: m.content,
              createdAt: m.created_at,
              userRole: role,
            }
            setMessages(prev => [...prev, msg])
            if (!open && m.user_id !== myId) setUnread(u => u + 1)
          })
          .subscribe()
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
