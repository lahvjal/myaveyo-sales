'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Incentive, CreateIncentiveData, UpdateIncentiveData } from '@/lib/types/incentive'
import IncentiveForm from '@/components/admin/IncentiveForm'
import Button from '@/components/Button'
import AdminLayout from '@/components/admin/AdminLayout'
import CMSgridCard from '@/components/admin/CMSgridCard'
import CMSgridCardPills from '@/components/admin/CMSgridCardPills'

export default function AdminIncentivesPage() {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'coming_up' | 'done'>('all')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncentive, setEditingIncentive] = useState<Incentive | null>(null)
  const [deletingIncentive, setDeletingIncentive] = useState<Incentive | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  // Use CMS top bar tabs and set the active one to 'incentives'
  const [activeTab, setActiveTab] = useState('incentives')

  // Incentives Section Copy (header + description) state
  type IncentivesCopy = {
    section_number: string
    section_title: string
    description: string
    is_published?: boolean
    filters?: string[]
  }

  const isCopyDirty = () => {
    try {
      return JSON.stringify({
        section_number: copy.section_number,
        section_title: copy.section_title,
        description: copy.description,
        filters: copy.filters,
      }) !== JSON.stringify({
        section_number: baselineCopy.section_number,
        section_title: baselineCopy.section_title,
        description: baselineCopy.description,
        filters: baselineCopy.filters,
      })
    } catch {
      return false
    }
  }

  const isTitleDirty = () => copy.section_number !== baselineCopy.section_number || copy.section_title !== baselineCopy.section_title
  const isDescriptionDirty = () => copy.description !== baselineCopy.description
  const isFiltersDirty = () => JSON.stringify(copy.filters) !== JSON.stringify(baselineCopy.filters)
  const [copy, setCopy] = useState<IncentivesCopy>({
    section_number: '(2)',
    section_title: 'Incentives.',
    description:
      'Great commissions are nice, but incredible incentives can be even cooler. Check out what we have cooking.',
    is_published: false,
    filters: ['All', 'Live', 'Coming Soon', 'Done'],
  })
  const [baselineCopy, setBaselineCopy] = useState<IncentivesCopy>({
    section_number: '(2)',
    section_title: 'Incentives.',
    description:
      'Great commissions are nice, but incredible incentives can be even cooler. Check out what we have cooking.',
    is_published: false,
    filters: ['All', 'Live', 'Coming Soon', 'Done'],
  })
  const [copyLoading, setCopyLoading] = useState(true)
  const [copySaving, setCopySaving] = useState(false)

  // Edit modal for incentives copy
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  const [copyModalType, setCopyModalType] = useState<'title' | 'description' | 'filters' | null>(null)
  const [copyForm, setCopyForm] = useState<IncentivesCopy>({
    section_number: '(2)',
    section_title: 'Incentives.',
    description: '',
    is_published: false,
    filters: ['All', 'Live', 'Coming Soon', 'Done'],
  })

  // Fetch all incentives (including unpublished for admin view)
  const fetchIncentives = async () => {
    try {
      const response = await fetch(`/api/incentives/admin?t=${Date.now()}`, { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setIncentives(data)
      }
    } catch (error) {
      console.error('Error fetching incentives:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch incentives section copy
  const fetchIncentivesCopy = async () => {
    try {
      const res = await fetch('/api/cms/home-incentives')
      if (res.ok) {
        const data = await res.json()
        const next = {
          section_number: data.section_number ?? '(2)',
          section_title: data.section_title ?? 'Incentives.',
          description: data.description ?? '',
          is_published: data.is_published ?? false,
          filters: Array.isArray(data.filters) ? data.filters : ['All', 'Live', 'Coming Soon', 'Done'],
        }
        setCopy(next)
        setBaselineCopy(next)
      }
    } catch (e) {
      console.error('Error fetching incentives copy:', e)
    } finally {
      setCopyLoading(false)
    }
  }

  useEffect(() => {
    fetchIncentives()
    fetchIncentivesCopy()
  }, [])

  const saveIncentivesCopy = async (override?: IncentivesCopy) => {
    setCopySaving(true)
    try {
      const res = await fetch('/api/cms/home-incentives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            section_number: (override ?? copy).section_number,
            section_title: (override ?? copy).section_title,
            description: (override ?? copy).description,
            filters: (override ?? copy).filters ?? ['All', 'Live', 'Coming Soon', 'Done'],
          },
          is_published: (override ?? copy).is_published ?? false,
        }),
      })
      if (!res.ok) {
        console.error('Failed to save incentives copy')
      } else {
        // Update baseline so dirty indicators clear
        setBaselineCopy(override ?? copy)
      }
    } catch (e) {
      console.error('Error saving incentives copy:', e)
    } finally {
      setCopySaving(false)
    }
  }

  const handleCreate = async (data: CreateIncentiveData | UpdateIncentiveData) => {
    setFormLoading(true)
    try {
      const response = await fetch('/api/incentives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchIncentives()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating incentive:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: CreateIncentiveData | UpdateIncentiveData) => {
    setFormLoading(true)
    try {
      const response = await fetch(`/api/incentives/${(data as UpdateIncentiveData).id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchIncentives()
        setEditingIncentive(null)
      }
    } catch (error) {
      console.error('Error updating incentive:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingIncentive) return
    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/incentives/${deletingIncentive.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchIncentives()
        setDeletingIncentive(null)
      }
    } catch (error) {
      console.error('Error deleting incentive:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleEdit = (incentive: Incentive) => {
    setEditingIncentive(incentive)
    setShowForm(false)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingIncentive(null)
  }

  const statusRank = (status: Incentive['live_status']) => {
    if (status === 'live') return 0
    if (status === 'coming_up') return 1
    return 2
  }

  const filteredAndSortedIncentives = useMemo(() => {
    const next = [...incentives].sort((a, b) => {
      const byStatus = statusRank(a.live_status) - statusRank(b.live_status)
      if (byStatus !== 0) return byStatus
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    })

    if (statusFilter === 'all') return next
    return next.filter((incentive) => incentive.live_status === statusFilter)
  }, [incentives, statusFilter])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <AdminLayout
    pageKey="admin"
    topBarTitle="Admin"
    breadcrumbs={[
      { name: 'Admin', href: '/admin' },
      { name: 'CMS', href: '/admin/cms' },
      { name: 'Incentives Page' }
    ]}
    >
      <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-4xl font-telegraf font-bold">
                Incentives Management
              </h1>
              <p className="text-gray-400 mt-2">
                Manage incentives displayed on the public sales page
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => window.open('/incentives', '_blank')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              View Incentives Page →
            </Button>
          </div>

          {/* Incentives Section Copy (mirrors home incentives header layout) */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl font-telegraf font-bold">Incentives Section Copy</h2>
            </div>

            {/* Preview cards grid (1:1 with incentives header design) */}
            <div className="pb-10 mb-6">
              {copyLoading ? (
                <div className="text-gray-400">Loading copy...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Title Card */}
                  <CMSgridCard
                    type="text"
                    title={`${copy.section_number} ${copy.section_title}`}
                    className="min-h-[180px] md:col-start-1 md:row-start-1"
                    onClick={() => {
                      setCopyModalType('title')
                      setCopyForm(copy)
                      setIsCopyModalOpen(true)
                    }}
                    dirty={isTitleDirty()}
                  />

                  {/* Description Card */}
                  <CMSgridCard
                    type="text"
                    description={copy.description}
                    className="min-h-[180px] md:col-start-3 md:row-start-1"
                    onClick={() => {
                      setCopyModalType('description')
                      setCopyForm(copy)
                      setIsCopyModalOpen(true)
                    }}
                    dirty={isDescriptionDirty()}
                  />

                  {/* Filters Preview Card - row 2 center column */}
                  <CMSgridCardPills
                    pills={copy.filters || []}
                    className="md:col-start-2 md:row-start-2"
                    onClick={() => {
                      setCopyModalType('filters')
                      setCopyForm(copy)
                      setIsCopyModalOpen(true)
                    }}
                    dirty={isFiltersDirty()}
                  />
                </div>
              )}
            </div>

            {/* Edit Modal for Incentives Copy */}
            {isCopyModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    {copyModalType === 'title' ? 'Edit Title' : copyModalType === 'description' ? 'Edit Description' : 'Edit Filters'}
                  </h3>

                  <div className="space-y-4">
                    {copyModalType === 'title' && (
                      <>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Section Number</label>
                          <input
                            type="text"
                            value={copyForm.section_number}
                            onChange={(e) => setCopyForm({ ...copyForm, section_number: e.target.value })}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Section Title</label>
                          <input
                            type="text"
                            value={copyForm.section_title}
                            onChange={(e) => setCopyForm({ ...copyForm, section_title: e.target.value })}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                          />
                        </div>
                      </>
                    )}

                    {copyModalType === 'description' && (
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Description</label>
                        <textarea
                          value={copyForm.description}
                          onChange={(e) => setCopyForm({ ...copyForm, description: e.target.value })}
                          className="w-full p-2 bg-gray-700 text-white rounded h-24"
                        />
                      </div>
                    )}

                    {copyModalType === 'filters' && (
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Filters (edit labels)</label>
                        <div className="space-y-2">
                          {(copyForm.filters || []).map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={f}
                                onChange={(e) => {
                                  const next = [...(copyForm.filters || [])]
                                  next[i] = e.target.value
                                  setCopyForm({ ...copyForm, filters: next })
                                }}
                                className="flex-1 p-2 bg-gray-700 text-white rounded"
                              />
                              <button
                                onClick={() => {
                                  const next = (copyForm.filters || []).filter((_, idx) => idx !== i)
                                  setCopyForm({ ...copyForm, filters: next })
                                }}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => setCopyForm({ ...copyForm, filters: [...(copyForm.filters || []), 'New Filter'] })}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
                          >
                            Add Filter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={async () => {
                        // Update local copy and persist using override to avoid race conditions
                        setCopy(copyForm)
                        setIsCopyModalOpen(false)
                        await saveIncentivesCopy(copyForm)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsCopyModalOpen(false)}
                      className="bg-gray-600 hover:bg-gray-700 flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* Create/Edit Incentive Modal */}
        {(showForm || editingIncentive) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#333]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">
                  {editingIncentive ? 'Edit Incentive' : 'Create New Incentive'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <IncentiveForm
                incentive={editingIncentive || undefined}
                onSubmit={editingIncentive ? handleUpdate : handleCreate}
                onCancel={handleCancel}
                isLoading={formLoading}
              />
            </div>
          </div>
        )}
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="mb-[100px]"
        >
          Add New Incentive
        </Button>

        {/* Filter control */}
        <div className="mb-6">
          <div className="flex flex-wrap bg-gradient-to-b from-[#232323] to-[#171717] rounded-[60px] p-1 gap-1 w-fit">
            {([
              { value: 'all', label: 'All' },
              { value: 'live', label: 'Live' },
              { value: 'coming_up', label: 'Coming Soon' },
              { value: 'done', label: 'Done' },
            ] as const).map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                  statusFilter === option.value
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Incentives List - Figma row design */}
        <div className="space-y-6">
          {filteredAndSortedIncentives.map((incentive) => {
            const start = new Date(incentive.start_date)
            const end = new Date(incentive.end_date)
            const now = new Date()
            const msLeft = end.getTime() - now.getTime()
            const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
            const statusLabel =
              incentive.live_status === 'live'
                ? 'Live'
                : incentive.live_status === 'coming_up'
                ? 'Coming Soon'
                : 'Done'

            const formattedStart = start.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
            const formattedEnd = end.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })

            return (
              <div
                key={incentive.id}
                className="bg-gradient-to-b from-[#121212] to-[#0f0f0f] border border-[#2a2a2a] rounded-[6px] px-4 py-4 md:px-6 md:py-5 flex items-start gap-5"
              >
                {/* Thumbnail */}
                <div className="w-[132px] h-[132px] rounded-[3px] overflow-hidden flex-shrink-0 bg-[#222]">
                  <img src={incentive.background_image_url} alt={incentive.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {/* Title + Category */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white text-[20px] font-telegraf font-bold truncate">{incentive.title}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-black bg-[#3a3a3a]/20" style={{ backgroundColor: `${incentive.category_color}33`, color: '#ddd' }}>
                      {incentive.category}
                    </span>
                  </div>

                  {/* Status + days left */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      incentive.live_status === 'live'
                        ? 'bg-green-500 text-white'
                        : incentive.live_status === 'coming_up'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>{statusLabel}</span>
                    <span className="text-gray-300 text-sm">{daysLeft} days left</span>
                  </div>

                  {/* Dates */}
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>Starts {formattedStart}</div>
                    <div>Ends {formattedEnd}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3 ml-auto">
                  <button
                    onClick={() => handleEdit(incentive)}
                    className="px-5 py-2 rounded bg-[#2a2f36] hover:bg-[#343a42] text-gray-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingIncentive(incentive)}
                    className="px-5 py-2 rounded bg-[#8b2231] hover:bg-[#9a2737] text-white text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filteredAndSortedIncentives.length === 0 && !showForm && !editingIncentive && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {statusFilter === 'all' ? 'No incentives found' : 'No incentives found for this filter'}
            </div>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              Create Your First Incentive
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingIncentive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-[#333]">
              <h3 className="text-white text-lg font-semibold mb-2">Delete incentive?</h3>
              <p className="text-gray-300 text-sm mb-6">
                Are you sure you want to delete
                {' '}
                <span className="text-white font-medium">{deletingIncentive.title}</span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setDeletingIncentive(null)}
                  className="bg-gray-700 hover:bg-gray-600 flex-1"
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-[#8b2231] hover:bg-[#9a2737] flex-1"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
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
