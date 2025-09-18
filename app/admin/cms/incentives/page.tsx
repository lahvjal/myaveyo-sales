'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function CMSIncentivesPage() {
  const [activeTab, setActiveTab] = useState('incentives')

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
              Incentives Page Management
            </h1>
            <p className="text-gray-400 text-lg">
              Manage the incentives page content, programs, and display settings.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Manage Incentives Card */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333] cursor-pointer hover:border-[#555] transition-colors"
                   onClick={() => window.location.href = '/admin/incentives'}>
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Manage Incentives</h3>
                <p className="text-gray-400 mb-4">Create, edit, and delete incentive programs</p>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Active
                </span>
              </div>

              {/* Incentive Analytics Card */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Incentive Analytics</h3>
                <p className="text-gray-400 mb-4">View performance metrics and engagement stats</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Categories Management */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Categories</h3>
                <p className="text-gray-400 mb-4">Manage incentive categories and tags</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Display Settings */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Display Settings</h3>
                <p className="text-gray-400 mb-4">Configure how incentives appear on the public page</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Approval Workflow */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Approval Workflow</h3>
                <p className="text-gray-400 mb-4">Set up approval processes for new incentives</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Templates */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Templates</h3>
                <p className="text-gray-400 mb-4">Create and manage incentive templates</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
