'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import HomePageManagementCard from '@/components/admin/HomePageManagementCard'

export default function CMSHomePage() {
  const [activeTab, setActiveTab] = useState('home')

  const cmsPages = [
    {
      title: 'Home Page',
      description: 'Click to manage',
      status: 'active' as const,
      href: '/admin/cms/home'
    },
    {
      title: 'Incentives Page',
      description: 'Click to manage',
      status: 'active' as const,
      href: '/admin/cms/incentives'
    },
    {
      title: 'Reviews Page',
      description: 'Click to manage',
      status: 'active' as const,
      href: '/admin/cms/reviews'
    },
    {
      title: 'Stats Page',
      description: 'Click to manage',
      status: 'active' as const,
      href: '/admin/cms/stats'
    }
  ]

  return (
    <AdminLayout
    pageKey="admin"
    topBarTitle="Admin"
    breadcrumbs={[
      { name: 'Admin', href: '/admin' },
      { name: 'CMS' }
    ]}
    >
      <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">
            <h1 className="text-4xl font-telegraf font-bold mb-4">
              Content Management
            </h1>
            <p className="text-gray-400 text-lg">
              Manage all CMS powered pages here.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cmsPages.map((page, index) => (
                <HomePageManagementCard
                  key={index}
                  title={page.title}
                  description={page.description}
                  status={page.status}
                  href={page.href}
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
