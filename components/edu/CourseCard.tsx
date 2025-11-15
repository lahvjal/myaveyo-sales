'use client'

import Link from 'next/link'

interface CourseCardProps {
  id: string
  title: string
  description: string
  slug: string
  completedLessons?: number
  totalLessons?: number
}

export default function CourseCard({
  title,
  description,
  slug,
  completedLessons = 0,
  totalLessons = 0
}: CourseCardProps) {
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <Link href={`/user/edu/${slug}`}>
      <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6 hover:border-white/20 transition-all duration-300 h-full group cursor-pointer">
        <div className="flex flex-col h-full">
          <h3 className="text-2xl font-telegraf font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-white/70 font-telegraf text-sm mb-6 flex-grow">
            {description}
          </p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-telegraf">
              <span className="text-white/60">Progress</span>
              <span className="text-white/80">
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#0859D1] to-[#44A4F9] h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-telegraf font-semibold text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

