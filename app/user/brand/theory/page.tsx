import AdminLayout from '@/components/admin/AdminLayout'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function BrandTheoryPage() {
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
      activeTab="theory"
    >
      <div className="bg-[#0d0d0d] text-white scroll-smooth">
      <div className="fixed top-0 left-[7vw] z-[1000] flex flex-col px-[50px] h-[100vh] justify-center gap-[50px] items-center text-black tracking-[0.2em] text-[10px] md:text-[12px] leading-[1] pt-1 md:pt-2 select-none">
          {['T','H','E','O','R','Y'].map((c) => (
            <span key={c} className="py-2 md:py-3">{c}</span>
          ))}
        </div>
        {/* Section 1: Hero title */}
        <section className="relative w-full bg-gradient-to-b from-[#eaf3fb] via-[#eef5fb] to-[#e9f2fa] text-black flex flex-col items-center">
          <div style={{ height: `calc(100vh - 80px)` }} className="text-left flex flex-col justify-center gap-[20px]">
            <div className="mt-8 flex">
              <Image src="/images/theory-icon.svg" alt="Aveyo" width={72} height={72} />
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">THEORY</h1>
            
            <div className="max-w-[1100px] mx-auto w-full flex justify-center gap-10">
              <div className="">
                <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%] mt-[20px]">
                  We are building a brand that goes far beyond the surface. Our theory binds
                  our actions, our look, and our words into a cohesive whole. It defines
                  how we show up — for our customers, our team, and our communities.
                </p>
                <ul className="mt-6 space-y-2 font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%] list-disc list-outside pl-6 md:pl-8">
                  <li>Clear and simple principles that guide decision-making</li>
                  <li>Ethos-driven standards that foster trust and excellence</li>
                  <li>Design guardrails that keep us unified as we evolve</li>
                </ul>
              </div>
            </div>
            <a href="#values" className="text-black/60 text-xl pt-[50px] hover:opacity-80 transition-opacity" aria-label="Scroll to values">
              <Image src="/images/arrow-down.svg" alt="Scroll down" width={16} height={16} />
            </a>
          </div>
        </section>

        {/* Section 2: Values (new grid design) */}
        <section id="values" className="relative w-full bg-gradient-to-b from-[#eaf3fb] via-[#eef5fb] to-[#e9f2fa] text-black flex items-center py-[180px]">
          <div className="max-w-[1200px] mx-auto w-full px-6 md:px-10 lg:px-[60px] flex flex-col gap-[50px]">
            {/* Heading */}
            <div className="text-left flex flex-col gap-3">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">VALUES</h2>
              <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%] max-w-[760px]">
                Our core principles that guide every aspect of our business,
                from decision–making to daily operations.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  title: 'INTEGRITY',
                  desc: 'We always do the right thing. No matter the cost.\nNo matter what it takes.',
                  image: '/images/team.jpg',
                  icon: '/images/integrity-icon.svg'
                },
                {
                  title: 'CHANGE MAKER\nMENTALITY',
                  desc: "This mindset is founded on accountability and thrives on creativity. We don't just check the box, but think outside of it, expanding what was previously possible.",
                  image: '/images/consumer%20photos-29.jpeg',
                  icon: '/images/changeMaker-icon.svg'
                },
                {
                  title: 'PERSONAL GROWTH',
                  desc: 'We consistently strive and work to forge a better, more complete version of ourselves.',
                  image: '/images/donny-hammond.jpeg',
                  icon: '/images/growth-icon.svg'
                },
                {
                  title: 'SUCCEED TOGETHER',
                  desc: 'We take care of each other through our loyalty, compassion, and honesty.',
                  image: '/images/forest-aveyo.png',
                  icon: '/images/succeedTogether-icon.svg'
                }
              ].map((card, i) => (
                <div key={i} className="relative rounded-[10px] overflow-hidden group shadow-lg">
                  <div className="absolute inset-0">
                    <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/55 transition-colors" />
                  </div>
                  <div className="relative z-10 h-[260px] md:h-[300px] flex items-center justify-center">
                    <div className="text-center text-white max-w-[520px] px-6 flex flex-col items-center gap-4">
                      {/* Icon */}
                      <div className="flex justify-center">
                        <Image src={card.icon} alt={card.title} width={40} height={40} />
                      </div>
                      {/* Title */}
                      <h3 className="whitespace-pre-line text-xl md:text-2xl font-extrabold tracking-wide">{card.title}</h3>
                      {/* Description */}
                      <p className="whitespace-pre-line text-xs md:text-sm text-white/85 leading-relaxed max-w-[440px]">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-[1200px] text-left px-6 flex flex-col gap-[20px]">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">VISION</h2>
              <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%]">
              To be the most trusted, people-centered solar brand by empowering
              change makers to deliver remarkable experiences and enduring value.
              </p>
            </div>
            <div className="max-w-[1200px] text-left px-6 flex flex-col gap-[20px]">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">MISSION</h2>
              <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%]">
              Empower households and communities with honest guidance, quality
              craftsmanship, and a relentless commitment to integrity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
