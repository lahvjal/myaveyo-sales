'use client'

import Link from 'next/link'

interface LessonListItemProps {
  id: string
  title: string
  description?: string
  duration_minutes?: number
  completed: boolean
  courseSlug: string
}

export default function LessonListItem({
  id,
  title,
  description,
  duration_minutes,
  completed,
  courseSlug
}: LessonListItemProps) {
  return (
    <Link href={`/user/edu/${courseSlug}/${id}`}>
      <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-5 hover:border-white/20 transition-all duration-300 group cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Completion Status */}
          <div className="flex-shrink-0 mt-1">
            {completed ? (
              <div className="w-6 h-6 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 bg-white/5 border-2 border-white/20 rounded-full group-hover:border-blue-400/50 transition-colors" />
            )}
          </div>

          {/* Lesson Info */}
          <div className="flex-grow">
            <h4 className="text-lg font-telegraf font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {title}
            </h4>
            {description && (
              <p className="text-white/60 font-telegraf text-sm mb-2 line-clamp-2">
                {description}
              </p>
            )}
            {duration_minutes && (
              <div className="flex items-center gap-2 text-white/50 text-xs font-telegraf">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{duration_minutes} min</span>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 text-white/30 group-hover:text-white/60 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

