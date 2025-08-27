import React from 'react'
import Button from './Button'

interface LetsTalkCardProps {
  onClick?: () => void
  className?: string
  backgroundImage?: string
}

const imgCtaSmall = "http://localhost:3845/assets/9e76bd435a037801fde2cb5914636ad4afe51b19.png"
const imgVector117 = "http://localhost:3845/assets/b74939b67987caa88b59e0e1a8a00f872135632d.svg"

export default function LetsTalkCard({ 
  onClick, 
  className = '',
  backgroundImage = imgCtaSmall
}: LetsTalkCardProps) {
  return (
    <div
      className={`bg-center bg-cover bg-no-repeat box-border content-stretch flex gap-2.5 items-end justify-center p-0 relative rounded-[3px] h-[151px] cursor-pointer ${className}`}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onClick={onClick}
      data-name="CTA_small"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#333537] border-solid inset-0 pointer-events-none rounded-[3px]"
      />
      <Button 
        variant="primary" 
        onClick={onClick}
        icon={imgVector117}
        className="rounded-sm"
      >
        LET'S TALK
      </Button>
    </div>
  )
}
