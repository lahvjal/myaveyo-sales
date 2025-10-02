import React from 'react'

interface ButtonProps {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  theme?: 'light' | 'dark'
  iconOnly?: boolean
  ariaLabel?: string
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
  theme = 'light',
  iconOnly = false,
  ariaLabel
}: ButtonProps) {
  const baseStyles = iconOnly
    ? "inline-flex items-center justify-center rounded-[3px] p-2 size-[45px]"
    : "box-border content-stretch flex gap-2.5 items-center justify-center min-h-[45px] py-[10px] px-[20px] relative rounded-[3px] font-extrabold text-[14px] transition-colors cursor-pointer"
  
  const getVariantStyles = () => {
    if (theme === 'dark') {
      return {
        primary: "bg-[#1d1d1d] text-[#ffffff] hover:bg-[#1a1a1a]",
        secondary: "bg-[#222222] text-[#0d0d0d] hover:bg-[#444444] hover:text-[#ffffff]"
      }
    }
    
    return {
      primary: "bg-[#ffffff] text-[#121212] hover:bg-[#aaaaaa] hover:text-[#ffffff]",
      secondary: "bg-[#222222] text-[#ffffff] hover:bg-[#444444] hover:text-[#ffffff]"
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
      aria-label={ariaLabel}
    >
      {!iconOnly && (
        <span className="font-inter font-extrabold leading-[0] not-italic text-nowrap">
          {children}
        </span>
      )}
      {(variant === 'primary' || iconOnly || icon) && (
        <div className="flex justify-center items-center w-5 h-5">
          <div className={iconOnly ? "" : "w-4 h-4"}>
            <img 
              alt="Arrow" 
              className={iconOnly ? "block size-full" : "block max-w-none size-full"}
              src={icon || (theme === 'dark' ? "/images/arrow-white.svg" : "/images/arrow.svg")}
            />
          </div>
        </div>
      )}
    </button>
  )
}
