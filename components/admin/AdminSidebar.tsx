'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Navigation items configuration
const navigationItems = [
  {
    id: 'dashboard',
    href: '/user/dashboard',
    icon: '/images/dashboard-icon.png',
    label: 'Dashboard',
    exact: true
  },
  {
    id: 'projects',
    href: '/user/projects',
    icon: '/images/projects-icon.png',
    label: 'Projects'
  },
  {
    id: 'leaderboard',
    href: '/user/leaderboard',
    icon: '/images/leaderboard-icon.png',
    label: 'Leaderboard'
  },
  {
    id: 'incentives',
    href: '/user/incentives',
    icon: '/images/incentives-icon.png',
    label: 'Incentives'
  },
  {
    id: 'edu',
    href: '/user/edu',
    icon: '/images/EDU-icon.png',
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
    href: '/user/map',
    icon: '/images/map-icon.png',
    label: 'Map'
  },
  {
    id: 'review',
    href: '/user/reviews',
    icon: '/images/reviews-icon.png',
    label: 'Reviews'
  },
  {
    id: 'brand',
    href: '/user/brand',
    icon: '/images/Brand-icon.png',
    label: 'Brand'
  },
  {
    id: 'admin',
    href: '/admin',
    icon: '/images/admin-icon.png',
    label: 'Admin'
  }
]

const profile = {
  id: 'profile',
  href: '/user/profile',
  icon: '/images/user-icon.png',
  label: 'Profile'
}

interface AdminSidebarProps {
  className?: string
  expanded?: boolean
}

export default function AdminSidebar({ className = '', expanded = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        // Prefer centralized me endpoint
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (res.ok) {
          const me = await res.json()
          const centralAdmin = Boolean(me?.isAdmin || me?.role === 'admin')
          if (mounted && centralAdmin) {
            setIsAdmin(true)
            return
          }
        }
        // Fallback: local session metadata
        // const { data } = await supabase.auth.getUser()
        // const metaAdmin = Boolean(data.user?.user_metadata?.isAdmin)
        // if (metaAdmin && mounted) {
        //   setIsAdmin(true)
        //   return
        // }
        // Last resort: public.users.role
        // const email = data.user?.email
        // if (!email) return
        // const { data: rows } = await supabase
        //   .from('users')
        //   .select('role')
        //   .ilike('email', email)
        //   .limit(1)
        // if (mounted && rows && rows[0]?.role === 'admin') setIsAdmin(true)
      } catch {}
    }
    load()
    return () => { mounted = false }
  }, [])

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  return (
    <div 
      className={`bg-[#0d0d0d] box-border content-stretch flex flex-col gap-[20px] ${expanded ? 'items-stretch w-full' : 'items-center w-[98px]'} justify-start ${expanded ? 'px-3' : 'px-0'} py-[18px] relative h-[100vh] border-r border-[#121212] sticky top-0 ${className}`}
      data-name="AdminSidebar"
    >
      {/* Logo */}
      <div className={`relative shrink-0 ${expanded ? 'h-[40px] w-auto px-1' : 'size-[62px]'}`}>
        <Link href="/" className="block size-full">
          <Image 
            src="/images/ad74dd0d12ffb7ab020f4e777da35f195b9778af.svg"
            alt="Aveyo Logo"
            width={expanded ? 70 : 62}
            height={expanded ? 70 : 62}
            className="object-contain h-full w-auto"
          />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className={`flex flex-col gap-[10px] ${expanded ? 'items-stretch' : 'items-center'}`}>
        {navigationItems.map((item) => {
          if (item.id === 'admin' && !isAdmin) return null
          const active = isActive(item)
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                relative shrink-0 rounded-[3px] flex ${expanded ? 'gap-3 items-center justify-start px-3 py-2' : 'items-center justify-center size-[45px]'}
                transition-all duration-200 ease-in-out group
                ${active 
                  ? 'bg-[radial-gradient(112.65%_95.85%_at_120.72%_50%,_#455062_0%,_#1A1B1C_100%)]' 
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
              {expanded && (
                <span className={`h-[100%] text-sm font-telegraf ${active ? 'text-white' : 'text-white/80'}`}>
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              {!expanded && active && (
                <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-[80%] bg-white rounded-l-full" />
              )}
            </Link>
          )
        })}
      </nav>

      <Link
        key="profile"
        href="/user/profile"
        className={`
          absolute bottom-[20px] shrink-0 rounded-[3px] flex ${expanded ? 'gap-3 items-center justify-start px-3 py-2' : 'items-center justify-center size-[45px]'}
          transition-all duration-200 ease-in-out group
          ${isActive(profile) 
            ? 'bg-white/10 shadow-lg' 
            : 'hover:bg-white/5 hover:scale-105'
          }
        `}
        title="Profile"
      >
        <Image 
          src="/images/user-icon.png"
          alt="Profile"
          width={25}
          height={25}
          className={`
            transition-all duration-200 bg-gradient-to-b from-[#5C5C5C] to-[#1F1F1F] rounded-full overflow-hidden
            ${isActive(profile) 
              ? 'opacity-100 scale-110' 
              : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
            }
          `}
        />
        {expanded && (
          <span className={`text-sm font-telegraf ${isActive(profile) ? 'text-white' : 'text-white/80'}`}>
            Profile
          </span>
        )}
        
        {/* Active indicator */}
        {!expanded && isActive(profile) && (
          <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-[20px] bg-white rounded-l-full" />
        )}
      </Link>
    </div>
  )
}
