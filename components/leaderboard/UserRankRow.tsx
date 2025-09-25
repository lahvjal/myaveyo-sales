import React from 'react'

export type UserRankRowProps = {
  rank: number
  name: string
  tsi: string | number
  tss: string | number
  withLabels?: boolean // when true, show 'TSI' and 'TSS' next to numbers (standalone usage)
}

function getRankIconFromRank(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

export default function UserRankRow({ rank, name, tsi, tss, withLabels = false }: UserRankRowProps) {
  return (
    <div
      className="grid gap-4 p-6 hover:bg-white/5 transition-colors bg-[rgb(16,16,16)] rounded-[3px]"
      style={{ gridTemplateColumns: '80px 1fr 1fr 1fr' }}
    >
      <div className="flex items-center">
        <span className="text-white text-[18px] font-telegraf font-bold">{getRankIconFromRank(rank)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-white text-[16px] font-telegraf font-semibold">{name}</span>
      </div>
      <div className="flex items-center justify-center">
        <span className="text-white text-[18px] font-telegraf font-bold">{tsi}</span>
        {withLabels && (
          <span className="ml-2 text-[rgba(255,255,255,0.7)] text-[16px] font-telegraf font-light">TSI</span>
        )}
      </div>
      <div className="flex items-center justify-center">
        <span className="text-[18px] font-telegraf font-light text-[rgba(255,255,255,0.5)]">{tss}</span>
        {withLabels && (
          <span className="ml-2 text-[rgba(255,255,255,0.7)] text-[16px] font-telegraf font-light">TSS</span>
        )}
      </div>
    </div>
  )
}
