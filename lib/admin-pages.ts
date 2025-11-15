export interface AdminPageConfig {
  title: string
  icon: string
  tabs?: AdminPageTab[]
}

export interface AdminPageTab {
  id: string
  name: string
  href?: string
}

export const ADMIN_PAGE_CONFIGS: Record<string, AdminPageConfig> = {
  // Admin Dashboard
  'dashboard': {
    title: 'Dashboard',
    icon: '/images/dashboard-icon.png',
    tabs: []
  },
  // Brand Guide
  'brand': {
    title: 'Brand',
    icon: '/images/brand-icon.png',
    tabs: []
  },
  // Admin Leaderboard
  'leaderboard': {
    title: 'Leaderboard',
    icon: '/images/leaderboard-icon.png',
    tabs: []
  },
  // Main CMS Dashboard
  'cms': {
    title: 'CMS',
    icon: '/images/CMS-icon.png',
    tabs: [
      { id: 'home', name: 'Home Page', href: '/admin/cms/home' },
      { id: 'incentives', name: 'Incentives Page', href: '/admin/cms/incentives' },
      { id: 'reviews', name: 'Reviews Page', href: '/admin/cms/reviews' }
    ]
  },
  // Main CMS Dashboard
  'admin': {
    title: 'Admin',
    icon: '/images/admin-icon.png',
    tabs: [
      { id: 'cms', name: 'CMS', href: '/admin/cms' },
      { id: 'applications', name: 'Applications', href: '/admin/applications' }
    ]
  },
  // Incentives Management
  'incentives': {
    title: 'Incentives',
    icon: '/images/incentives-icon.png',
    tabs: []
  },
  
  // Home Stats Management
  'home-stats': {
    title: 'Home Stats',
    icon: '/images/CMS-icon.png',
    tabs: [
      { id: 'stats', name: 'Statistics' },
      { id: 'preview', name: 'Preview' }
    ]
  },
  
  // Reviews Management
  'reviews': {
    title: 'Reviews',
    icon: '/images/reviews-icon.png',
    tabs: [
      { id: 'manage', name: 'Manage Reviews' },
      { id: 'customer', name: 'Customer Reviews' },
      { id: 'rep', name: 'Rep Reviews' }
    ]
  },
  
  // Sales Analytics
  'sales': {
    title: 'Sales',
    icon: '/images/CMS-icon.png',
    tabs: [
      { id: 'analytics', name: 'Analytics' },
      { id: 'reports', name: 'Reports' },
      { id: 'leaderboard', name: 'Leaderboard' }
    ]
  },
  
  // General Stats
  'stats': {
    title: 'Analytics',
    icon: '/images/CMS-icon.png',
    tabs: [
      { id: 'overview', name: 'Overview' },
      { id: 'performance', name: 'Performance' },
      { id: 'trends', name: 'Trends' }
    ]
  },

  // Projects
  'projects': {
    title: 'Projects',
    icon: '/images/projects-icon.png',
    tabs: []
  },

  // EDU Platform
  'edu': {
    title: 'EDU',
    icon: '/images/EDU-icon.png',
    tabs: [
      { id: 'courses', name: 'Courses', href: '/admin/edu' }
    ]
  }
}

export function getAdminPageConfig(pageKey: string): AdminPageConfig {
  return ADMIN_PAGE_CONFIGS[pageKey] || ADMIN_PAGE_CONFIGS['cms']
}

export function getPageKeyFromPath(pathname: string): string {
  // Extract page key from pathname like /user/incentives -> incentives
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length >= 2 && (segments[0] === 'user' || segments[0] === 'admin')) {
    return segments[1] || 'cms'
  }
  return 'cms'
}
