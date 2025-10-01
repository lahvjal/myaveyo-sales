'use client'

import { useState } from 'react'
import { useChat } from '@/components/chat/ChatProvider'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-browser'
import { siteUrl } from '@/lib/siteUrl'

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
  onMenuToggle
}: TopBarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab)
  const { open: chatOpen, setOpen: setChatOpen, unread } = useChat()

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

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
              className="h-[24px] w-[24px] relative shrink-0 sm:pointer-events-none"
              aria-label="Toggle menu"
            >
              <Image 
                src={icon}
                alt={`${title} Icon`}
                width={50}
                height={50}
                className="size-full"
              />
            </button>
            <div className="font-black leading-[0] not-italic relative shrink-0 text-[40px] text-nowrap text-white font-inter">
              {title}
            </div>
          </div>
          
          {/* Breadcrumb Navigation or Tab Navigation */}
          {breadcrumbs ? (
            <div className="content-stretch flex gap-[10px] items-center justify-start relative shrink-0">
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
            <div className="content-stretch flex gap-[20px] items-center justify-start relative shrink-0">
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
        </div>
        
        {/* Right side - Profile / Actions */}
        {showProfile && (
          <div className="flex items-center gap-3">
            {/* <div className="relative shrink-0 size-[30px]">
              <Image 
                src="/images/c75767911e539a98cf3080c76af0df77e6a62117.png"
                alt="Profile"
                width={30}
                height={30}
                className="size-full rounded-full"
              />
            </div> */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              aria-pressed={chatOpen}
              title={chatOpen ? 'Hide chat' : 'Show chat'}
              className={`
                relative shrink-0 size-[45px] rounded-[8px] flex items-center justify-center
                transition-all duration-200 ease-in-out group
                ${chatOpen 
                  ? 'bg-white/10 shadow-lg' 
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
                <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-[20px] bg-white rounded-l-full" />
              )}
            </button>
            <button
              onClick={async () => {
                try {
                  await supabase.auth.signOut()
                } finally {
                  const params = new URLSearchParams(window.location.search)
                  const redirect = params.get('redirect')
                  const target = redirect || '/login'
                  // Use absolute URL to ensure correct domain (esp. prod subdomain)
                  const url = '/login'
                  window.location.replace(url)
                }
              }}
              className="px-3 py-1.5 rounded-[4px] bg-white text-black text-sm font-telegraf hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
