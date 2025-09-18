'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
}

const DEFAULT_TABS: TopBarTab[] = [
  { id: 'home', name: 'Home Page' },
  { id: 'incentives', name: 'Incentives Page' },
  { id: 'reviews', name: 'Reviews Page' }
]

export default function TopBar({ 
  title = 'CMS',
  icon = '/images/16d82f801100a4d0fca41534110993bbb8ff7a62.svg',
  tabs = DEFAULT_TABS,
  activeTab = 'home',
  onTabChange,
  showProfile = true,
  className = '',
  breadcrumbs
}: TopBarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className={`bg-[#0d0d0d] box-border content-stretch flex gap-[30px] h-[94px] items-center justify-start px-[20px] py-0 relative shrink-0 w-full border-b border-[#121212] ${className}`}>
      <div className="basis-0 box-border content-stretch flex grow items-center justify-between min-h-px min-w-px px-0 py-[14px] relative shrink-0">
        {/* Left side - Title and navigation */}
        <div className="content-stretch flex gap-[30px] items-center justify-start relative shrink-0">
          {/* Title with icon */}
          <div className="content-stretch flex gap-[10px] items-center justify-start relative shrink-0">
            <div className="h-[23.905px] relative shrink-0 w-[24px]">
              <Image 
                src={icon}
                alt={`${title} Icon`}
                width={24}
                height={24}
                className="size-full"
              />
            </div>
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
        
        {/* Right side - Profile */}
        {showProfile && (
          <div className="relative shrink-0 size-[30px]">
            <Image 
              src="/images/c75767911e539a98cf3080c76af0df77e6a62117.png"
              alt="Profile"
              width={30}
              height={30}
              className="size-full rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
          </div>
        )}
      </div>
    </div>
  )
}
