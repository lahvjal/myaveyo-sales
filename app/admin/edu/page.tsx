import AdminLayout from '@/components/admin/AdminLayout'

export const dynamic = 'force-dynamic'

export default function AdminEduPage() {
  return (
    <AdminLayout
      pageKey="edu"
      topBarTitle="EDU"
      topBarIcon="/images/edu-icon.png"
      topBarTabs={[
        // You can expand these tabs later as the EDU admin grows
        { id: 'manage', name: 'Manage', href: '/admin/edu' },
        { id: 'courses', name: 'Courses', href: '/admin/edu/courses' },
        { id: 'settings', name: 'Settings', href: '/admin/edu/settings' }
      ]}
      activeTab="manage"
    >
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-telegraf font-bold mb-2">EDU</h1>
          <p className="text-white/70 text-lg">Coming soon</p>
        </div>
      </div>
    </AdminLayout>
  )
}
