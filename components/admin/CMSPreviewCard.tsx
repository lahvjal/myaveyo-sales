import React from 'react'

export type CMSPreviewCardType = 'text' | 'image' | 'stat' | 'description'

export interface CMSPreviewCardProps {
  type: CMSPreviewCardType
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

/**
 * Reusable CMS preview card used in admin CMS previews.
 * Matches existing styling used across CMS preview grids.
 */
export default function CMSPreviewCard({
  type,
  title,
  subtitle,
  description,
  imageUrl,
  className = '',
  style,
  onClick,
}: CMSPreviewCardProps) {
  return (
    <div
      className={`bg-gradient-to-b from-[#171717] to-[#111111] rounded-[3px] p-5 flex flex-col justify-between cursor-pointer hover:from-[#1a1a1a] hover:to-[#141414] ${className}`}
      style={style}
      onClick={onClick}
    >
      <div className="flex flex-col justify-between h-full">
        {type === 'image' ? (
          <>
            <div className="flex-grow bg-gray-600 rounded mb-2 min-h-[100px] flex items-center justify-center">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={title || 'Preview Image'} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-gray-400 text-sm">Image Placeholder</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#888d95] text-sm">
              <span>Edit</span>
              <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                <path d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z" fill="#888d95"/>
              </svg>
            </div>
          </>
        ) : (
          <>
            {title && (
              <div className="text-white text-xl font-bold mb-2">{title}</div>
            )}
            {subtitle && (
              <div className="text-white text-xs mb-2">{subtitle}</div>
            )}
            {description && (
              <div className="text-white text-xs mb-4 flex-grow">{description}</div>
            )}
            <div className="flex items-center gap-2 text-[#888d95] text-sm">
              <span>Edit</span>
              <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                <path d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z" fill="#888d95"/>
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
