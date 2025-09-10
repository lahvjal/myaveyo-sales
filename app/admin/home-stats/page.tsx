'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface HomeStat {
  id: string
  title: string
  value: string
  prefix?: string
  suffix?: string
  description: string
  icon: string
  order: number
}

export default function HomeStatsAdmin() {
  const [stats, setStats] = useState<HomeStat[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/home-stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Fallback to default stats
        setStats([
          {
            id: '1',
            title: 'Increase',
            value: '10',
            suffix: '%',
            description: 'Monthly growth in sales performance',
            icon: '📈',
            order: 1
          },
          {
            id: '2', 
            title: 'Projects Sold',
            value: '45',
            description: 'Successful projects completed this month',
            icon: '🏠',
            order: 2
          },
          {
            id: '3',
            title: 'Revenue Generated',
            value: '850',
            prefix: '$',
            suffix: 'K',
            description: 'Total revenue generated this quarter',
            icon: '💰',
            order: 3
          },
          {
            id: '4',
            title: 'Customer Satisfaction',
            value: '98',
            suffix: '%',
            description: 'Based on customer reviews and feedback',
            icon: '⭐',
            order: 4
          }
        ])
      }
    }

    fetchStats()
  }, [])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<HomeStat | null>(null)

  const handleEdit = (stat: HomeStat) => {
    setEditingId(stat.id)
    setEditForm({ ...stat })
  }

  const handleSave = async () => {
    if (editForm) {
      try {
        const updatedStats = stats.map(stat => 
          stat.id === editForm.id ? editForm : stat
        )
        
        const response = await fetch('/api/home-stats', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedStats),
        })

        if (response.ok) {
          setStats(updatedStats)
          setEditingId(null)
          setEditForm(null)
        } else {
          console.error('Failed to save stats')
        }
      } catch (error) {
        console.error('Error saving stats:', error)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm(null)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="border-b border-[#333] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-telegraf font-bold">Homepage Stats Section</h1>
              <p className="text-gray-400 text-sm">Manage statistics displayed on the homepage</p>
            </div>
            <Link 
              href="/admin"
              className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-telegraf font-semibold mb-2">Statistics Management</h2>
          <p className="text-gray-400">
            Edit the statistics that appear in the stats section of the homepage. These numbers help showcase Aveyo's growth and success.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.sort((a, b) => a.order - b.order).map((stat) => (
            <div
              key={stat.id}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6"
            >
              {editingId === stat.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                    <input
                      type="text"
                      value={editForm?.icon || ''}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, icon: e.target.value } : null)}
                      className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#333] rounded-lg text-white"
                      placeholder="📊"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-[#888d95] text-sm mb-2">Title</label>
                    <input
                      type="text"
                      value={editForm?.title}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-[#888d95] text-sm mb-2">Prefix (e.g. $)</label>
                      <input
                        type="text"
                        value={editForm?.prefix || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, prefix: e.target.value || undefined } : null)}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                        placeholder="$"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888d95] text-sm mb-2">Value</label>
                      <input
                        type="text"
                        value={editForm?.value || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, value: e.target.value } : null)}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888d95] text-sm mb-2">Suffix (e.g. %, K)</label>
                      <input
                        type="text"
                        value={editForm?.suffix || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, suffix: e.target.value || undefined } : null)}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                        placeholder="% or K"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={editForm?.description || ''}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#333] rounded-lg text-white h-20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Display Order</label>
                    <select
                      value={editForm?.order || 1}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, order: parseInt(e.target.value) } : null)}
                      className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#333] rounded-lg text-white"
                    >
                      <option value={1}>1st</option>
                      <option value={2}>2nd</option>
                      <option value={3}>3rd</option>
                      <option value={4}>4th</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display View
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{stat.icon}</div>
                    <button
                      onClick={() => handleEdit(stat)}
                      className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-telegraf font-semibold mb-2">
                    {stat.title}
                  </h3>
                  
                  <div className="text-3xl font-telegraf font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {stat.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#333]">
                    <span className="text-xs text-gray-500">
                      Display Order: {stat.order}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preview Section */}
        <div className="mt-12">
          <h3 className="text-lg font-telegraf font-semibold mb-4">Preview</h3>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-6">
              This is how the stats will appear on the homepage:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.sort((a, b) => a.order - b.order).map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-center">
                    <div className="text-[40px] font-telegraf font-black text-white mb-2">
                      {stat.prefix}{stat.value}{stat.suffix}
                    </div>
                    <p className="text-[#888d95] text-[14px] font-telegraf">
                      {stat.title}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Notice */}
        <div className="mt-8 bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <h3 className="text-lg font-telegraf font-semibold mb-2 text-blue-400">
            💡 Note
          </h3>
          <p className="text-gray-400 text-sm">
            Changes made here will update the statistics section on the homepage. Make sure your numbers are accurate and up-to-date to maintain credibility with visitors.
          </p>
        </div>
      </div>
    </div>
  )
}
