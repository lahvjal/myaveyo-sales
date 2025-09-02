import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  theme?: 'light' | 'dark'
}

const imgVector116 = "http://localhost:3845/assets/5fe2a32dc067120eb3a1b0499801e0069a379f4e.svg"

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  icon,
  type = 'button',
  disabled = false,
  theme = 'light'
}: ButtonProps) {
  const baseStyles = "box-border content-stretch flex gap-2.5 items-center justify-center p-[20px] relative rounded-[3px] font-extrabold text-[14px] transition-colors cursor-pointer"
  
  const getVariantStyles = () => {
    if (theme === 'dark') {
      return {
        primary: "bg-[#0d0d0d] text-[#ffffff] hover:bg-[#1a1a1a]",
        secondary: "border border-[#0d0d0d] text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-[#ffffff]"
      }
    }
    
    return {
      primary: "bg-[#ffffff] text-[#121212] hover:bg-gray-100",
      secondary: "border border-[#ffffff] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#121212]"
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      data-name="button"
    >
      <span className="font-inter font-extrabold leading-[0] not-italic text-nowrap">
        {children}
      </span>
      {(variant === 'primary' || icon) && (
        <div className="h-0 relative shrink-0 w-[22.195px]">
          <div className="absolute bottom-[-3.68px] left-0 right-[-2.25%] top-[-3.68px]">
            <img 
              alt="Arrow" 
              className="block max-w-none size-full" 
              src={theme === 'dark' ? "/images/arrow-white.svg" : "/images/arrow.svg"}
            />
          </div>
        </div>
      )}
    </button>
  )
}
