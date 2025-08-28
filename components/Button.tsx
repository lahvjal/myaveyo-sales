import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const imgVector116 = "http://localhost:3845/assets/5fe2a32dc067120eb3a1b0499801e0069a379f4e.svg"

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  icon,
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseStyles = "box-border content-stretch flex gap-2.5 items-center justify-center p-[20px] relative rounded-[3px] font-extrabold text-[14px] transition-colors cursor-pointer"
  
  const variantStyles = {
    primary: "bg-[#ffffff] text-[#121212] hover:bg-gray-100",
    secondary: "border border-[#ffffff] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#121212]"
  }

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
              src={icon || imgVector116} 
            />
          </div>
        </div>
      )}
    </button>
  )
}
