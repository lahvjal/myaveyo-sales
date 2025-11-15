'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import CourseCard from '@/components/edu/CourseCard'
import ProgressTracker from '@/components/edu/ProgressTracker'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  slug: string
}

interface ProgressData {
  totalLessons: number
  completedLessons: number
  recentCompleted: {
    lesson: {
      id: string
      title: string
      course: {
        title: string
        slug: string
      }
    }
  } | null
  nextLesson: {
    id: string
    title: string
    course: {
      title: string
      slug: string
    }
  } | null
}

interface CoursesWithProgress extends Course {
  completedLessons: number
  totalLessons: number
}

export default function EduDashboard() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [coursesWithProgress, setCoursesWithProgress] = useState<CoursesWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch courses
      const coursesRes = await fetch('/api/edu/courses')
      const coursesData = await coursesRes.json()
      setCourses(coursesData.courses || [])

      // Fetch overall progress
      const progressRes = await fetch('/api/edu/progress')
      const progressData = await progressRes.json()
      setProgress(progressData)

      // Fetch detailed progress for each course
      const coursesWithProgressPromises = (coursesData.courses || []).map(async (course: Course) => {
        const courseRes = await fetch(`/api/edu/courses/${course.slug}`)
        const courseData = await courseRes.json()
        const completedCount = courseData.lessons?.filter((l: any) => l.completed).length || 0
        const totalCount = courseData.lessons?.length || 0
        return {
          ...course,
          completedLessons: completedCount,
          totalLessons: totalCount
        }
      })

      const coursesProgress = await Promise.all(coursesWithProgressPromises)
      setCoursesWithProgress(coursesProgress)
    } catch (error) {
      console.error('Error fetching EDU data:', error)
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

  return (
    <AdminLayout pageKey="edu">
      <div className="bg-[#0d0d0d] min-h-screen">
        <div className="px-4 sm:px-[50px] py-[80px] sm:py-[100px]">
          <div className="max-w-[1480px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 mb-6">
              <div className="flex-grow">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-white/60 text-[14px] font-telegraf mt-3">(E)</span>
                  <h1 className="text-[40px] sm:text-[64px] font-telegraf font-extrabold uppercase leading-[0.9] text-white">
                    Education<br />
                    <span className="text-transparent bg-gradient-to-r from-[#9EC5FE] via-[#0859D1] to-[#44A4F9] bg-clip-text">
                      Center.
                    </span>
                  </h1>
                </div>
                <p className="text-white/70 font-telegraf text-base sm:text-lg max-w-2xl">
                  Master solar sales through comprehensive video training. Watch lessons, track your progress, and take notes as you learn.
                </p>
              </div>
              <Link
                href="/user/edu/notes"
                className="w-full sm:w-auto text-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-[3px] font-telegraf font-semibold transition-all whitespace-nowrap"
              >
                View All Notes
              </Link>
            </div>

            {/* Overall Progress */}
            {progress && (
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6">
                <ProgressTracker 
                  completed={progress.completedLessons} 
                  total={progress.totalLessons}
                  size="large"
                />
              </div>
            )}
          </div>

          {/* Current/Next Lesson Cards */}
          {(progress?.recentCompleted || progress?.nextLesson) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {progress.recentCompleted && (
                <div className="bg-gradient-to-b from-green-500/10 to-[#0d0d0d] border border-green-500/30 rounded-[3px] p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-telegraf font-semibold text-green-400 mb-1">Recently Completed</h3>
                      <p className="text-white font-telegraf text-lg font-semibold mb-1">
                        {progress.recentCompleted.lesson.title}
                      </p>
                      <p className="text-white/60 font-telegraf text-sm">
                        {progress.recentCompleted.lesson.course.title}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/user/edu/${progress.recentCompleted.lesson.course.slug}/${progress.recentCompleted.lesson.id}`}
                    className="text-green-400 hover:text-green-300 font-telegraf text-sm transition-colors"
                  >
                    Review Lesson →
                  </Link>
                </div>
              )}

              {progress.nextLesson && (
                <div className="bg-gradient-to-b from-blue-500/10 to-[#0d0d0d] border border-blue-500/30 rounded-[3px] p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-telegraf font-semibold text-blue-400 mb-1">Up Next</h3>
                      <p className="text-white font-telegraf text-lg font-semibold mb-1">
                        {progress.nextLesson.title}
                      </p>
                      <p className="text-white/60 font-telegraf text-sm">
                        {progress.nextLesson.course.title}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/user/edu/${progress.nextLesson.course.slug}/${progress.nextLesson.id}`}
                    className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-[3px] font-telegraf font-semibold transition-colors"
                  >
                    Continue Learning →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Courses Grid */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-telegraf font-bold text-white mb-6">Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {coursesWithProgress.map(course => (
                <CourseCard
                  key={course.id}
                  {...course}
                />
              ))}
            </div>
          </div>

          {coursesWithProgress.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 font-telegraf">No courses available yet.</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}
