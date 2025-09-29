import AdminLayout from '@/components/admin/AdminLayout'

export const dynamic = 'force-dynamic'

export default function BrandPersonasPage() {
  const tabs = [
    { id: 'title', name: 'Title', href: '/user/brand' },
    { id: 'theory', name: 'Theory', href: '/user/brand/theory' },
    { id: 'messaging', name: 'Messaging', href: '/user/brand/messaging' },
    { id: 'visual', name: 'Visual Elements', href: '/user/brand/visual' },
    { id: 'personas', name: 'Personas', href: '/user/brand/personas' },
  ]

  return (
    <AdminLayout
      pageKey="brand"
      topBarTitle="Brand"
      topBarIcon="/images/Brand-icon.png"
      topBarTabs={tabs}
      activeTab="personas"
    >
      <div className="bg-[#0d0d0d] min-h-screen text-white">
        <div className="px-[50px] py-[40px] max-w-[1480px] mx-auto">
          <h1 className="text-3xl font-telegraf font-bold mb-6">Brand – Personas</h1>
          <p className="text-white/70">Personas content coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  )
}
