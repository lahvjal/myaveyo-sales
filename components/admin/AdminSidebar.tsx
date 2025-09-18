'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Navigation items configuration
const navigationItems = [
  {
    id: 'dashboard',
    href: '/dashboard',
    icon: '/images/be4cc85f4c02771c35b4a1e613279641f6cf76e8.svg',
    label: 'Dashboard',
    exact: true
  },
  {
    id: 'projects',
    href: '/admin/projects',
    icon: '/images/77b13f998ff3e614f19f3bb07e5b0b99bad0ba35.svg',
    label: 'Projects'
  },
  {
    id: 'leaderboard',
    href: '/leaderboard',
    icon: '/images/8b7ed2b8291f726071fb9facb57c2556276a3a94.svg',
    label: 'Leaderboard'
  },
  {
    id: 'incentives',
    href: '/incentives',
    icon: '/images/4f89ded0cd16e9d2b6130fadc999541ec18ed2ef.svg',
    label: 'Incentives'
  },
  {
    id: 'edu',
    href: '/edu',
    icon: '/images/87d1ada7e5fc0f5debe58d8e4fe964a4e4ae1e50.svg',
    label: 'EDU'
  },
  {
    id: 'wiki',
    href: 'https://aveyo-wiki.bullet.site/',
    icon: '/images/49db87f2f5c2400c90acb397eb78f33fcc2d64fa.svg',
    label: 'Wiki'
  },
  {
    id: 'store',
    href: 'https://aveyo.shop',
    icon: '/images/b134686914c825b3c0da0ef4f76c59d1abe5fc18.svg',
    label: 'Store'
  },
  {
    id: 'map',
    href: '/map',
    icon: '/images/f2a59ed38ae42bd3eaa986f122c6f382ef8c1b3a.svg',
    label: 'Map'
  },
  {
    id: 'review',
    href: '/reviews',
    icon: '/images/7833ede87bbf80d55863d3acff182c6cacbf3989.svg',
    label: 'Reviews'
  },
  {
    id: 'brand',
    href: '/brand',
    icon: '/images/97a0b56d232a3c85ff79015fc492812ca98183a6.svg',
    label: 'Brand'
  },
  {
    id: 'cms',
    href: '/admin/cms/home',
    icon: '/images/76264e0f7206ef8ea3717dcb72893e2e59a3bf63.svg',
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
      className={`bg-[#0d0d0d] box-border content-stretch flex flex-col gap-[20px] items-center justify-start px-0 py-[18px] relative w-[98px] h-[100vh] border-r border-[#121212] ${className}`}
      data-name="AdminSidebar"
    >
      {/* Logo */}
      <div className="relative shrink-0 size-[62px]">
        <Link href="/admin" className="block size-full">
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
                width={50}
                height={50}
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
