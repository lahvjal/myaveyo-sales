'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CMSgridCard from '@/components/admin/CMSgridCard'
import Button from '@/components/Button'

interface StatCard {
  id: string
  title: string
  subtitle: string
  value: string
  position: number
}

interface StatsDataGrid {
  grid: { cards: StatCard[] }
}

export default function HomeStatsPage() {
  const [statsData, setStatsData] = useState<StatsDataGrid>({ grid: { cards: [] } })
  const [baseline, setBaseline] = useState<StatsDataGrid>({ grid: { cards: [] } })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<StatCard>>({})

  // Fetch stats data
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cms/home-stats', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        // Expect standardized { grid: { cards: [] } }
        const content = data.content && data.content.grid ? data.content : { grid: { cards: [] } }
        setStatsData(content)
        setBaseline(content)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // Save stats data
  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { section_key: 'home_stats', content: statsData, is_published: true }
      console.log('[CMS][home-stats][SAVE] sending payload:', payload)
      const response = await fetch('/api/cms/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      let bodyText = ''
      try { bodyText = await response.clone().text() } catch {}
      console.log('[CMS][home-stats][SAVE] response status:', response.status, response.statusText)
      console.log('[CMS][home-stats][SAVE] response body:', bodyText)

      if (response.ok) {
        console.log('[CMS][home-stats][SAVE] success')
        setBaseline(statsData)
        await fetchStats()
      } else {
        console.error('[CMS][home-stats][SAVE] failed with status', response.status)
      }
    } catch (error) {
      console.error('Error saving stats:', error)
    } finally {
      setSaving(false)
    }
  }

  // Handle card editing
  const startEditing = (card: StatCard) => {
    setEditingCard(card.id)
    setFormData(card)
  }

  const cancelEditing = () => {
    setEditingCard(null)
    setFormData({})
  }

  const saveCard = () => {
    if (!editingCard || !formData.title) return

    const currentCards = statsData?.grid?.cards || defaultCards
    const updatedCards = currentCards.map(card =>
      card.id === editingCard
        ? { ...card, ...formData }
        : card
    )

    setStatsData({ grid: { cards: updatedCards } })
    setEditingCard(null)
    setFormData({})
  }

  const isCardDirty = (card: StatCard) => {
    try {
      const base = (baseline.grid.cards || []).find(c => c.id === card.id)
      return JSON.stringify(base) !== JSON.stringify(card)
    } catch {
      return false
    }
  }

  // Default cards if none exist
  const defaultCards: StatCard[] = [
    { id: '1', title: 'Sales Stats.', subtitle: 'A real-time look into our company-wide sales metrics. They\'d be better if you worked here.', value: '', position: 1 },
    { id: '2', title: '_2025', subtitle: '', value: '', position: 2 },
    { id: '3', title: '5*', subtitle: 'Star Reviews', value: '', position: 3 },
    { id: '4', title: '45 days', subtitle: 'AVG Sale to Install', value: '', position: 4 },
    { id: '5', title: '30 days', subtitle: 'Install to PTO', value: '', position: 5 },
    { id: '6', title: '$679k', subtitle: 'Revenue Generated', value: '', position: 6 }
  ]

  const cards = statsData?.grid?.cards?.length > 0 ? statsData.grid.cards : defaultCards

  if (loading) {
    return (
      <AdminLayout
      pageKey="admin"
      topBarTitle="Admin"
      breadcrumbs={[
        { name: 'Admin', href: '/admin' },
        { name: 'CMS', href: '/admin/cms/home' },
        { name: 'Home Page', href: '/admin/cms/home' },
        { name: 'Stats Section' }
      ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading stats...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      pageKey="admin"
      topBarTitle="Admin"
      breadcrumbs={[
        { name: 'Admin', href: '/admin' },
        { name: 'CMS', href: '/admin/cms' },
        { name: 'Home Page', href: '/admin/cms/home' },
        { name: 'Stats Section' }
      ]}
    >
      
      <div className="p-8">
        <div className='max-w-7xl mx-auto'>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Stats Section CMS</h1>
              <p className="text-gray-400">Manage the homepage stats section content</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => window.open('/', '_blank')}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                View Homepage →
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Stats Grid Preview */}
          <div className="mb-8">
            <div className="bg-black rounded-lg">
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold">Stats Section</h3>
              </div>
              <div className="grid grid-cols-4 grid-rows-2 gap-5" style={{ gridTemplateRows: 'repeat(2, 210px)' }}>
                {cards.map((card, index) => {
                  const placement =
                    index === 0 ? 'col-start-1 row-start-1' :
                    index === 1 ? 'col-start-4 row-start-1' :
                    index === 2 ? 'col-start-1 row-start-2' :
                    index === 3 ? 'col-start-2 row-start-2' :
                    index === 4 ? 'col-start-3 row-start-2' :
                    index === 5 ? 'col-start-4 row-start-2' : ''

                  return (
                    <CMSgridCard
                      key={card.id}
                      type={'text'}
                      title={card.title}
                      description={card.subtitle}
                      className={placement}
                      onClick={() => startEditing(card)}
                      dirty={isCardDirty(card)}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {editingCard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-96">
                <h3 className="text-white text-lg font-semibold mb-4">Edit Card</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Subtitle</label>
                    <textarea
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full p-2 bg-gray-700 text-white rounded h-20"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={saveCard}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={cancelEditing}
                    className="bg-gray-600 hover:bg-gray-700 flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
