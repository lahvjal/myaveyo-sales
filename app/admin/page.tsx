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

const CMS_SECTIONS: CMSSection[] = [
  {
    id: 'incentives',
    title: 'Incentives',
    description: 'Manage incentive cards with images and videos',
    href: '/admin/incentives',
    icon: '🎯',
    status: 'active'
  },
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Edit welcome text, headings, and CTA buttons',
    href: '/admin/hero',
    icon: '🏠',
    status: 'coming_soon'
  },
  {
    id: 'stats',
    title: 'Stats Section',
    description: 'Update statistics and metrics',
    href: '/admin/stats',
    icon: '📊',
    status: 'coming_soon'
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

export default function AdminDashboard() {
  const router = useRouter()

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-telegraf font-semibold mb-2">Content Sections</h2>
          <p className="text-gray-400">Manage all editable content across your website</p>
        </div>

        {/* CMS Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CMS_SECTIONS.map((section) => (
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400">1</div>
            <div className="text-sm text-gray-400">Active CMS Sections</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400">6</div>
            <div className="text-sm text-gray-400">Coming Soon</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400">7</div>
            <div className="text-sm text-gray-400">Total Sections</div>
          </div>
        </div>

        {/* Development Note */}
        <div className="mt-8 bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <h3 className="text-lg font-telegraf font-semibold mb-2 text-yellow-400">
            🚧 Development Status
          </h3>
          <p className="text-gray-400 text-sm">
            The Incentives CMS is fully functional. Other sections are being developed and will be available soon.
            Each section will allow you to edit text, images, and other content directly from this dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
