import React from 'react'

interface NavbarProps {
  className?: string
}

const imgAMan = "http://localhost:3845/assets/c75767911e539a98cf3080c76af0df77e6a62117.png"
const imgUnion1 = "http://localhost:3845/assets/7dce532d62b76cfb27ce43354d83030e92ea9b74.svg"

const navItems = [
  'About',
  'Incentives', 
  'Leaderboard',
  'EDU',
  'Store',
  'Brand',
  'Map'
]

export default function Navbar({ className = '' }: NavbarProps) {
  return (
    <nav className={`flex items-center justify-center gap-10 px-12 py-5 relative z-10 ${className}`}>
      <div className="flex items-center gap-10">
        {/* Logo */}
        <div className="w-[86px] h-[58px] relative">
          <img alt="Aveyo Logo" className="block max-w-none size-full" src="/aveyoSalesLogo.svg" />
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item}
              href="#" 
              className="text-white text-xs font-bold uppercase tracking-wide hover:opacity-80 transition-opacity font-telegraf"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      
      {/* Right side icons */}
      <div className="flex items-center gap-8">
        <div className="w-9 h-full flex items-center justify-center">
          <img alt="Search" className="w-[15px] h-[19px]" src={imgUnion1} />
        </div>
        <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
          <img alt="Profile" className="w-full h-full object-cover" src={imgAMan} />
        </div>
      </div>
    </nav>
  )
}
