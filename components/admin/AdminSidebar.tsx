'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Navigation items configuration
const navigationItems = [
  {
    id: 'dashboard',
    href: '/admin/dashboard',
    icon: '/images/dashboard-icon.png',
    label: 'Dashboard',
    exact: true
  },
  {
    id: 'projects',
    href: '/admin/projects',
    icon: '/images/projects-icon.png',
    label: 'Projects'
  },
  {
    id: 'leaderboard',
    href: '/admin/leaderboard',
    icon: '/images/leaderboard-icon.png',
    label: 'Leaderboard'
  },
  {
    id: 'incentives',
    href: '/admin/incentives',
    icon: '/images/incentives-icon.png',
    label: 'Incentives'
  },
  {
    id: 'edu',
    href: '/admin/edu',
    icon: '/images/edu-icon.png',
    label: 'EDU'
  },
  {
    id: 'wiki',
    href: 'https://aveyo-wiki.bullet.site/',
    icon: '/images/wiki-icon.png',
    label: 'Wiki'
  },
  {
    id: 'store',
    href: 'https://aveyo.shop',
    icon: '/images/store-icon.png',
    label: 'Store'
  },
  {
    id: 'map',
    href: '/map',
    icon: '/images/map-icon.png',
    label: 'Map'
  },
  {
    id: 'review',
    href: '/reviews',
    icon: '/images/reviews-icon.png',
    label: 'Reviews'
  },
  {
    id: 'brand',
    href: '/brand',
    icon: '/images/brand-icon.png',
    label: 'Brand'
  },
  {
    id: 'cms',
    href: '/admin/cms/home',
    icon: '/images/cms-icon.png',
    label: 'CMS'
  }
]

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  return (
    <div 
      className={`bg-[#0d0d0d] box-border content-stretch flex flex-col gap-[20px] items-center justify-start px-0 py-[18px] relative w-[98px] h-[100vh] border-r border-[#121212] sticky top-0 ${className}`}
      data-name="AdminSidebar"
    >
      {/* Logo */}
      <div className="relative shrink-0 size-[62px]">
        <Link href="/" className="block size-full">
          <Image 
            src="/images/ad74dd0d12ffb7ab020f4e777da35f195b9778af.svg"
            alt="Aveyo Logo"
            width={62}
            height={62}
            className="size-full"
          />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-[20px] items-center">
        {navigationItems.map((item) => {
          const active = isActive(item)
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                relative shrink-0 size-[45px] rounded-[8px] flex items-center justify-center
                transition-all duration-200 ease-in-out group
                ${active 
                  ? 'bg-white/10 shadow-lg' 
                  : 'hover:bg-white/5 hover:scale-105'
                }
              `}
              title={item.label}
            >
              <Image 
                src={item.icon}
                alt={item.label}
                width={25}
                height={25}
                className={`
                  transition-all duration-200
                  ${active 
                    ? 'opacity-100 scale-110' 
                    : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                  }
                `}
              />
              
              {/* Active indicator */}
              {active && (
                <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-[20px] bg-white rounded-l-full" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
