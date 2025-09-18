'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import EditModal from '@/components/admin/EditModal'

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
  const [activeTab, setActiveTab] = useState('stats')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingType, setEditingType] = useState<'stat' | 'section'>('stat')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<HomeStat | null>(null)
  
  const breadcrumbs = [
    { name: 'Home Page', href: '/admin/cms/home' },
    { name: 'Stats Section' }
  ]

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

  const handleEdit = (stat: HomeStat) => {
    setEditingType('stat')
    setEditingId(stat.id)
    setEditForm({ ...stat })
    setIsModalOpen(true)
  }

  const handleEditSection = (sectionType: string) => {
    setEditingType('section')
    setEditingId(sectionType)
    setIsModalOpen(true)
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
    setIsModalOpen(false)
  }

  return (
    <AdminLayout
      pageKey="home-stats"
      topBarTitle="CMS"
      topBarIcon="/images/16d82f801100a4d0fca41534110993bbb8ff7a62.svg"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      breadcrumbs={breadcrumbs}
    >
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-telegraf font-bold text-white mb-2">Stats Section</h1>
          </div>

          {/* Stats Grid - 4 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Top Row - Section Cards */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-b from-[#171717] to-[#111111] rounded-[3px] p-6 relative">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-[20px] font-telegraf font-bold text-white">
                    Sales Stats.
                  </h3>
                </div>
                <div className="mb-6 flex-grow">
                  <p className="text-[#888d95] text-[14px] font-telegraf leading-relaxed">
                    A real-time look into our company-wide sales metrics. They'll be better if you worked here.
                  </p>
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={() => handleEditSection('sales-stats')}
                    className="flex items-center gap-2 text-[#888d95] text-[14px] font-telegraf hover:text-white transition-colors group"
                  >
                    Edit
                    <div className="transition-transform group-hover:translate-x-1">→</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-b from-[#171717] to-[#111111] rounded-[3px] p-6 relative">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-[20px] font-telegraf font-bold text-white">
                    _2025
                  </h3>
                </div>
                <div className="mb-6 flex-grow">
                  <p className="text-[#888d95] text-[14px] font-telegraf leading-relaxed">
                    Year indicator for the stats section
                  </p>
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={() => handleEditSection('year-indicator')}
                    className="flex items-center gap-2 text-[#888d95] text-[14px] font-telegraf hover:text-white transition-colors group"
                  >
                    Edit
                    <div className="transition-transform group-hover:translate-x-1">→</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row - Individual Stat Cards */}
            {stats.sort((a, b) => a.order - b.order).map((stat) => (
              <div
                key={stat.id}
                className="bg-gradient-to-b from-[#171717] to-[#111111] rounded-[3px] p-6 relative"
              >
                <div className="flex flex-col h-full">
                  {/* Title */}
                  <div className="mb-4">
                    <h3 className="text-[20px] font-telegraf font-bold text-white">
                      {stat.title}
                    </h3>
                  </div>
                  
                  {/* Value */}
                  <div className="mb-4 flex-grow flex items-center">
                    <div className="text-[40px] font-telegraf font-black text-white">
                      {stat.prefix}{stat.value}{stat.suffix}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-[#888d95] text-[14px] font-telegraf leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                  
                  {/* Edit Button */}
                  <div className="mt-auto">
                    <button
                      onClick={() => handleEdit(stat)}
                      className="flex items-center gap-2 text-[#888d95] text-[14px] font-telegraf hover:text-white transition-colors group"
                    >
                      Edit
                      <div className="transition-transform group-hover:translate-x-1">
                        →
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType === 'stat' ? 'Edit Statistic' : 'Edit Section'}
        onSave={handleSave}
        onCancel={handleCancel}
      >
        {editingType === 'stat' && editForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-[#888d95] text-sm mb-2">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[#888d95] text-sm mb-2">Prefix</label>
                <input
                  type="text"
                  value={editForm.prefix || ''}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, prefix: e.target.value || undefined } : null)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
                  placeholder="$"
                />
              </div>
              <div>
                <label className="block text-[#888d95] text-sm mb-2">Value</label>
                <input
                  type="text"
                  value={editForm.value}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, value: e.target.value } : null)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-[#888d95] text-sm mb-2">Suffix</label>
                <input
                  type="text"
                  value={editForm.suffix || ''}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, suffix: e.target.value || undefined } : null)}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
                  placeholder="% or K"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[#888d95] text-sm mb-2">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white h-20 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-[#888d95] text-sm mb-2">Display Order</label>
              <select
                value={editForm.order}
                onChange={(e) => setEditForm(prev => prev ? { ...prev, order: parseInt(e.target.value) } : null)}
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
              >
                <option value={1}>1st</option>
                <option value={2}>2nd</option>
                <option value={3}>3rd</option>
                <option value={4}>4th</option>
              </select>
            </div>
          </div>
        )}
        
        {editingType === 'section' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[#888d95] text-sm mb-2">Section Title</label>
              <input
                type="text"
                defaultValue={editingId === 'sales-stats' ? 'Sales Stats.' : '_2025'}
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#888d95] text-sm mb-2">Description</label>
              <textarea
                defaultValue={editingId === 'sales-stats' ? 
                  "A real-time look into our company-wide sales metrics. They'll be better if you worked here." : 
                  "Year indicator for the stats section"
                }
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white h-20 resize-none"
              />
            </div>
          </div>
        )}
      </EditModal>
    </AdminLayout>
  )
}
