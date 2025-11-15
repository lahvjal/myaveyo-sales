'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  slug: string
}

interface Lesson {
  id: string
  course_id: string
  title: string
  description: string
  video_url: string
  duration_minutes: number
  sort_order: number
  is_published: boolean
  region: string
  created_at: string
}

interface Region {
  id: string
  name: string
  slug: string
  sort_order: number
}

export default function AdminCourseLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('california')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    sort_order: 0,
    is_published: true,
    region: 'california'
  })

  useEffect(() => {
    fetchRegions()
  }, [])

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  useEffect(() => {
    if (courseId && selectedRegion) {
      fetchLessons()
    }
  }, [courseId, selectedRegion])

  const fetchCourse = async () => {
    try {
      const response = await fetch('/api/admin/edu/courses')
      const data = await response.json()
      const foundCourse = data.courses?.find((c: Course) => c.id === courseId)
      if (foundCourse) {
        setCourse(foundCourse)
      } else {
        router.push('/admin/edu')
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    }
  }

  const fetchRegions = async () => {
    try {
      const response = await fetch('/api/admin/edu/regions')
      const data = await response.json()
      setRegions(data.regions || [])
      if (data.regions && data.regions.length > 0) {
        setSelectedRegion(data.regions[0].slug)
      }
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }

  const fetchLessons = async () => {
    try {
      const response = await fetch(`/api/admin/edu/lessons?courseId=${courseId}&region=${selectedRegion}`)
      const data = await response.json()
      setLessons(data.lessons || [])
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/edu/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: courseId
        })
      })

      if (response.ok) {
        await fetchLessons()
        setShowCreateModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating lesson:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLesson) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/edu/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchLessons()
        setEditingLesson(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating lesson:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      const response = await fetch(`/api/admin/edu/lessons/${lessonId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchLessons()
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      duration_minutes: 0,
      sort_order: 0,
      is_published: true,
      region: selectedRegion
    })
  }

  const startEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url,
      duration_minutes: lesson.duration_minutes || 0,
      sort_order: lesson.sort_order,
      is_published: lesson.is_published,
      region: lesson.region
    })
  }

  const cancelEdit = () => {
    setEditingLesson(null)
    resetForm()
  }

  if (!course && !isLoading) {
    return null
  }

  return (
    <AdminLayout
      pageKey="edu"
      topBarTitle="EDU"
      topBarIcon="/images/edu-icon.png"
      breadcrumbs={[
        { name: 'Courses', href: '/admin/edu' },
        { name: course?.title || 'Loading...' }
      ]}
    >
      <div className="bg-[#0d0d0d] min-h-screen p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Back Button */}
          <Link
            href="/admin/edu"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-telegraf text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-telegraf font-bold text-white mb-2">
                {course?.title} - Lessons
              </h1>
              <p className="text-white/60 font-telegraf text-sm">
                Manage lessons for this course
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({ ...formData, region: selectedRegion })
                setShowCreateModal(true)
              }}
              className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-[3px] font-telegraf font-semibold transition-colors"
            >
              + Add Lesson
            </button>
          </div>

          {/* Region Tabs */}
          {regions.length > 0 && (
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.slug)}
                  className={`
                    px-6 py-3 rounded-[3px] font-telegraf font-semibold transition-all whitespace-nowrap
                    ${selectedRegion === region.slug
                      ? 'bg-gradient-to-r from-[#0859D1] to-[#44A4F9] text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }
                  `}
                >
                  {region.name}
                </button>
              ))}
            </div>
          )}

          {/* Lessons List */}
          {isLoading ? (
            <div className="text-white/60 font-telegraf text-center py-12">Loading...</div>
          ) : lessons.length === 0 ? (
            <div className="text-white/60 font-telegraf text-center py-12">
              No lessons yet. Add your first lesson!
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Lesson Number */}
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 border border-blue-500/40 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 font-telegraf font-bold">{index + 1}</span>
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-telegraf font-bold text-white">{lesson.title}</h3>
                        {!lesson.is_published && (
                          <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-[3px] text-yellow-400 text-xs font-telegraf">
                            Unpublished
                          </span>
                        )}
                      </div>
                      {lesson.description && (
                        <p className="text-white/60 font-telegraf text-sm mb-3">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-white/40 text-xs font-telegraf">
                        <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded text-blue-400">
                          {regions.find(r => r.slug === lesson.region)?.name || lesson.region}
                        </span>
                        <span>•</span>
                        <span>Duration: {lesson.duration_minutes || 0} min</span>
                        <span>•</span>
                        <span>Sort: {lesson.sort_order}</span>
                        <span>•</span>
                        <span className="truncate max-w-xs">Video: {lesson.video_url}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(lesson)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-[3px] font-telegraf text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded-[3px] font-telegraf text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create/Edit Modal */}
          {(showCreateModal || editingLesson) && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#0d0d0d] border border-white/20 rounded-[3px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-telegraf font-bold text-white mb-6">
                  {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                </h2>
                <form onSubmit={editingLesson ? handleUpdate : handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-white/80 font-telegraf text-sm mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-telegraf text-sm mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40 resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-telegraf text-sm mb-2">
                      Google Drive Video URL *
                      <span className="block text-white/40 text-xs mt-1">
                        Paste the full Google Drive link (e.g., https://drive.google.com/file/d/FILE_ID/view)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40"
                      placeholder="https://drive.google.com/file/d/..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-telegraf text-sm mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-telegraf text-sm mb-2">Region *</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40"
                      required
                    >
                      {regions.map((region) => (
                        <option key={region.id} value={region.slug}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 font-telegraf text-sm mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <label htmlFor="is_published" className="text-white/80 font-telegraf text-sm">Published</label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-white text-black hover:bg-white/90 disabled:bg-white/30 rounded-[3px] font-telegraf font-semibold transition-colors"
                    >
                      {isSubmitting ? 'Saving...' : editingLesson ? 'Update Lesson' : 'Add Lesson'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false)
                        cancelEdit()
                      }}
                      className="px-8 py-3 bg-white/10 text-white hover:bg-white/20 rounded-[3px] font-telegraf transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

