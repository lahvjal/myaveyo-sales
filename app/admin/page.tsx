'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CMSSection {
  id: string
  title: string
  description: string
  href: string
  icon: string
  status: 'active' | 'coming_soon'
}

interface PageTab {
  id: string
  name: string
  icon: string
  sections: CMSSection[]
}

const PAGE_TABS: PageTab[] = [
  {
    id: 'home',
    name: 'Home Page',
    icon: '🏠',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        description: 'Edit welcome text, headings, and CTA buttons',
        href: '/admin/hero',
        icon: '🎬',
        status: 'coming_soon'
      },
      {
        id: 'stats',
        title: 'Stats Section',
        description: 'Update statistics and metrics',
        href: '/admin/stats',
        icon: '📊',
        status: 'active'
      },
      {
        id: 'sales',
        title: 'Sales Section',
        description: 'Manage sales content and images',
        href: '/admin/sales',
        icon: '💼',
        status: 'coming_soon'
      },
      {
        id: 'inside',
        title: 'On The Inside',
        description: 'Edit Culture, Training, Lifestyle, and Growth blocks',
        href: '/admin/inside',
        icon: '🔍',
        status: 'coming_soon'
      },
      {
        id: 'careers',
        title: 'Build Careers',
        description: 'Update career building content',
        href: '/admin/careers',
        icon: '🚀',
        status: 'coming_soon'
      },
      {
        id: 'logos',
        title: 'Logo Banner',
        description: 'Manage rotating logo carousel',
        href: '/admin/logos',
        icon: '🔄',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'incentives',
    name: 'Incentives',
    icon: '🎯',
    sections: [
      {
        id: 'incentives-manage',
        title: 'Manage Incentives',
        description: 'Create, edit, and delete incentive programs',
        href: '/admin/incentives',
        icon: '🎯',
        status: 'active'
      },
      {
        id: 'incentives-analytics',
        title: 'Incentive Analytics',
        description: 'View performance metrics and engagement stats',
        href: '/admin/incentives/analytics',
        icon: '📈',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'leaderboard',
    name: 'Leaderboard',
    icon: '🏆',
    sections: [
      {
        id: 'leaderboard-settings',
        title: 'Leaderboard Settings',
        description: 'Configure ranking criteria and display options',
        href: '/admin/leaderboard',
        icon: '⚙️',
        status: 'coming_soon'
      },
      {
        id: 'leaderboard-data',
        title: 'Data Management',
        description: 'Import/export sales data and manage rep profiles',
        href: '/admin/leaderboard/data',
        icon: '📊',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'reviews',
    name: 'Reviews',
    icon: '⭐',
    sections: [
      {
        id: 'reviews-manage',
        title: 'Manage Reviews',
        description: 'Upload, edit, and organize customer review videos',
        href: '/admin/reviews',
        icon: '🎥',
        status: 'active'
      },
      {
        id: 'reviews-moderation',
        title: 'Content Moderation',
        description: 'Review and approve submitted content',
        href: '/admin/reviews/moderation',
        icon: '🛡️',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'edu',
    name: 'Education',
    icon: '🎓',
    sections: [
      {
        id: 'edu-courses',
        title: 'Course Management',
        description: 'Create and manage training courses',
        href: '/admin/edu/courses',
        icon: '📚',
        status: 'coming_soon'
      },
      {
        id: 'edu-progress',
        title: 'Progress Tracking',
        description: 'Monitor rep learning progress and completion',
        href: '/admin/edu/progress',
        icon: '📈',
        status: 'coming_soon'
      }
    ]
  },
  {
    id: 'system',
    name: 'System',
    icon: '⚙️',
    sections: [
      {
        id: 'users',
        title: 'User Management',
        description: 'Manage user accounts and permissions',
        href: '/admin/users',
        icon: '👥',
        status: 'coming_soon'
      },
      {
        id: 'settings',
        title: 'Site Settings',
        description: 'Configure global site settings and preferences',
        href: '/admin/settings',
        icon: '🔧',
        status: 'coming_soon'
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'View site traffic and user engagement metrics',
        href: '/admin/analytics',
        icon: '📊',
        status: 'coming_soon'
      }
    ]
  }
]

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')

  const currentTab = PAGE_TABS.find(tab => tab.id === activeTab)
  const totalSections = PAGE_TABS.reduce((acc, tab) => acc + tab.sections.length, 0)
  const activeSections = PAGE_TABS.reduce((acc, tab) => 
    acc + tab.sections.filter(section => section.status === 'active').length, 0
  )

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="border-b border-[#333] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-telegraf font-bold">Aveyo CMS</h1>
              <p className="text-gray-400 text-sm">Content Management System</p>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[#333] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {PAGE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-telegraf font-medium">{tab.name}</span>
                <span className="bg-[#333] text-xs px-2 py-1 rounded-full">
                  {tab.sections.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-telegraf font-semibold mb-2 flex items-center gap-3">
            <span className="text-2xl">{currentTab?.icon}</span>
            {currentTab?.name} Management
          </h2>
          <p className="text-gray-400">
            Manage all content sections for the {currentTab?.name.toLowerCase()} page
          </p>
        </div>

        {/* CMS Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTab?.sections.map((section) => (
            <div
              key={section.id}
              className={`bg-[#1a1a1a] border border-[#333] rounded-lg p-6 transition-all duration-200 ${
                section.status === 'active' 
                  ? 'hover:border-white cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => {
                if (section.status === 'active') {
                  router.push(section.href)
                }
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{section.icon}</div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  section.status === 'active' 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {section.status === 'active' ? 'Active' : 'Coming Soon'}
                </div>
              </div>
              
              <h3 className="text-lg font-telegraf font-semibold mb-2">
                {section.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                {section.description}
              </p>

              {section.status === 'active' && (
                <div className="mt-4 pt-4 border-t border-[#333]">
                  <span className="text-white text-sm font-medium">
                    Click to manage →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400">{activeSections}</div>
            <div className="text-sm text-gray-400">Active Sections</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400">{totalSections - activeSections}</div>
            <div className="text-sm text-gray-400">Coming Soon</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400">{PAGE_TABS.length}</div>
            <div className="text-sm text-gray-400">Page Categories</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-2xl font-bold text-purple-400">{currentTab?.sections.length || 0}</div>
            <div className="text-sm text-gray-400">Sections in Tab</div>
          </div>
        </div>

        {/* Development Note */}
        <div className="mt-8 bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <h3 className="text-lg font-telegraf font-semibold mb-2 text-yellow-400">
            🚧 Development Status
          </h3>
          <p className="text-gray-400 text-sm">
            Currently active: Incentives Management and Reviews Management. Other sections are being developed 
            and will be available soon. Each section will allow you to edit content directly from this dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
