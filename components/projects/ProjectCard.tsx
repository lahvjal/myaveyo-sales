import React from 'react'
import { pillClass } from '@/lib/ui/badges'

export type ProjectCardProps = {
  imageUrl: string
  address: string
  lastUpdatedLabel?: string // e.g. "Last updated 1 week ago"
  stageLabel: string // e.g. "Pre-Approval"
  nextMilestoneLabel: string // e.g. "Install Substantial Completion"
  className?: string
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className={pillClass}>{children}</span>
}

/**
 * ProjectCard
 *
 * Large row card showing a thumbnail, address, last-updated meta, stage, and next milestone.
 * Matches Figma with dark gradient background and subtle rounded corners.
 */
export default function ProjectCard({
  imageUrl,
  address,
  lastUpdatedLabel,
  stageLabel,
  nextMilestoneLabel,
  className = '',
}: ProjectCardProps) {
  return (
    <div
      className={[
        'relative flex items-start justify-between overflow-hidden rounded-[3px] bg-gradient-to-b from-[#171717] to-[#111111]',
        className,
      ].join(' ')}
      role="group"
      aria-label={`${address} ${lastUpdatedLabel ?? ''}`.trim()}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 self-stretch w-[142px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Project location thumbnail"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex grow basis-0 flex-col self-stretch gap-[14px] p-5 min-w-0">
        <div className="flex w-full items-center justify-between gap-3">
          <h3 className="text-[20px] font-semibold text-white truncate">{address}</h3>
          {lastUpdatedLabel ? (
            <span className="text-[14px] text-[#888d95] whitespace-nowrap">{lastUpdatedLabel}</span>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between gap-3">
            <span className="text-[14px] text-[#888d95]">Stage:</span>
            <Pill>{stageLabel}</Pill>
          </div>
          <div className="flex w-full items-center justify-between gap-3">
            <span className="text-[14px] text-[#888d95]">Next Milestone:</span>
            <Pill>{nextMilestoneLabel}</Pill>
          </div>
        </div>
      </div>
    </div>
  )
}
