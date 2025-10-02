'use client'

import React, { useState, useEffect } from 'react'
import { Review } from '@/lib/types/review'
import Button from '@/components/Button'
import AdminLayout from '@/components/admin/AdminLayout'
import CMSgridCard from '@/components/admin/CMSgridCard'
import VideoUpload from '@/components/VideoUpload'

// Simple form for creating/updating a Review
interface ReviewFormProps {
  initial?: Partial<Review>
  loading?: boolean
  onSubmit: (data: Partial<Review>) => Promise<void> | void
  onCancel: () => void
}

function ReviewForm({ initial, loading = false, onSubmit, onCancel }: ReviewFormProps) {
  const [form, setForm] = React.useState<Partial<Review>>({
    title: initial?.title || '',
    description: initial?.description || '',
    type: (initial?.type as Review['type']) || 'customer',
    featured: initial?.featured ?? false,
    customer_name: initial?.customer_name || '',
    rep_name: initial?.rep_name || '',
    location: initial?.location || '',
    date_recorded: initial?.date_recorded || new Date().toISOString().slice(0, 10),
    status: (initial?.status as Review['status']) || 'active',
    video_url: initial?.video_url || '',
    thumbnail_url: initial?.thumbnail_url || ''
  })

  const handleChange = (field: keyof Review, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form
      className="text-white space-y-5"
      onSubmit={async (e) => {
        e.preventDefault()
        await onSubmit(form)
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Title</label>
          <input
            className="w-full p-2 bg-gray-800 rounded border border-[#333]"
            value={form.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">Type</label>
          <select
            className="w-full p-2 bg-gray-800 rounded border border-[#333]"
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value as Review['type'])}
          >
            <option value="customer">Customer</option>
            <option value="rep">Rep</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">Location</label>
          <input
            className="w-full p-2 bg-gray-800 rounded border border-[#333]"
            value={form.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">Recorded Date</label>
          <input
            type="date"
            className="w-full p-2 bg-gray-800 rounded border border-[#333]"
            value={form.date_recorded?.slice(0, 10) || ''}
            onChange={(e) => handleChange('date_recorded', e.target.value)}
          />
        </div>
        {form.type === 'customer' ? (
          <div>
            <label className="block text-gray-300 text-sm mb-1">Customer Name</label>
            <input
              className="w-full p-2 bg-gray-800 rounded border border-[#333]"
              value={form.customer_name || ''}
              onChange={(e) => handleChange('customer_name', e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-300 text-sm mb-1">Rep Name</label>
            <input
              className="w-full p-2 bg-gray-800 rounded border border-[#333]"
              value={form.rep_name || ''}
              onChange={(e) => handleChange('rep_name', e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Status</label>
          <select
            className="w-full p-2 bg-gray-800 rounded border border-[#333]"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value as Review['status'])}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="featured"
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => handleChange('featured', e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm text-gray-300">Featured</label>
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Description</label>
        <textarea
          className="w-full p-2 bg-gray-800 rounded border border-[#333] h-24"
          value={form.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      {/* Video Upload */}
      <div className="space-y-3">
        <label className="block text-gray-300 text-sm">Video Upload</label>
        <VideoUpload
          onUploadComplete={(videoUrl, thumbUrl) => {
            handleChange('video_url', videoUrl)
            handleChange('thumbnail_url', thumbUrl)
          }}
          folder="reviews"
        />
        {form.video_url && (
          <div className="text-xs text-gray-400">Video: {form.video_url}</div>
        )}
        {form.thumbnail_url && (
          <div className="text-xs text-gray-400">Thumb: {form.thumbnail_url}</div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button onClick={onCancel} className="bg-gray-700 hover:bg-gray-600" >Cancel</Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Review'}
        </Button>
      </div>
    </form>
  )
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('reviews')

  // Reviews Section Copy (header + description) state
  type ReviewsCopy = {
    section_number: string
    section_title: string
    description: string
    is_published?: boolean
  }
  const [copy, setCopy] = useState<ReviewsCopy>({
    section_number: '(3)',
    section_title: 'Reviews.',
    description: 'Hear from real customers and reps about their experiences with our solar solutions.',
    is_published: false,
  })
  const [baselineCopy, setBaselineCopy] = useState<ReviewsCopy>({
    section_number: '(3)',
    section_title: 'Reviews.',
    description: 'Hear from real customers and reps about their experiences with our solar solutions.',
    is_published: false,
  })
  // Dirty helpers for header cards
  const isTitleDirty = () =>
    copy.section_number !== baselineCopy.section_number || copy.section_title !== baselineCopy.section_title
  const isDescriptionDirty = () => copy.description !== baselineCopy.description
  const [copyLoading, setCopyLoading] = useState(true)
  const [copySaving, setCopySaving] = useState(false)

  // Edit modal for reviews copy
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  const [copyModalType, setCopyModalType] = useState<'title' | 'description' | null>(null)
  const [copyForm, setCopyForm] = useState<ReviewsCopy>({
    section_number: '(3)',
    section_title: 'Reviews.',
    description: '',
    is_published: false,
  })

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?limit=100', { cache: 'no-store' })
      if (!response.ok) throw new Error('Failed to fetch reviews')
      const data = await response.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch reviews copy
  const fetchReviewsCopy = async () => {
    try {
      const res = await fetch('/api/cms/home-reviews')
      if (res.ok) {
        const data = await res.json()
        const next = {
          section_number: data.section_number ?? '(3)',
          section_title: data.section_title ?? 'Reviews.',
          description: data.description ?? '',
          is_published: data.is_published ?? false,
        }
        setCopy(next)
        setBaselineCopy(next)
      }
    } catch (e) {
      console.error('Error fetching reviews copy:', e)
    } finally {
      setCopyLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    fetchReviewsCopy()
  }, [])

  // Save reviews copy
  const saveReviewsCopy = async (override?: Partial<ReviewsCopy>) => {
    setCopySaving(true)
    try {
      const res = await fetch('/api/cms/home-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            section_number: (override ?? copy).section_number,
            section_title: (override ?? copy).section_title,
            description: (override ?? copy).description,
          },
          is_published: (override ?? copy).is_published ?? false,
        }),
      })
      if (!res.ok) {
        console.error('Failed to save reviews copy')
      } else {
        setBaselineCopy({
          section_number: (override ?? copy).section_number!,
          section_title: (override ?? copy).section_title!,
          description: (override ?? copy).description!,
          is_published: (override ?? copy).is_published ?? false,
        })
      }
    } catch (e) {
      console.error('Error saving reviews copy:', e)
    } finally {
      setCopySaving(false)
    }
  }

  // Handle CRUD operations
  const handleCreate = async (reviewData: Partial<Review>) => {
    setFormLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      if (!res.ok) throw new Error('Failed to create review')
      await fetchReviews()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating review:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (reviewData: Partial<Review>) => {
    setFormLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      if (!res.ok) throw new Error('Failed to update review')
      await fetchReviews()
      setEditingReview(null)
    } catch (error) {
      console.error('Error updating review:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setShowForm(false)
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(reviewId)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete review')
      await fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingReview(null)
  }

  if (loading) {
    return (
      <AdminLayout
      pageKey="admin"
      topBarTitle="Admin"
      breadcrumbs={[
        { name: 'Admin', href: '/admin' },
        { name: 'CMS', href: '/admin/cms' },
        { name: 'Reviews Page' }
      ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading reviews...</div>
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
      { name: 'Reviews Page' }
    ]}
    >
      <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-4xl font-telegraf font-bold">
                Reviews Management
              </h1>
              <p className="text-gray-400 mt-2">
                Manage customer and rep review videos displayed on the public pages
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => window.open('/reviews', '_blank')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              View Reviews Page →
            </Button>
          </div>

          {/* Reviews Section Copy (mirrors home reviews header layout) */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl font-telegraf font-bold">Reviews Section Copy</h2>
            </div>

            {/* Preview cards grid (1:1 with reviews header design) */}
            <div className="pb-10 mb-6">
              {copyLoading ? (
                <div className="text-gray-400">Loading copy...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Title Card */}
                  <CMSgridCard
                    type="text"
                    title={`${copy.section_number} ${copy.section_title}`}
                    className="md:col-start-2 md:row-start-1"
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
                    className="md:col-start-2 md:row-start-2"
                    onClick={() => {
                      setCopyModalType('description')
                      setCopyForm(copy)
                      setIsCopyModalOpen(true)
                    }}
                    dirty={isDescriptionDirty()}
                  />
                </div>
              )}
            </div>

            {/* Edit Modal for Reviews Copy */}
            {isCopyModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    {copyModalType === 'title' ? 'Edit Title' : 'Edit Description'}
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
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={async () => {
                        // Update local copy and persist using override to avoid race conditions
                        setCopy(copyForm)
                        setIsCopyModalOpen(false)
                        await saveReviewsCopy(copyForm)
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

          {/* Create/Edit Review Modal */}
          {(showForm || editingReview) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-900 p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#333]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    {editingReview ? 'Edit Review' : 'Create New Review'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-white"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <ReviewForm
                  initial={editingReview || undefined}
                  loading={formLoading}
                  onCancel={handleCancel}
                  onSubmit={async (data) => {
                    if (editingReview?.id) {
                      await handleUpdate({ id: editingReview.id, ...data })
                    } else {
                      await handleCreate(data)
                    }
                  }}
                />
              </div>
            </div>
          )}

          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            className="mb-[100px]"
          >
            Add New Review
          </Button>

          {/* Reviews List - Figma row design */}
          <div className="space-y-6">
            {reviews.map((review) => {
              const recordedDate = new Date(review.date_recorded)
              const formattedDate = recordedDate.toLocaleDateString(undefined, { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })

              return (
                <div
                  key={review.id}
                  className="bg-gradient-to-b from-[#121212] to-[#0f0f0f] border border-[#2a2a2a] rounded-[6px] px-4 py-4 md:px-6 md:py-5 flex items-start gap-5"
                >
                  {/* Thumbnail */}
                  <div className="w-[132px] h-[132px] rounded-[3px] overflow-hidden flex-shrink-0 bg-[#222] relative">
                    <img src={review.thumbnail_url} alt={review.title} className="w-full h-full object-cover" />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-black border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {/* Title + Type */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white text-[20px] font-telegraf font-bold truncate">{review.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        review.type === 'customer' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                      }`}>
                        {review.type === 'customer' ? 'Customer' : 'Rep'}
                      </span>
                      {review.featured && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Status + Name */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        review.status === 'active' ? 'bg-green-500 text-white' : 
                        review.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                      }`}>{review.status}</span>
                      <span className="text-gray-300 text-sm">
                        {review.type === 'customer' ? review.customer_name : review.rep_name}
                      </span>
                    </div>

                    {/* Location and Date */}
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>{review.location}</div>
                      <div>Recorded {formattedDate}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3 ml-auto">
                    <button
                      onClick={() => handleEdit(review)}
                      className="px-5 py-2 rounded bg-[#2a2f36] hover:bg-[#343a42] text-gray-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id!)}
                      className="px-5 py-2 rounded bg-[#8b2231] hover:bg-[#9a2737] text-white text-sm font-medium"
                    >
                      Delete
                    </button>
                    <div className="opacity-60">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <span className="block w-4 h-0.5 bg-gray-400 rounded mb-1" />
                        <span className="block w-4 h-0.5 bg-gray-400 rounded mb-1" />
                        <span className="block w-4 h-0.5 bg-gray-400 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                No reviews found
              </div>
              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
              >
                Add Your First Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
