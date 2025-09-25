import React from 'react'

export type Top3CardProps = {
  rank: 1 | 2 | 3
  name: string
  tsi: string | number
  tss: string | number
}

function getRankIconFromRank(rank: 1 | 2 | 3) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  return '🥉'
}

export default function Top3Card({ rank, name, tsi, tss }: Top3CardProps) {
  const leftGradient =
    rank === 1
      ? 'from-[#514629] to-[#342e22]'
      : rank === 2
      ? 'from-[#4a4a4a] to-[#2a2a2a]'
      : 'from-[#5d4037] to-[#3e2723]'

  return (
    <div className="bg-gradient-to-t from-[#0d0d0d] to-[#171717] rounded-[3px] h-[180px] relative flex items-start justify-between overflow-clip">
      <div className={`bg-gradient-to-b h-full w-[59px] flex flex-col items-center justify-center gap-[15px] ${leftGradient}`}>
        <div className="text-2xl">{getRankIconFromRank(rank)}</div>
        <div className="text-white text-[14px] font-telegraf font-black">#{rank}</div>
      </div>
      <div className="flex flex-col items-center justify-center gap-[10px] px-2 grow h-full">
        <div className="text-white text-[25px] font-telegraf font-black">{name}</div>
        <div className="flex items-center gap-[10px]">
          <div className="text-white text-[17px] font-telegraf font-black">{tsi}</div>
          <div className="text-[rgba(255,255,255,0.5)] text-[17px] font-telegraf font-light">TSI</div>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="text-[rgba(255,255,255,0.5)] text-[17px] font-telegraf font-light">{tss}</div>
          <div className="text-[rgba(255,255,255,0.5)] text-[17px] font-telegraf font-light">TSS</div>
        </div>
      </div>
    </div>
  )
}
