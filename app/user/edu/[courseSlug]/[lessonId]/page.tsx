'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import GoogleDriveVideo from '@/components/edu/GoogleDriveVideo'
import LessonNotes from '@/components/edu/LessonNotes'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  description?: string
  video_url: string
  duration_minutes?: number
  completed: boolean
  completed_at?: string
  course: {
    id: string
    title: string
    slug: string
  }
}

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
}

interface Navigation {
  previous: { id: string; title: string } | null
  next: { id: string; title: string } | null
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params.courseSlug as string
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [navigation, setNavigation] = useState<Navigation>({ previous: null, next: null })
  const [isLoading, setIsLoading] = useState(true)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)

  useEffect(() => {
    if (lessonId) {
      fetchLessonData()
    }
  }, [lessonId])

  const fetchLessonData = async () => {
    try {
      const response = await fetch(`/api/edu/lessons/${lessonId}`)
      if (!response.ok) {
        throw new Error('Lesson not found')
      }
      const data = await response.json()
      setLesson(data.lesson)
      setNotes(data.notes || [])
      setNavigation(data.navigation)
    } catch (error) {
      console.error('Error fetching lesson:', error)
      router.push('/user/edu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!lesson || isMarkingComplete) return

    setIsMarkingComplete(true)
    try {
      const response = await fetch('/api/edu/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          completed: true
        })
      })

      if (response.ok) {
        setLesson({
          ...lesson,
          completed: true,
          completed_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error)
    } finally {
      setIsMarkingComplete(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout pageKey="edu">
        <div className="bg-[#0d0d0d] min-h-screen flex items-center justify-center">
          <div className="text-white font-telegraf">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!lesson) {
    return null
  }

  return (
    <AdminLayout pageKey="edu">
      <div className="bg-[#0d0d0d] min-h-screen">
        <div className="px-4 sm:px-[50px] py-[80px] sm:py-[100px]">
          <div className="max-w-[1200px] mx-auto">
          {/* Back Button */}
          <Link
            href={`/user/edu/${courseSlug}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-telegraf text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {lesson.course.title}
          </Link>

          {/* Lesson Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-2">
              <h1 className="text-[28px] sm:text-[44px] font-telegraf font-extrabold text-white leading-[1.1]">
                {lesson.title}
              </h1>
              {lesson.completed && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-[3px] flex-shrink-0 w-fit">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400 font-telegraf text-sm font-semibold">Completed</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-white/50 text-xs sm:text-sm font-telegraf flex-wrap">
              <span>{lesson.course.title}</span>
              {lesson.duration_minutes && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>{lesson.duration_minutes} min</span>
                </>
              )}
            </div>
          </div>

          {/* Video Player */}
          <div className="mb-8">
            <GoogleDriveVideo videoUrl={lesson.video_url} title={lesson.title} />
          </div>

          {/* Description and Mark Complete */}
          <div className="mb-8 bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6">
            {lesson.description && (
              <p className="text-white/80 font-telegraf text-base mb-6">
                {lesson.description}
              </p>
            )}
            {!lesson.completed && (
              <button
                onClick={handleMarkComplete}
                disabled={isMarkingComplete}
                className="px-8 py-3 bg-gradient-to-r from-[#0859D1] to-[#44A4F9] hover:from-[#0749B1] hover:to-[#3494E9] text-white rounded-[3px] font-telegraf font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMarkingComplete ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Marking Complete...
                  </span>
                ) : (
                  'Mark as Complete'
                )}
              </button>
            )}
            {lesson.completed && lesson.completed_at && (
              <p className="text-green-400 font-telegraf text-sm">
                Completed on {new Date(lesson.completed_at).toLocaleDateString()} at {new Date(lesson.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Notes Section */}
          <div className="mb-8 bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6">
            <LessonNotes 
              lessonId={lesson.id} 
              initialNotes={notes}
              onNotesChange={fetchLessonData}
            />
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 sm:gap-4">
            {navigation.previous ? (
              <Link
                href={`/user/edu/${courseSlug}/${navigation.previous.id}`}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-[3px] font-telegraf text-sm sm:text-base transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous:</span>
                <span className="truncate max-w-[200px] sm:max-w-none">{navigation.previous.title}</span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {navigation.next && (
              <Link
                href={`/user/edu/${courseSlug}/${navigation.next.id}`}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0859D1] to-[#44A4F9] hover:from-[#0749B1] hover:to-[#3494E9] text-white rounded-[3px] font-telegraf text-sm sm:text-base font-semibold transition-all sm:ml-auto order-first sm:order-last"
              >
                <span className="hidden sm:inline">Next:</span>
                <span className="truncate max-w-[200px] sm:max-w-none">{navigation.next.title}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}

