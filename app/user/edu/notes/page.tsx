'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
  lesson: {
    id: string
    title: string
    course: {
      id: string
      title: string
      slug: string
    }
  }
}

export default function AllNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/edu/notes')
      const data = await response.json()
      setNotes(data.notes || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/edu/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })

      if (response.ok) {
        await fetchNotes()
        setEditingNoteId(null)
        setEditContent('')
      }
    } catch (error) {
      console.error('Error updating note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/edu/notes/${noteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  // Group notes by course
  const notesByCourse = notes.reduce((acc, note) => {
    const courseTitle = note.lesson.course.title
    if (!acc[courseTitle]) {
      acc[courseTitle] = []
    }
    acc[courseTitle].push(note)
    return acc
  }, {} as Record<string, Note[]>)

  if (isLoading) {
    return (
      <AdminLayout pageKey="edu">
        <div className="bg-[#0d0d0d] min-h-screen flex items-center justify-center">
          <div className="text-white font-telegraf">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageKey="edu">
      <div className="bg-[#0d0d0d] min-h-screen">
        <div className="px-4 sm:px-[50px] py-[80px] sm:py-[100px]">
          <div className="max-w-[1200px] mx-auto">
          {/* Back Button */}
          <Link
            href="/user/edu"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-telegraf text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to EDU Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-[36px] sm:text-[56px] font-telegraf font-extrabold text-white mb-3 sm:mb-4 leading-[0.9]">
              All Notes
            </h1>
            <p className="text-white/70 font-telegraf text-base sm:text-lg">
              View and manage all your lesson notes in one place.
            </p>
          </div>

          {/* Notes by Course */}
          {Object.keys(notesByCourse).length > 0 ? (
            <div className="space-y-12">
              {Object.entries(notesByCourse).map(([courseTitle, courseNotes]) => (
                <div key={courseTitle}>
                  <h2 className="text-xl sm:text-2xl font-telegraf font-bold text-white mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-blue-400">{courseTitle}</span>
                    <span className="text-white/40 text-sm sm:text-base">({courseNotes.length} note{courseNotes.length !== 1 ? 's' : ''})</span>
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {courseNotes.map(note => (
                      <div 
                        key={note.id}
                        className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6 hover:border-white/20 transition-all"
                      >
                        {/* Lesson Info */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <Link
                            href={`/user/edu/${note.lesson.course.slug}/${note.lesson.id}`}
                            className="text-blue-400 hover:text-blue-300 font-telegraf text-base font-semibold transition-colors"
                          >
                            {note.lesson.title}
                          </Link>
                          <span className="text-white/40 text-xs font-telegraf flex-shrink-0">
                            {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Note Content */}
                        {editingNoteId === note.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-4 py-3 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white font-telegraf focus:outline-none focus:border-white/40 transition-colors resize-none"
                              rows={6}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateNote(note.id)}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-white text-black hover:bg-white/90 disabled:bg-white/30 rounded-[3px] font-telegraf font-semibold transition-colors"
                              >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-6 py-2 bg-white/10 text-white hover:bg-white/20 rounded-[3px] font-telegraf transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-white/80 font-telegraf text-sm whitespace-pre-wrap mb-4">
                              {note.content}
                            </p>
                            <div className="flex gap-4 pt-3 border-t border-white/5">
                              <Link
                                href={`/user/edu/${note.lesson.course.slug}/${note.lesson.id}`}
                                className="text-blue-400 hover:text-blue-300 text-sm font-telegraf transition-colors"
                              >
                                View Lesson
                              </Link>
                              <button
                                onClick={() => startEdit(note)}
                                className="text-white/60 hover:text-white text-sm font-telegraf transition-colors"
                              >
                                Edit Note
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-red-400 hover:text-red-300 text-sm font-telegraf transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-white/60 font-telegraf text-lg mb-2">No notes yet</p>
              <p className="text-white/40 font-telegraf text-sm mb-6">
                Start taking notes on lessons to see them here.
              </p>
              <Link
                href="/user/edu"
                className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-[3px] font-telegraf font-semibold transition-all"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}

