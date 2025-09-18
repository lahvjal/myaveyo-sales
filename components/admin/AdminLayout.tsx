'use client'

import { ReactNode } from 'react'
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
  
  // Get page configuration based on pageKey or pathname
  const resolvedPageKey = pageKey || getPageKeyFromPath(pathname)
  const pageConfig = getAdminPageConfig(resolvedPageKey)
  
  // Use provided props or fall back to page config
  const finalTitle = topBarTitle || pageConfig.title
  const finalIcon = topBarIcon || pageConfig.icon
  const finalTabs = topBarTabs || pageConfig.tabs

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${className}`}>
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
          />
        )}
        
        {/* Page Content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
