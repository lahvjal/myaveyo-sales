'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import HomePageManagementCard from './HomePageManagementCard'

interface CMSSection {
  id: string
  title: string
  description: string
  href: string
  status: 'active' | 'coming-soon'
  icon?: string
}

interface CMSTab {
  id: string
  name: string
  sections: CMSSection[]
}

const CMS_TABS: CMSTab[] = [
  {
    id: 'home',
    name: 'Home Page',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        description: 'Edit welcome text, headings, and CTA buttons',
        href: '/user/hero',
        status: 'coming-soon'
      },
      {
        id: 'stats',
        title: 'Stats Section',
        description: 'Update homepage statistics and metrics',
        href: '/user/home-stats',
        status: 'active'
      },
      {
        id: 'sales',
        title: 'Sales Section',
        description: 'Manage sales content and images',
        href: '/user/sales',
        status: 'active'
      },
      {
        id: 'inside',
        title: 'On The Inside',
        description: 'Edit Culture, Training, Lifestyle, and Growth blocks',
        href: '/user/inside',
        status: 'coming-soon'
      },
      {
        id: 'careers',
        title: 'Build Careers',
        description: 'Update career building content',
        href: '/user/careers',
        status: 'coming-soon'
      },
      {
        id: 'logos',
        title: 'Logo Banner',
        description: 'Manage rotating logo carousel',
        href: '/user/logos',
        status: 'coming-soon'
      }
    ]
  },
  {
    id: 'incentives',
    name: 'Incentives Page',
    sections: [
      {
        id: 'incentives-manage',
        title: 'Manage Incentives',
        description: 'Create, edit, and delete incentive programs',
        href: '/user/incentives',
        status: 'active'
      },
      {
        id: 'incentives-analytics',
        title: 'Incentive Analytics',
        description: 'View performance metrics and engagement stats',
        href: '/user/incentives/analytics',
        status: 'coming-soon'
      }
    ]
  },
  {
    id: 'reviews',
    name: 'Reviews Page',
    sections: [
      {
        id: 'reviews-manage',
        title: 'Manage Reviews',
        description: 'Upload, edit, and organize customer review videos',
        href: '/user/reviews',
        status: 'active'
      },
      {
        id: 'reviews-moderation',
        title: 'Content Moderation',
        description: 'Review and approve submitted content',
        href: '/user/reviews/moderation',
        status: 'coming-soon'
      }
    ]
  }
]

interface CMSContentAreaProps {
  className?: string
}

export default function CMSContentArea({ className = '' }: CMSContentAreaProps) {
  const [activeTab, setActiveTab] = useState('home')
  
  const currentTab = CMS_TABS.find(tab => tab.id === activeTab)

  return (
    <div className={`basis-0 content-stretch flex flex-col gap-[10px] grow items-start justify-start min-h-px min-w-px relative shrink-0 ${className}`}>
      {/* Main Content Area */}
      <div className="box-border content-stretch flex flex-col gap-[70px] items-start justify-start px-[150px] py-[30px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[20px] items-start justify-start relative shrink-0 w-full">
          {/* Section Title */}
          <div className="content-stretch flex gap-[10px] items-center justify-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
              <div className="h-[12px] relative shrink-0 w-[12.001px]">
                <Image 
                  src="/images/0ac03851509f4a98cfd3f26ab7414ff754908f3a.svg"
                  alt="Section Icon"
                  width={12}
                  height={12}
                  className="size-full"
                />
              </div>
              <div className="font-telegraf font-extrabold leading-[0] not-italic relative shrink-0 text-[20px] text-nowrap text-white">
                {currentTab?.name} Management
              </div>
            </div>
          </div>

          {/* Content Sections Grid */}
          <div className="gap-[20px] grid grid-cols-3 grid-rows-2 h-[346px] relative shrink-0 w-full">
            {currentTab?.sections.map((section) => (
              <HomePageManagementCard
                key={section.id}
                title={section.title}
                description="Click to manage"
                status={section.status}
                onClick={() => {
                  if (section.status === 'active') {
                    window.location.href = section.href
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
