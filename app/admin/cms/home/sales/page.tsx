'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CMSgridCard from '@/components/admin/CMSgridCard'
import Button from '@/components/Button'

// Matches /api/sales response 1:1
interface SalesGridContent {
  grid: {
    section_title: { prefix: string; title: string; content: string }
    copyright: { icon: string; text: string }
    h3_text: { text: string }
    large_image: { alt: string; url: string }
    text_block: { title: string; content: string }
    button_block: { text: string; variant: string }
    stat_card_1: { title: string; value: string; prefix: string; suffix: string; description: string }
    stat_card_2: { title: string; value: string; prefix: string; suffix: string; description: string }
    bottom_image: { alt: string; url: string }
  }
}

const defaultContent: SalesGridContent = {
  grid: {
    section_title: { prefix: '(3)', title: 'Not your average sales gig.', content: '' },
    copyright: { icon: '/images/world.svg', text: '2025 aveyo_sales' },
    h3_text: { text: 'UNLIMITED POTENTIAL. PROVEN METHODS. MASSIVE EARNINGS. REAL FREEDOM. AND A CULTURE THAT CARES. HERE, YOUR HARD WORK SPEAKS FOR ITSELF.' },
    large_image: { alt: 'Sales representative', url: '/images/donny-hammond.jpeg' },
    text_block: { title: 'A COMPLETELY KITTED TOOL KIT.', content: 'No limits, just wins. From your first deal to your biggest bonus, we set you up with the tools, training, and support you need to crush goals and climb fast. When you win, the whole team wins—and we celebrate every step of the way.' },
    button_block: { text: 'JOIN THE TEAM', variant: 'primary' },
    stat_card_1: { title: 'Sales Reps Nationwide', value: '150', prefix: '', suffix: '+', description: 'We are a growing team across the country' },
    stat_card_2: { title: 'Industry leading leadership', value: '3', prefix: 'TOP', suffix: '', description: 'And Sales Support' },
    bottom_image: { alt: 'Team photo', url: '/images/Alpha Aveyo-4.jpeg' }
  }
}

export default function SalesSectionCMS() {
  const [content, setContent] = useState<SalesGridContent>(defaultContent)
  const [baseline, setBaseline] = useState<SalesGridContent>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [activeTab, setActiveTab] = useState<'preview' | 'actions'>('preview')

  // Dirty helper in scope of state
  const isDirty = (key: keyof SalesGridContent['grid']) => {
    try {
      return JSON.stringify((content.grid as any)[key]) !== JSON.stringify((baseline.grid as any)[key])
    } catch {
      return false
    }
  }

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/cms/home-sales')
      if (response.ok) {
        const data = await response.json()
        setContent(data as SalesGridContent)
        setBaseline(data as SalesGridContent)
      } else {
        setContent(defaultContent)
        setBaseline(defaultContent)
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
      setContent(defaultContent)
      setBaseline(defaultContent)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        content: (content as any).grid ? (content as any) : { grid: content.grid },
        is_published: false
      }
      console.log('[CMS][home-sales][SAVE] sending payload:', payload)
      const response = await fetch('/api/cms/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section_key: 'home_sales', ...payload }),
      })

      let bodyText = ''
      try { bodyText = await response.clone().text() } catch {}
      console.log('[CMS][home-sales][SAVE] response status:', response.status, response.statusText)
      console.log('[CMS][home-sales][SAVE] response body:', bodyText)

      if (response.ok) {
        console.log('[CMS][home-sales][SAVE] success')
        // Update baseline to current content immediately for dirty tracking
        setBaseline(prev => ({ ...content }))
        await fetchSalesData()
      } else {
        console.error('[CMS][home-sales][SAVE] failed with status', response.status)
      }
    } catch (error) {
      console.error('[CMS][home-sales][SAVE] exception:', error)
    } finally {
      setSaving(false)
    }
  }

  const startEditing = (key: string, initial: any) => {
    setEditingKey(key)
    setFormData(initial)
  }

  const saveEdit = () => {
    if (!editingKey) return
    const [root, sub] = editingKey.split('.') // all keys are within grid.*
    if (root !== 'grid') return
    setContent(prev => ({
      grid: {
        ...prev.grid,
        [sub]: { ...prev.grid[sub as keyof typeof prev.grid], ...formData }
      }
    }))
    setEditingKey(null)
    setFormData({})
  }

  const cancelEditing = () => {
    setEditingKey(null)
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

  const g = content.grid

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="order-2 sm:order-1">
              <h1 className="text-2xl font-bold text-white mb-2">Sales Section CMS</h1>
              <p className="text-gray-400">Manage the sales section content based on the 3-column grid design</p>
            </div>
            {/* Mobile tabs */}
            <div className="order-1 sm:hidden">
              <div className="inline-flex rounded-md bg-gray-800 p-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'} px-3 py-1.5 rounded`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`${activeTab === 'actions' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'} px-3 py-1.5 rounded`}
                >
                  Actions
                </button>
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={() => window.open('/', '_blank')}
                className=""
              >
                View Homepage →
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className=""
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Mobile actions (under tabs) */}
            {activeTab === 'actions' && (
              <div className="flex sm:hidden gap-3 order-3 w-full">
                <Button
                  variant="secondary"
                  onClick={() => window.open('/', '_blank')}
                  className="bg-gray-700 hover:bg-gray-600 text-white w-full"
                >
                  View Homepage →
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          <div className={`mb-8 ${activeTab === 'actions' ? 'hidden sm:block' : ''}`}>
            <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
            <div className="bg-black p-4 sm:p-8 rounded-lg">
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold">Sales Section</h3>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ gridAutoRows: '210px', gridTemplateRows: 'repeat(6, 210px)' }}>
                {/* 1: Title */}
                <CMSgridCard
                  type="text"
                  title={g.section_title.title}
                  subtitle={g.section_title.prefix}
                  className=""
                  style={{ gridColumn: '1', gridRow: '1' }}
                  onClick={() => startEditing('grid.section_title', g.section_title)}
                  dirty={isDirty('section_title')}
                />

                {/* 2: Copyright */}
                <CMSgridCard
                  type="text"
                  title={g.copyright.text}
                  subtitle=""
                  className=""
                  style={{ gridColumn: '1', gridRow: '2' }}
                  onClick={() => startEditing('grid.copyright', g.copyright)}
                  dirty={isDirty('copyright')}
                />

                {/* 3: H3 text (right) */}
                <CMSgridCard
                  type="description"
                  title={g.h3_text.text}
                  description=""
                  className=""
                  style={{ gridColumn: '3', gridRow: '1' }}
                  onClick={() => startEditing('grid.h3_text', g.h3_text)}
                  dirty={isDirty('h3_text')}
                />

                {/* 4: Large image spanning 2 rows */}
                <CMSgridCard
                  type="image"
                  title={g.large_image.alt}
                  imageUrl={g.large_image.url}
                  className=""
                  style={{ gridColumn: '1', gridRow: '3 / span 2' }}
                  onClick={() => startEditing('grid.large_image', g.large_image)}
                  dirty={isDirty('large_image')}
                />

                {/* 5: Text block */}
                <CMSgridCard
                  type="description"
                  title={g.text_block.title}
                  description={g.text_block.content}
                  className=""
                  style={{ gridColumn: '2', gridRow: '3' }}
                  onClick={() => startEditing('grid.text_block', g.text_block)}
                  dirty={isDirty('text_block')}
                />

                {/* 6: CTA button */}
                <CMSgridCard
                  type="text"
                  title={g.button_block.text}
                  subtitle={g.button_block.variant}
                  className=""
                  style={{ gridColumn: '3', gridRow: '3' }}
                  onClick={() => startEditing('grid.button_block', g.button_block)}
                  dirty={isDirty('button_block')}
                />

                {/* 7: Stat 1 */}
                <CMSgridCard
                  type="stat"
                  title={`${g.stat_card_1.prefix}${g.stat_card_1.value}${g.stat_card_1.suffix}`}
                  subtitle={g.stat_card_1.title}
                  description={g.stat_card_1.description}
                  className=""
                  style={{ gridColumn: '2', gridRow: '4' }}
                  onClick={() => startEditing('grid.stat_card_1', g.stat_card_1)}
                  dirty={isDirty('stat_card_1')}
                />

                {/* 8: Stat 2 */}
                <CMSgridCard
                  type="stat"
                  title={`${g.stat_card_2.prefix}${g.stat_card_2.value}${g.stat_card_2.suffix}`}
                  subtitle={g.stat_card_2.title}
                  description={g.stat_card_2.description}
                  className=""
                  style={{ gridColumn: '3', gridRow: '4' }}
                  onClick={() => startEditing('grid.stat_card_2', g.stat_card_2)}
                  dirty={isDirty('stat_card_2')}
                />

                {/* 9: Bottom wide image spanning all 3 cols */}
                <CMSgridCard
                  type="image"
                  title={g.bottom_image.alt}
                  imageUrl={g.bottom_image.url}
                  className=""
                  style={{ gridColumn: '1 / span 3', gridRow: '5 / span 2' }}
                  onClick={() => startEditing('grid.bottom_image', g.bottom_image)}
                  dirty={isDirty('bottom_image')}
                />
              </div>
            </div>
          </div>

          {editingKey && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3">
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg w-11/12 sm:w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-white text-lg font-semibold mb-4">Edit Block</h3>
                
                <div className="space-y-4">
                  {/* Dynamic fields based on the block being edited */}
                  {editingKey === 'grid.section_title' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Prefix</label>
                        <input type="text" value={formData.prefix || ''} onChange={(e)=>setFormData({ ...formData, prefix: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Title</label>
                        <input type="text" value={formData.title || ''} onChange={(e)=>setFormData({ ...formData, title: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Content</label>
                        <textarea value={formData.content || ''} onChange={(e)=>setFormData({ ...formData, content: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded h-20" />
                      </div>
                    </>
                  )}

                  {editingKey === 'grid.copyright' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Icon URL</label>
                        <input type="text" value={formData.icon || ''} onChange={(e)=>setFormData({ ...formData, icon: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Text</label>
                        <input type="text" value={formData.text || ''} onChange={(e)=>setFormData({ ...formData, text: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                    </>
                  )}

                  {editingKey === 'grid.h3_text' && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Text</label>
                      <textarea value={formData.text || ''} onChange={(e)=>setFormData({ ...formData, text: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded h-24" />
                    </div>
                  )}

                  {editingKey === 'grid.large_image' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Image URL</label>
                        <input type="text" value={formData.url || ''} onChange={(e)=>setFormData({ ...formData, url: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Alt Text</label>
                        <input type="text" value={formData.alt || ''} onChange={(e)=>setFormData({ ...formData, alt: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                    </>
                  )}

                  {editingKey === 'grid.text_block' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Title</label>
                        <input type="text" value={formData.title || ''} onChange={(e)=>setFormData({ ...formData, title: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Content</label>
                        <textarea value={formData.content || ''} onChange={(e)=>setFormData({ ...formData, content: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded h-24" />
                      </div>
                    </>
                  )}

                  {editingKey === 'grid.button_block' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Text</label>
                        <input type="text" value={formData.text || ''} onChange={(e)=>setFormData({ ...formData, text: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Variant</label>
                        <input type="text" value={formData.variant || ''} onChange={(e)=>setFormData({ ...formData, variant: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                    </>
                  )}

                  {editingKey === 'grid.stat_card_1' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Title</label>
                        <input type="text" value={formData.title || ''} onChange={(e)=>setFormData({ ...formData, title: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Prefix</label>
                          <input type="text" value={formData.prefix || ''} onChange={(e)=>setFormData({ ...formData, prefix: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Value</label>
                          <input type="text" value={formData.value || ''} onChange={(e)=>setFormData({ ...formData, value: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Suffix</label>
                          <input type="text" value={formData.suffix || ''} onChange={(e)=>setFormData({ ...formData, suffix: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Description</label>
                        <input type="text" value={formData.description || ''} onChange={(e)=>setFormData({ ...formData, description: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                    </>
                  )}

                  {editingKey === 'grid.stat_card_2' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Title</label>
                        <input type="text" value={formData.title || ''} onChange={(e)=>setFormData({ ...formData, title: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Prefix</label>
                          <input type="text" value={formData.prefix || ''} onChange={(e)=>setFormData({ ...formData, prefix: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Value</label>
                          <input type="text" value={formData.value || ''} onChange={(e)=>setFormData({ ...formData, value: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Suffix</label>
                          <input type="text" value={formData.suffix || ''} onChange={(e)=>setFormData({ ...formData, suffix: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Description</label>
                        <input type="text" value={formData.description || ''} onChange={(e)=>setFormData({ ...formData, description: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                    </>
                  )}

                  {editingKey === 'grid.bottom_image' && (
                    <>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Image URL</label>
                        <input type="text" value={formData.url || ''} onChange={(e)=>setFormData({ ...formData, url: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Alt Text</label>
                        <input type="text" value={formData.alt || ''} onChange={(e)=>setFormData({ ...formData, alt: e.target.value })} className="w-full p-2 bg-gray-700 text-white rounded" />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={saveEdit}
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
