"use client"

import React, { useEffect, useRef, useState } from "react"
import { useChat } from "./ChatProvider"
import Button from "../Button"
import Image from "next/image"

export default function ChatDock() {
  const { open, setOpen, messages, sendMessage } = useChat()
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom on new messages or when opening the dock
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length, open])

  const handleSend = async () => {
    await sendMessage(value)
    setValue("")
    inputRef.current?.focus()
  }

  if (!open) return null

  const Panel = (
    <>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between h-[94px]">
        <div className="flex gap-[10px] items-center justify-start relative">
          <div className="h-[auto] relative shrink-0 w-[24px]">
            <Image 
              src="/images/msg-icon.png"
              alt="Chat Icon"
              width={50}
              height={50}
              className="size-full"
            />
          </div>
          <div className="font-black not-italic relative text-[40px] text-nowrap text-white font-inter">
            Chat
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-white/60 hover:text-white"
          aria-label="Close chat"
        >
          <Image src="/images/X-icon.png" alt="Close Icon" width={24} height={24} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3" ref={listRef} >
        {messages.map(m => {
          const nameColor = m.userName === 'You' ? '#F414D6' : (m.userRole === 'admin' ? '#E5780C' : '#259EFB')
          return (
            <div key={m.id} className="text-sm">
              <div className="text-white/70">
                <span className="font-medium" style={{ color: nameColor }}>{m.userName}</span>
                <span className="text-white/40"> {new Date(m.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="text-white/90 whitespace-pre-wrap">{m.content}</div>
            </div>
          )
        })}
      </div>

      {/* Composer */}
      <div className="">
        <div className="bg-[#111111] rounded focus-within:bg-[#000000]">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="w-full bg-transparent text-white text-sm resize-none p-6 outline-none"
            rows={2}
            placeholder="Your message"
          />
          <div className="flex justify-end px-2 pb-2">
            <Button variant="primary" onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 z-50 sm:hidden">
        <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden />
        <div className="absolute inset-0 bg-[#131313] flex flex-col">
          {Panel}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className="hidden sm:flex h-screen sticky top-0 shrink-0 bg-[#131313] flex-col"
        style={{ width: 400 }}
      >
        {Panel}
      </div>
    </>
  )
}
