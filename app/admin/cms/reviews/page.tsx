'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function CMSReviewsPage() {
  const [activeTab, setActiveTab] = useState('reviews')

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
              {/* Manage Reviews Card */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333] cursor-pointer hover:border-[#555] transition-colors"
                   onClick={() => window.location.href = '/admin/reviews'}>
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Manage Reviews</h3>
                <p className="text-gray-400 mb-4">Upload, edit, and organize customer review videos</p>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Active
                </span>
              </div>

              {/* Content Moderation Card */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Content Moderation</h3>
                <p className="text-gray-400 mb-4">Review and approve submitted content</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Customer Reviews */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Customer Reviews</h3>
                <p className="text-gray-400 mb-4">Manage customer testimonial videos</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Rep Reviews */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Rep Reviews</h3>
                <p className="text-gray-400 mb-4">Manage sales rep testimonial videos</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Featured Reviews */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Featured Reviews</h3>
                <p className="text-gray-400 mb-4">Highlight top-performing review content</p>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  Coming Soon
                </span>
              </div>

              {/* Analytics */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-telegraf font-bold text-white mb-2">Review Analytics</h3>
                <p className="text-gray-400 mb-4">Track engagement and performance metrics</p>
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
