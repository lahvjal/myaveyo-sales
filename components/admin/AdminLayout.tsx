'use client'

import { ReactNode, useState } from 'react'
import { ChatProvider } from '@/components/chat/ChatProvider'
import ChatDock from '@/components/chat/ChatDock'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import TopBar from './TopBar'
import { getAdminPageConfig, getPageKeyFromPath } from '@/lib/admin-pages'

interface TopBarTab {
  id: string
  name: string
  href?: string
}

interface BreadcrumbItem {
  name: string
  href?: string
}

interface AdminLayoutProps {
  children: ReactNode
  className?: string
  pageKey?: string
  topBarTitle?: string
  topBarIcon?: string
  topBarTabs?: TopBarTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  breadcrumbs?: BreadcrumbItem[]
  showTopBar?: boolean
  showProfile?: boolean
}

export default function AdminLayout({ 
  children, 
  className = '',
  pageKey,
  topBarTitle,
  topBarIcon,
  topBarTabs,
  activeTab,
  onTabChange,
  breadcrumbs,
  showTopBar = true,
  showProfile = true
}: AdminLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Get page configuration based on pageKey or pathname
  const resolvedPageKey = pageKey || getPageKeyFromPath(pathname)
  const pageConfig = getAdminPageConfig(resolvedPageKey)
  
  // Use provided props or fall back to page config
  const finalTitle = topBarTitle || pageConfig.title
  const finalIcon = topBarIcon || pageConfig.icon
  const finalTabs = topBarTabs || pageConfig.tabs

  return (
    <ChatProvider>
      <div className="min-h-screen bg-black flex">
        {/* Sidebar */}
        <div className="hidden sm:block">
          <AdminSidebar />
        </div>
        {/* Mobile overlay sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 w-[80vw] max-w-[320px] bg-[#0d0d0d] shadow-xl">
              <AdminSidebar expanded />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className={`md:flex-1 flex flex-col w-[100vw] max-w-[100vw] ${className}`}>
          {/* Top Bar */}
          {showTopBar && (
            <TopBar 
              title={finalTitle}
              icon={finalIcon}
              tabs={finalTabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              showProfile={showProfile}
              breadcrumbs={breadcrumbs}
              onMenuToggle={() => setMobileMenuOpen(v => !v)}
            />
          )}
          
          {/* Page Content */}
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </main>
        {/* Chat Dock (desktop) */}
        <ChatDock />
      </div>
    </ChatProvider>
  )
}
