"use client"
import React, { useState, useEffect } from 'react'

interface NavbarProps {
  className?: string
}

const imgAMan = "http://localhost:3845/assets/c75767911e539a98cf3080c76af0df77e6a62117.png"
const imgUnion1 = "http://localhost:3845/assets/7dce532d62b76cfb27ce43354d83030e92ea9b74.svg"

const navItems = [
  { name: 'About', href: '/#sales-section' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Stats', href: '/stats' },
  // { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Incentives', href: '/incentives' }, 
  // { name: 'EDU', href: '/edu' },
  { name: 'Store', href: 'https://aveyo.shop/' },
  // { name: 'Brand', href: '/brand' },
  // { name: 'Wiki', href: 'https://aveyo-wiki.bullet.site/' },
  // { name: 'Map', href: '/map' },
]

export default function Navbar({ className = '' }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-[100] px-4 sm:px-6 md:px-12 py-4 md:py-5 transition-colors ${
        (scrolled || open)
          ? 'bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-white/10'
          : 'bg-transparent'
      } ${className}`}
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="flex items-center md:justify-center justify-between md:gap-[20px]">
          {/* Left: Logo */}
          <a href="/" className="relative w-[72px] h-[48px] md:w-[86px] md:h-[58px]">
            <img alt="Aveyo Logo" className="block max-w-none size-full" src="/aveyoSalesLogo.svg" />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white text-xs font-bold uppercase tracking-wide hover:opacity-80 transition-opacity font-telegraf"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown (overlay) */}
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[90] bg-black/50 pointer-events-auto"
              onClick={() => setOpen(false)}
            />
            {/* Menu panel anchored to navbar */}
            <div className="md:hidden absolute left-0 right-0 top-full z-[110] mt-2 px-4 pointer-events-auto">
              <div className="rounded-md border border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60 shadow-lg">
                <div className="flex flex-col py-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-white text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors font-telegraf"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
