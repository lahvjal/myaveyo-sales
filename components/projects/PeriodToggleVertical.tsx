'use client'

import React from 'react'

export type Period = 'YTD' | 'MTD'

export type PeriodToggleVerticalProps = {
  value: Period
  onChange: (value: Period) => void
  className?: string
}

/**
 * PeriodToggleVertical
 *
 * Vertical segmented control for switching between YTD and MTD.
 * Keyboard accessible (ArrowUp/ArrowDown, Home/End) and screen-reader friendly.
 */
export default function PeriodToggleVertical({ value, onChange, className = '' }: PeriodToggleVerticalProps) {
  const options: Period[] = ['YTD', 'MTD']

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = options.indexOf(value)
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault()
      onChange(options[Math.min(options.length - 1, idx + 1)])
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      onChange(options[Math.max(0, idx - 1)])
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(options[0])
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(options[options.length - 1])
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Period"
      onKeyDown={handleKeyDown}
      className={[
        'inline-flex flex-col overflow-hidden rounded-[3px] border border-[#2a2e33] bg-[#0f1012]',
        className,
      ].join(' ')}
    >
      {options.map((opt, i) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt)}
            className={[
              'min-w-[56px] px-3 py-2 text-[12px] uppercase tracking-wide outline-none transition-colors h-full',
              i > 0 ? 'border-t border-[#2a2e33]' : '',
              selected
                ? 'bg-[#e6e6e6] text-black'
                : 'text-[#888d95] hover:bg-white/5'
            ].join(' ')}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
