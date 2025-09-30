'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CMSgridCard from '@/components/admin/CMSgridCard'
import Button from '@/components/Button'

interface SalesCard {
  id: string
  type: 'text' | 'image' | 'stat' | 'description'
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
  gridArea: string
  position: number
}

interface SalesData {
  cards: SalesCard[]
  is_published: boolean
}

const defaultCards: SalesCard[] = [
  { id: '1', type: 'text', title: 'Not your average sales gig.', gridArea: '1 / 1', position: 1 },
  { id: '2', type: 'stat', title: '$100K+', subtitle: 'Average First Year Earnings', gridArea: '1 / 2', position: 2 },
  { id: '3', type: 'text', title: 'Apply Now', gridArea: '1 / 3', position: 3 },
  { id: '4', type: 'image', title: 'Sales Team Image', imageUrl: '/images/2980e3438b2a66112f1488048f70f451e7596fe1.png', gridArea: '3 / 1 / span 2', position: 4 },
  { id: '5', type: 'stat', title: '50+', subtitle: 'Sales Reps Nationwide', gridArea: '2 / 2', position: 5 },
  { id: '6', type: 'stat', title: '95%', subtitle: 'Customer Satisfaction', gridArea: '3 / 2', position: 6 },
  { id: '7', type: 'description', title: 'Join Our Team', description: 'We are looking for motivated individuals to join our growing sales team. Competitive compensation and comprehensive training provided.', gridArea: '2 / 3 / span 2', position: 7 },
  { id: '8', type: 'text', title: 'Remote Opportunities', gridArea: '4 / 2', position: 8 },
  { id: '9', type: 'text', title: 'Flexible Schedule', gridArea: '5 / 1', position: 9 },
  { id: '10', type: 'stat', title: '24/7', subtitle: 'Support Available', gridArea: '5 / 2', position: 10 },
  { id: '11', type: 'text', title: 'Career Growth', gridArea: '5 / 3', position: 11 }
]

export default function SalesSectionCMS() {
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingCard, setEditingCard] = useState<SalesCard | null>(null)
  const [formData, setFormData] = useState<Partial<SalesCard>>({})

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/cms/home-sales')
      if (response.ok) {
        const data = await response.json()
        setSalesData(data)
      } else {
        setSalesData({ cards: defaultCards, is_published: false })
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
      setSalesData({ cards: defaultCards, is_published: false })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!salesData) return

    setSaving(true)
    try {
      const response = await fetch('/api/cms/home-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: salesData,
          is_published: salesData.is_published
        }),
      })

      if (response.ok) {
        console.log('Sales data saved successfully')
      } else {
        console.error('Failed to save sales data')
      }
    } catch (error) {
      console.error('Error saving sales data:', error)
    } finally {
      setSaving(false)
    }
  }

  const startEditing = (card: SalesCard) => {
    setEditingCard(card)
    setFormData(card)
  }

  const saveCard = () => {
    if (!editingCard || !salesData) return

    const updatedCards = salesData.cards.map(card =>
      card.id === editingCard.id ? { ...card, ...formData } : card
    )

    setSalesData({
      ...salesData,
      cards: updatedCards
    })

    setEditingCard(null)
    setFormData({})
  }

  const cancelEditing = () => {
    setEditingCard(null)
    setFormData({})
  }

  if (loading) {
    return (
      <AdminLayout
      pageKey="admin"
      topBarTitle="Admin"
      breadcrumbs={[
        { name: 'Admin', href: '/admin' },
        { name: 'CMS', href: '/admin/cms/home' },
        { name: 'Home Page', href: '/admin/cms/home' },
        { name: 'Sales Section' }
      ]}
      >
        <div className="p-8">
          <div className="text-white">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  const cards = salesData?.cards || defaultCards

  return (
    <AdminLayout
    pageKey="admin"
    topBarTitle="Admin"
    breadcrumbs={[
      { name: 'Admin', href: '/admin' },
      { name: 'CMS', href: '/admin/cms/home' },
      { name: 'Home Page', href: '/admin/cms/home' },
      { name: 'Sales Section' }
    ]}
    >
      <div className="p-8">
        <div className='max-w-7xl mx-auto'>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Sales Section CMS</h1>
              <p className="text-gray-400">Manage the sales section content based on the 3-column grid design</p>
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

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
            <div className="bg-black p-8 rounded-lg">
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold">Sales Section</h3>
              </div>
              <div className="grid grid-cols-3 grid-rows-5 gap-5" style={{ gridTemplateRows: 'repeat(5, 210px)' }}>
                {cards.map((card: SalesCard) => (
                  <CMSgridCard
                    key={card.id}
                    type={card.type}
                    title={card.title}
                    subtitle={card.subtitle}
                    description={card.description}
                    imageUrl={card.imageUrl}
                    className=""
                    style={{ gridArea: card.gridArea }}
                    onClick={() => startEditing(card)}
                  />
                ))}
              </div>
            </div>
          </div>

          {editingCard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
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
                  
                  {formData.type === 'stat' && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                      />
                    </div>
                  )}

                  {formData.type === 'description' && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white rounded h-20"
                      />
                    </div>
                  )}

                  {formData.type === 'image' && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Image URL</label>
                      <input
                        type="text"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                        placeholder="Enter image URL"
                      />
                    </div>
                  )}
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
