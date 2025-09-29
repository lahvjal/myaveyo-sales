import React from 'react'

export type ProjectMilestoneCardProps = {
  label: string
  value: number | string
  sublabel?: string
  dotColor?: string // Tailwind color class or hex value (e.g. 'bg-yellow-400' or '#f2c94c')
  className?: string
  active?: boolean
  onClick?: () => void
}

/**
 * ProjectMilestoneCard
 *
 * A compact stat card used on the Projects page for milestone summaries.
 * Matches the Figma spec: dark gradient background, thin blue border, small status dot, uppercase label,
 * large value, and muted sublabel (e.g., YTD).
 */
export default function ProjectMilestoneCard({
  label,
  value,
  sublabel,
  dotColor = '#f2c94c',
  className = '',
  active = false,
  onClick,
}: ProjectMilestoneCardProps) {
  // If dotColor is a tailwind class like 'bg-yellow-400', we apply it as a class.
  // If it looks like a hex/rgb value, we fall back to inline style.
  const isTailwindClass = typeof dotColor === 'string' && dotColor.startsWith('bg-')

  return (
    <div
      className={[
        // container
        'relative rounded-[3px] bg-gradient-to-b from-[#171717] to-[#111111] transition-colors',
        active ? 'ring-2 ring-[#254052]' : 'ring-0',
        onClick ? 'cursor-pointer hover:bg-[#141414]' : '',
        className,
      ].join(' ')}
      role={onClick ? 'button' : 'group'}
      aria-pressed={onClick ? active : undefined}
      aria-label={`${label}: ${value} ${sublabel ?? ''}`.trim()}
      onClick={onClick}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (!onClick) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex flex-col justify-center items-center p-5 gap-3 min-h-[180px]">
        {/* Header with dot and label */}
        <div className="w-full flex items-center gap-2">
          <span
            className={[
              'inline-block size-[13px] shrink-0 rounded-full',
              isTailwindClass ? dotColor : '',
            ].join(' ')}
            style={!isTailwindClass ? { backgroundColor: dotColor as string } : undefined}
            aria-hidden
          />
          <span className="text-[12px] uppercase text-[#888d95] tracking-wide">
            {label}
          </span>
        </div>

        {/* Value and sublabel */}
        <div className="w-full flex flex-1 flex-col items-center justify-center gap-[7px]">
          <div className="text-white text-[20px] font-semibold leading-none" aria-live="polite">
            {value}
          </div>
          {sublabel ? (
            <div className="text-[14px] text-[#888d95] leading-none">{sublabel}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
