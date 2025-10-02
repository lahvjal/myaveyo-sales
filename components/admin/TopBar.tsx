'use client'

import { useState } from 'react'
import { useChat } from '@/components/chat/ChatProvider'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-browser'
import { siteUrl } from '@/lib/siteUrl'
import Button from '../Button'

interface TopBarTab {
  id: string
  name: string
  href?: string
}

interface BreadcrumbItem {
  name: string
  href?: string
}

interface TopBarProps {
  title?: string
  icon?: string
  tabs?: TopBarTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  showProfile?: boolean
  className?: string
  breadcrumbs?: BreadcrumbItem[]
  onMenuToggle?: () => void
  fallbackBackHref?: string
  showMobileOverflow?: boolean
}

// No default tabs; tabs are opt-in per page (e.g., CMS)

export default function TopBar({ 
  title = 'Admin',
  icon = '/images/dashboard-icon.png',
  tabs = [],
  activeTab = '',
  onTabChange,
  showProfile = true,
  className = '',
  breadcrumbs,
  onMenuToggle,
  fallbackBackHref,
  showMobileOverflow = true
}: TopBarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab)
  const [mobileTrailOpen, setMobileTrailOpen] = useState(false)
  const { open: chatOpen, setOpen: setChatOpen, unread } = useChat()

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      const target = redirect || '/login'
      const url = '/login'
      window.location.replace(url)
    }
  }

  // Compute breadcrumb helpers
  const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0
  const currentCrumb = hasBreadcrumbs ? breadcrumbs![breadcrumbs!.length - 1] : undefined
  const parentCrumb = hasBreadcrumbs && breadcrumbs!.length > 1 ? breadcrumbs![breadcrumbs!.length - 2] : undefined
  const backHref = parentCrumb?.href || fallbackBackHref

  return (
    <div className={`bg-[#0d0d0d] box-border content-stretch flex gap-[30px] h-[94px] items-center justify-start px-[20px] py-0 relative shrink-0 w-full border-b border-[#121212] sticky top-0 z-40 ${className}`}>
      <div className="basis-0 box-border content-stretch flex grow items-center justify-between min-h-px min-w-px px-0 py-[14px] relative shrink-0">
        {/* Left side - Title and navigation */}
        <div className="content-stretch flex gap-[30px] items-center justify-start relative shrink-0">
          {/* Title with icon (icon is a button on mobile to toggle sidebar) */}
          <div className="content-stretch flex gap-[10px] items-center justify-start relative shrink-0">
            <button
              type="button"
              onClick={() => onMenuToggle?.()}
              className="bg-[#1d1d1d] p-[10px] rounded-[3px] h-[45px] w-[45px] relative shrink-0 sm:pointer-events-none"
              aria-label="Toggle menu"
            >
              <Image 
                src={icon}
                alt={`${title} Icon`}
                width={25}
                height={25}
                className="size-full"
              />
            </button>
            <div className="font-black leading-[0] not-italic relative shrink-0 text-[40px] text-nowrap text-white font-inter hidden sm:block">
              {title}
            </div>
          </div>
          
          {/* Breadcrumb Navigation or Tab Navigation (Desktop) */}
          {breadcrumbs ? (
            <div className="content-stretch gap-[10px] items-center justify-start relative shrink-0 hidden md:flex">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="content-stretch flex gap-[10px] items-center justify-start relative shrink-0">
                  {index > 0 && (
                    <div className="font-telegraf not-italic relative shrink-0 text-[16px] text-nowrap text-[#888d95]">
                      &gt;
                    </div>
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="font-telegraf not-italic relative shrink-0 text-[16px] text-nowrap text-white hover:opacity-80 transition-opacity duration-200"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <div className="font-telegraf not-italic relative shrink-0 text-[16px] text-nowrap text-white border-b border-white">
                      {crumb.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : tabs.length > 0 && (
            <div className="content-stretch hidden md:flex gap-[20px] items-center justify-start relative shrink-0">
              {tabs.map((tab) => (
                tab.href ? (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`relative shrink-0 transition-all duration-200 ${
                      currentTab === tab.id ? 'border-b-2 border-white' : 'hover:opacity-80'
                    }`}
                  >
                    <div className="box-border content-stretch flex flex-col gap-[20px] items-center justify-start overflow-clip px-0 py-[5px] relative">
                      <div className="font-telegraf not-italic relative shrink-0 text-[16px] text-nowrap text-white">
                        {tab.name}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative shrink-0 transition-all duration-200 ${
                      currentTab === tab.id ? 'border-b-2 border-white' : 'hover:opacity-80'
                    }`}
                  >
                    <div className="box-border content-stretch flex flex-col gap-[20px] items-center justify-start overflow-clip px-0 py-[5px] relative">
                      <div className="font-telegraf not-italic relative shrink-0 text-[16px] text-nowrap text-white">
                        {tab.name}
                      </div>
                    </div>
                  </button>
                )
              ))}
            </div>
          )}

          {/* Mobile Breadcrumb Bar */}
          {hasBreadcrumbs && (
            <div className="flex md:hidden items-center gap-3">
              {backHref && (
                <Link href={backHref} aria-label="Go back" className="p-2 bg-[#1d1d1d] -ml-2 rounded-md hover:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" d="M15.78 19.28a.75.75 0 01-1.06 0l-7-7a.75.75 0 010-1.06l7-7a.75.75 0 111.06 1.06L9.06 12l6.72 6.72a.75.75 0 010 1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
              <div className="flex-1 truncate font-telegraf text-[16px] text-white">
                {currentCrumb?.name || title}
              </div>
              {showMobileOverflow && hasBreadcrumbs && (
                <button aria-label="Show path" className="p-2 rounded-md hover:bg-white/10" onClick={() => setMobileTrailOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M12 6.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 20.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Right side - Profile / Actions */}
        {showProfile && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              aria-pressed={chatOpen}
              title={chatOpen ? 'Hide chat' : 'Show chat'}
              className={`
                relative bg-[#1d1d1d] shrink-0 size-[45px] rounded-[3px] flex items-center justify-center
                transition-all duration-200 ease-in-out group
                ${chatOpen 
                  ? 'bg-[radial-gradient(112.65%_95.85%_at_120.72%_50%,_#455062_0%,_#1A1B1C_100%)]' 
                  : 'hover:bg-white/5 hover:scale-105'
                }
              `}
            >
              <Image 
                src="/images/msg-icon.png"
                alt="Chat"
                width={25}
                height={25}
                className={`
                  transition-all duration-200
                  ${chatOpen 
                    ? 'opacity-100 scale-110' 
                    : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                  }
                `}
              />
              {!chatOpen && unread > 0 && (
                <span className="absolute -top-1 -right-1 inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
              )}
              {chatOpen && (
                <div className="absolute h-[80%] -right-[3px] top-1/2 -translate-y-1/2 w-[3px] bg-white rounded-l-full" />
              )}
            </button>
            {/* Desktop: full Logout button */}
            <div className="hidden md:block">
              <Button onClick={handleLogout} theme="dark" icon='/images/logout-icon.svg'>Logout</Button>
            </div>
            {/* Mobile: icon-only Logout button */}
            <div className="md:hidden">
              <Button iconOnly ariaLabel="Logout" onClick={handleLogout} theme="dark" icon="/images/logout-icon.svg" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Breadcrumb Sheet */}
      {showMobileOverflow && mobileTrailOpen && hasBreadcrumbs && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileTrailOpen(false)} aria-hidden />
          <div className="absolute bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#1f1f1f] rounded-t-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-telegraf text-lg">Path</div>
              <button className="p-2 rounded-md hover:bg-white/10" onClick={() => setMobileTrailOpen(false)} aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd" d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.715-4.714-4.714a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {breadcrumbs!.map((crumb, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-[#888d95]">›</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-white hover:opacity-80" onClick={() => setMobileTrailOpen(false)}>
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-white/80">{crumb.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
