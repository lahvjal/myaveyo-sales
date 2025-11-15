'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

interface Course {
  id: string
  title: string
  description: string
  slug: string
  sort_order: number
  is_published: boolean
  created_at: string
}

export default function AdminEduPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    sort_order: 0,
    is_published: true
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/edu/courses')
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const response = await fetch('/api/admin/edu/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCourses()
        setShowCreateModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating course:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourse) return

    setIsCreating(true)
    try {
      const response = await fetch(`/api/admin/edu/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCourses()
        setEditingCourse(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating course:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all lessons.')) return

    try {
      const response = await fetch(`/api/admin/edu/courses/${courseId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCourses()
      }
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      slug: '',
      sort_order: 0,
      is_published: true
    })
  }

  const startEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      slug: course.slug,
      sort_order: course.sort_order,
      is_published: course.is_published
    })
  }

  const cancelEdit = () => {
    setEditingCourse(null)
    resetForm()
  }

  return (
    <AdminLayout
      pageKey="edu"
      topBarTitle="EDU"
      topBarIcon="/images/edu-icon.png"
      topBarTabs={[
        { id: 'courses', name: 'Courses', href: '/admin/edu' }
      ]}
      activeTab="courses"
    >
      <div className="bg-[#0d0d0d] min-h-screen p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-telegraf font-bold text-white">Course Management</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-[3px] font-telegraf font-semibold transition-colors"
            >
              + Create Course
            </button>
          </div>

          {/* Courses List */}
          {isLoading ? (
            <div className="text-white/60 font-telegraf text-center py-12">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="text-white/60 font-telegraf text-center py-12">
              No courses yet. Create your first course!
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-telegraf font-bold text-white">{course.title}</h3>
                        {!course.is_published && (
                          <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-[3px] text-yellow-400 text-xs font-telegraf">
                            Unpublished
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 font-telegraf text-sm mb-3">{course.description}</p>
                      <div className="flex items-center gap-4 text-white/40 text-xs font-telegraf">
                        <span>Slug: {course.slug}</span>
                        <span>•</span>
                        <span>Sort: {course.sort_order}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => router.push(`/admin/edu/courses/${course.id}`)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 rounded-[3px] font-telegraf text-sm transition-colors"
                      >
                        Manage Lessons
                      </button>
                      <button
                        onClick={() => startEdit(course)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-[3px] font-telegraf text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
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
          {(showCreateModal || editingCourse) && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#0d0d0d] border border-white/20 rounded-[3px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-telegraf font-bold text-white mb-6">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>
                <form onSubmit={editingCourse ? handleUpdate : handleCreate} className="space-y-4">
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
                    <label className="block text-white/80 font-telegraf text-sm mb-2">Slug * (URL-friendly)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-telegraf text-sm mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
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
                      disabled={isCreating}
                      className="px-8 py-3 bg-white text-black hover:bg-white/90 disabled:bg-white/30 rounded-[3px] font-telegraf font-semibold transition-colors"
                    >
                      {isCreating ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
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

