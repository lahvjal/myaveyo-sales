'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import HomePageManagementCard from '@/components/admin/HomePageManagementCard'
import { supabase } from '@/lib/supabase-browser'


export default function CMSHomePage() {
  const [activeTab, setActiveTab] = useState('home')
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) setUserEmail(data.user?.email ?? '')
    }
    load()
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUserEmail(session?.user?.email ?? '')
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const homePageSections = [
    {
      title: 'CMS',
      description: 'Click to manage',
      status: 'active' as const,
      href: '/admin/cms'
    },
    {
      title: 'Applications',
      description: 'Click to manage',
      status: 'active' as const,
      href: '/admin/applications'
    }
  ]

  return (
    <AdminLayout
      pageKey="admin"
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">
            <h1 className="text-4xl font-telegraf font-bold mb-4">
              Welcome{userEmail ? `, ${userEmail}` : 'Admin'}
            </h1>
            <p className="text-gray-400 text-lg">
              Management the CMS and applications submitted from the website.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homePageSections.map((section, index) => (
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
