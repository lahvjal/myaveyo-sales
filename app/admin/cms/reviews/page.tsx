'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import HomePageManagementCard from '@/components/admin/HomePageManagementCard'

export default function CMSReviewsPage() {
  const [activeTab, setActiveTab] = useState('reviews')

  const reviewsSections = [
    {
      title: 'Manage Reviews',
      description: 'Click to manage',
      status: 'active' as const,
      href: '/admin/reviews'
    },
    {
      title: 'Content Moderation',
      description: 'Click to manage',
      status: 'coming-soon' as const
    },
    {
      title: 'Customer Reviews',
      description: 'Click to manage',
      status: 'coming-soon' as const
    },
    {
      title: 'Rep Reviews',
      description: 'Click to manage',
      status: 'coming-soon' as const
    },
    {
      title: 'Featured Reviews',
      description: 'Click to manage',
      status: 'coming-soon' as const
    },
    {
      title: 'Review Analytics',
      description: 'Click to manage',
      status: 'coming-soon' as const
    }
  ]

  return (
    <AdminLayout
      pageKey="cms"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">
            <h1 className="text-4xl font-telegraf font-bold mb-4">
              Reviews Page Management
            </h1>
            <p className="text-gray-400 text-lg">
              Manage customer and rep review videos, moderation, and display settings.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsSections.map((section, index) => (
                <HomePageManagementCard
                  key={index}
                  title={section.title}
                  description={section.description}
                  status={section.status}
                  href={section.href}
                  className="h-[120px]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
