'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import LessonListItem from '@/components/edu/LessonListItem'
import ProgressTracker from '@/components/edu/ProgressTracker'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  slug: string
}

interface Lesson {
  id: string
  title: string
  description?: string
  duration_minutes?: number
  completed: boolean
  sort_order: number
  region: string
}

interface Region {
  id: string
  name: string
  slug: string
  sort_order: number
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params.courseSlug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('california')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRegions()
  }, [])

  useEffect(() => {
    if (courseSlug && selectedRegion) {
      fetchCourseData()
    }
  }, [courseSlug, selectedRegion])

  const fetchRegions = async () => {
    try {
      const response = await fetch('/api/edu/regions')
      const data = await response.json()
      setRegions(data.regions || [])
      if (data.regions && data.regions.length > 0) {
        setSelectedRegion(data.regions[0].slug)
      }
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/edu/courses/${courseSlug}?region=${selectedRegion}`)
      if (!response.ok) {
        throw new Error('Course not found')
      }
      const data = await response.json()
      setCourse(data.course)
      setLessons(data.lessons || [])
    } catch (error) {
      console.error('Error fetching course:', error)
      router.push('/user/edu')
    } finally {
      setIsLoading(false)
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

  if (!course) {
    return null
  }

  const completedCount = lessons.filter(l => l.completed).length
  const totalCount = lessons.length

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

          {/* Course Header */}
          <div className="mb-12">
            <h1 className="text-[36px] sm:text-[56px] font-telegraf font-extrabold text-white mb-4 leading-[0.9]">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-white/70 font-telegraf text-base sm:text-lg mb-8 max-w-3xl">
                {course.description}
              </p>
            )}

            {/* Region Tabs */}
            {regions.length > 0 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.slug)}
                    className={`
                      px-4 sm:px-6 py-2 sm:py-3 rounded-[3px] font-telegraf text-sm sm:text-base font-semibold transition-all whitespace-nowrap
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

            {/* Progress */}
            <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6">
              <ProgressTracker 
                completed={completedCount} 
                total={totalCount}
                size="medium"
              />
            </div>
          </div>

          {/* Lessons List */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-telegraf font-bold text-white mb-4 sm:mb-6">
              Lessons ({totalCount})
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {lessons.map(lesson => (
                <LessonListItem
                  key={lesson.id}
                  {...lesson}
                  courseSlug={courseSlug}
                />
              ))}
            </div>
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 font-telegraf">No lessons available yet.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}

