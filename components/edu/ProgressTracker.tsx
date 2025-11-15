'use client'

interface ProgressTrackerProps {
  completed: number
  total: number
  size?: 'small' | 'medium' | 'large'
}

export default function ProgressTracker({ 
  completed, 
  total, 
  size = 'medium' 
}: ProgressTrackerProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0

  const sizeClasses = {
    small: 'h-1.5',
    medium: 'h-2',
    large: 'h-3'
  }

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`${textSizeClasses[size]} font-telegraf text-white/60`}>
          Overall Progress
        </span>
        <span className={`${textSizeClasses[size]} font-telegraf font-semibold text-white/80`}>
          {completed}/{total} lessons
        </span>
      </div>
      <div className={`w-full bg-white/10 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div 
          className="bg-gradient-to-r from-[#0859D1] to-[#44A4F9] h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right">
        <span className={`${textSizeClasses[size]} font-telegraf font-bold text-blue-400`}>
          {Math.round(progress)}% Complete
        </span>
      </div>
    </div>
  )
}

