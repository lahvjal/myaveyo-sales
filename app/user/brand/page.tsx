import AdminLayout from '@/components/admin/AdminLayout'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AdminBrandPage() {
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
      activeTab="title"
    >
      <div className="relative bg-[#ffffff] min-h-screen text-white">
        {/* Hero section with light gradient and centered wordmark */}
        {/* Vertical letters */}
        <div className="fixed top-0 left-[180px] z-[1000] flex flex-col px-[50px] h-[100vh] justify-center gap-[50px] items-center text-black tracking-[0.2em] text-[10px] md:text-[12px] leading-[1] pt-1 md:pt-2 select-none">
          {['A','V','E','Y','O','2','4'].map((c) => (
            <span key={c} className="py-2 md:py-3">{c}</span>
          ))}
        </div>
        <section className="relative w-full h-screen bg-gradient-to-b from-[#eaf3fb] via-[#eef5fb] to-[#e9f2fa] text-black flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/horizontal-logo.svg"
              alt="Aveyo Wordmark"
              width={520}
              height={520}
              className="opacity-90"
              priority
            />
            <h4 className="text-2xl font-semibold leading-snug text-center">
              THE BRAND BOOK
            </h4>
            <div className="pt-[80px]">
              <p className="font-regular text-black text-center text-[15px] md:text-[21px] leading-[200%] max-w-[760px]">
                The purpose of this guide is to establish a theoretical,
                visual, and ethos–centered foundation that provides
                creative and functional cohesion in the present and guide
                rails to direct us as we evolve and grow in the future.
                Whenever making design, creative, or decisions, refer
                back to this brand guide.
              </p>
            </div>

          </div>
          {/* Down arrow */}
          {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-black/60 text-xl">↓</div> */}
        </section>
      </div>
    </AdminLayout>
  )
}
