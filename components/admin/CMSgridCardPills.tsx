import React from 'react'

interface CMSgridCardPillsProps {
  pills: string[]
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  dirty?: boolean
}

/**
 * Variation of CMSgridCard that displays a set of non-interactive pills.
 * Used for previewing filter chips in CMS cards while keeping consistent styling.
 */
export default function CMSgridCardPills({ pills, className = '', style, onClick, dirty = false }: CMSgridCardPillsProps) {
  return (
    <div
      className={`relative bg-gradient-to-b from-[#171717] to-[#111111] rounded-[3px] p-5 flex flex-col justify-between cursor-pointer hover:from-[#1a1a1a] hover:to-[#141414] min-h-[210px] ${className}`}
      style={style}
      onClick={onClick}
    >
      {dirty && (
        <span
          className="absolute top-2 right-2 inline-block size-2.5 rounded-full bg-orange-400 ring-2 ring-black"
          title="Unsaved changes"
        />
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        {pills.map((label, idx) => (
          <span
            key={`${label}-${idx}`}
            className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold ${
              idx === 0 ? 'bg-white text-black' : 'bg-gradient-to-b from-[#232323] to-[#171717] text-white'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[#888d95] text-sm mt-4">
        <span>Edit</span>
        <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
          <path d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z" fill="#888d95"/>
        </svg>
      </div>
    </div>
  )
}
