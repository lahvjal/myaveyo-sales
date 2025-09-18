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
  // Main CMS Dashboard
  'cms': {
    title: 'CMS',
    icon: '/images/16d82f801100a4d0fca41534110993bbb8ff7a62.svg',
    tabs: [
      { id: 'home', name: 'Home Page', href: '/admin/cms/home' },
      { id: 'incentives', name: 'Incentives Page', href: '/admin/cms/incentives' },
      { id: 'reviews', name: 'Reviews Page', href: '/admin/cms/reviews' }
    ]
  },
  
  // Incentives Management
  'incentives': {
    title: 'Incentives',
    icon: '/images/0ac03851509f4a98cfd3f26ab7414ff754908f3a.svg',
    tabs: [
      { id: 'manage', name: 'Manage Incentives' },
      { id: 'categories', name: 'Categories' },
      { id: 'settings', name: 'Settings' }
    ]
  },
  
  // Home Stats Management
  'home-stats': {
    title: 'Home Stats',
    icon: '/images/04a56eebcbe4fd4ca78625cbafa767030a0e1360.svg',
    tabs: [
      { id: 'stats', name: 'Statistics' },
      { id: 'preview', name: 'Preview' }
    ]
  },
  
  // Reviews Management
  'reviews': {
    title: 'Reviews',
    icon: '/images/c75767911e539a98cf3080c76af0df77e6a62117.png',
    tabs: [
      { id: 'manage', name: 'Manage Reviews' },
      { id: 'customer', name: 'Customer Reviews' },
      { id: 'rep', name: 'Rep Reviews' }
    ]
  },
  
  // Sales Analytics
  'sales': {
    title: 'Sales',
    icon: '/images/16d82f801100a4d0fca41534110993bbb8ff7a62.svg',
    tabs: [
      { id: 'analytics', name: 'Analytics' },
      { id: 'reports', name: 'Reports' },
      { id: 'leaderboard', name: 'Leaderboard' }
    ]
  },
  
  // General Stats
  'stats': {
    title: 'Analytics',
    icon: '/images/04a56eebcbe4fd4ca78625cbafa767030a0e1360.svg',
    tabs: [
      { id: 'overview', name: 'Overview' },
      { id: 'performance', name: 'Performance' },
      { id: 'trends', name: 'Trends' }
    ]
  }
}

export function getAdminPageConfig(pageKey: string): AdminPageConfig {
  return ADMIN_PAGE_CONFIGS[pageKey] || ADMIN_PAGE_CONFIGS['cms']
}

export function getPageKeyFromPath(pathname: string): string {
  // Extract page key from pathname like /admin/incentives -> incentives
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length >= 2 && segments[0] === 'admin') {
    return segments[1] || 'cms'
  }
  return 'cms'
}
