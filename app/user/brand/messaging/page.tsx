import AdminLayout from '@/components/admin/AdminLayout'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function BrandMessagingPage() {
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
          activeTab="messaging"
        >
          <div className="bg-[#0d0d0d] text-white scroll-smooth">
          <div className="fixed top-0 left-[7vw] z-[1000] flex flex-col px-[50px] h-[100vh] justify-center gap-[50px] items-center text-black tracking-[0.2em] text-[10px] md:text-[12px] leading-[1] pt-1 md:pt-2 select-none">
              {['M','E','S','S','A','G','I','N','G'].map((c) => (
                <span key={c} className="py-2 md:py-3">{c}</span>
              ))}
            </div>
            {/* Section 1: Hero title */}
            <section className="relative w-full bg-gradient-to-b from-[#eaf3fb] via-[#eef5fb] to-[#e9f2fa] text-black flex flex-col items-center">
              <div style={{ height: `calc(100vh - 80px)` }} className="w-full text-left flex flex-col justify-center gap-[20px] max-w-[1200px]">
                <div className="mt-8 flex">
                  <Image src="/images/messaging-icon.svg" alt="Aveyo" width={72} height={72} />
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">MESSAGING</h1>
                
                <div className="max-w-[1200px] w-full mx-auto flex justify-start gap-10">
                  <div className="">
                    <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%] mt-[20px]">
                      How our vision is communicated to our target audience.<br/>
                      <br/>
                      Articulating our verbal je ne sais quoi<br/>
                      Voice // Tone // Personality
                    </p>
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
                {/* Messaging content (per Figma) */}
                <div className="flex flex-col gap-6 md:gap-8">
                  {/* Our Name header */}
                  <div className="text-center">
                    <div className="uppercase tracking-[0.25em] text-[10px] text-black/60 mb-4">Our Name</div>
                    <h2 className="text-[44px] md:text-[64px] font-extrabold leading-none">Aveyo</h2>
                    <div className="mt-3 text-black/80 text-sm md:text-base">a·vey·o | <span className="font-semibold">noun</span> | derived from “te veo,” meaning I see you.</div>
                  </div>

                  {/* Statement card 1 */}
                  <div className="bg-white/70 rounded-lg p-6 md:p-10 border border-black/10 text-center">
                    <p className="font-extrabold text-lg md:text-3xl text-black/90 max-w-[760px] mx-auto">
                      We see our consumers and our employees and we allow them
                      to see us.
                    </p>
                  </div>

                  {/* Statement card 2 */}
                  <div className="bg-white/70 rounded-lg p-6 md:p-10 border border-black/10 text-center">
                    <p className="text-2xl md:text-3xl text-black/90">transparency · light · clarity</p>
                    <div className="mt-4 text-[12px] md:text-[13px] text-black/70 leading-relaxed">
                      <div>A company built for a better consumer experience.</div>
                      <div>A mission to build a better world.</div>
                    </div>
                  </div>

                  {/* Split block 1: image left, text right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    <div className="relative rounded-lg overflow-hidden min-h-[260px] md:min-h-[320px]">
                      <Image src="/images/presentation.png" alt="Concept art" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    </div>
                    <div className="bg-white/70 rounded-lg p-6 md:p-8 border border-black/10">
                      <div className="space-y-4 text-sm md:text-base text-black/80">
                        <div>
                          <div className="font-semibold text-black mb-1">What do human beings want most?</div>
                          <div>To be understood.</div>
                        </div>
                        <div>
                          <div className="font-semibold text-black mb-1">And how do they feel understood?</div>
                          <div>
                            When what they fear, hope, dream, and say can be communicated back to them.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Split block 2: text left, image right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    <div className="bg-white/70 rounded-lg p-6 md:p-8 border border-black/10">
                      <ul className="text-sm md:text-base text-black/80 leading-relaxed space-y-2">
                        <li><span className="font-semibold text-black">Transparency</span> of process</li>
                        <li><span className="font-semibold text-black">Transparency</span> of power</li>
                        <li><span className="font-semibold text-black">Transparency</span> of price</li>
                        <li><span className="font-semibold text-black">Transparency</span> of purpose</li>
                        <li><span className="font-semibold text-black">Transparency</span> of pay</li>
                        <li><span className="font-semibold text-black">Transparency</span> of potential</li>
                      </ul>
                    </div>
                    <div className="relative rounded-lg overflow-hidden min-h-[260px] md:min-h-[320px]">
                      <Image src="/images/WEBSITE%20PHOTO.png" alt="Modern building" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    </div>
                  </div>
                </div>
                <div className="max-w-[1200px] text-left px-6 flex flex-col gap-[20px]">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">VOICE</h2>
                  <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%]">
                  Simplistic, straightforward, and refreshingly transparent. We begin by being clear and candid.
                  <br/>
                  <br/>
                  <b>A voice of reason. A voice of confidence. A voice of honesty. A voice of disruption.</b>
                  <br/>
                  <br/>
                  Our voice must be simplistic, straightforward, and refreshingly transparent. Occasionally, that transparency is blunt and surprising, other times it’s reassuring and tasteful. We speak with our consumers, not to our consumers. This means we speak in dialogue, not monologue. This dialogue fosters trust through humor, good nature, and intelligence.
                  </p>
                </div>
                <div className="max-w-[1200px] text-left px-6 flex flex-col gap-[20px]">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">TONE</h2>
                  <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%]">
                  This describes how we speak, write, and communicate
                  <br/>
                  <br/>
                  <b>SMART AND SUBMERSIVE_</b>
                  <br/>
                  Intelligence without a hint of condescension. On the contrary: we understand how smart our consumer base is, and we treat them as such. This intelligence also breeds a certain self-awareness: we know our limitations, what market we’re in, and how people generally feel about solar. So, we surprise people with our non-traditional approach and breakdown of expectation. 
                  <br/>
                  <br/>
                  <b>CLEVER AND CANDID_</b>
                  <br/>
                  Let’s face it: solar is boring and archaic. So, we should at least give our consumers something to smile about. We flip expectations, delight, and inspire curiosity with our word choice and one-liners. Much of this comes from an unexpected candor that we deliver straight-faced and unapologetically.                  <br/>
                  <br/>
                  <br/>
                  <b>HONEST AND CLEAR_</b>
                  <br/>
                  Remember that transparency grounds and moors everything we do. So, let’s ben clean and clear and up-front with our communication. We’re not trying to confuse or bait and switch anyone. We try to deliver informational concisely and honestly as we possibly can. That means trimming fat and eliminating cagey words from our rolodex. 
                  </p>
                  {/* Functional section */}
                  <section className="mt-8 flex flex-col gap-6 md:gap-8">
                    <h3 className="font-regular font-bold text-black text-left text-[15px] md:text-[21px] leading-[200%]">FUNCTIONAL</h3>
                    <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%]">
                      Out of necessity, we must communicate freely, clearly, and concisely. This becomes
                      increasingly important during point-of-sale, in educational opportunities, and during
                      times of consideration.
                    </p>

                    {/* Grid 1: Steps + Sales CTA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {/* Steps card */}
                      <div className="bg-white rounded-lg p-6 md:p-7 border border-black/10">
                        <div className="space-y-4 text-sm md:text-base text-black/80">
                          <div>
                            <div className="font-semibold text-black mb-1">Step One — Is Solar Right for You?</div>
                            <div>Quickly evaluate your home and goals to see if solar is a fit. No pressure, just clarity.</div>
                          </div>
                          <div>
                            <div className="font-semibold text-black mb-1">Step Two — Laying the Foundation</div>
                            <div>We customize a plan and paperwork to get you moving. Clear pricing, timelines, and expectations.</div>
                          </div>
                          <div>
                            <div className="font-semibold text-black mb-1">Step Three — Approval and Permits</div>
                            <div>Once approved, we schedule install. For city approvals, timelines can take 2–3 weeks.</div>
                          </div>
                        </div>
                      </div>

                      {/* Sales CTA card */}
                      <div className="relative rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-300/70 via-blue-400/70 to-blue-600/70" />
                        <div className="relative z-10 p-6 md:p-8 text-white min-h-[260px] flex flex-col justify-between">
                          <div className="flex items-center gap-3 text-white/90">
                            <Image src="/images/logo-icon.svg" alt="Sales" width={22} height={22} />
                            <span className="font-semibold">Sales</span>
                          </div>
                          <div className="text-sm md:text-base leading-relaxed">
                            Want to know if going solar is right for you? Speak to a Solar Educator for a quote,
                            pricing, or to answer any questions you may have.
                          </div>
                          <div>
                            <button className="inline-flex items-center gap-2 bg-black/70 hover:bg-black/80 text-white px-4 py-2 rounded-md text-sm transition-colors">
                              Talk to Sales
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid 2: Image + FOMO DOJO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {/* Image with headline overlay */}
                      <div className="relative rounded-lg overflow-hidden min-h-[260px] md:min-h-[320px]">
                        <Image src="/images/team.jpg" alt="The way solar should be" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-end p-6">
                          <div>
                            <h4 className="text-white text-2xl md:text-3xl font-extrabold">The Way Solar<br/>Should Be</h4>
                            <button className="mt-4 inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black px-4 py-2 rounded-md text-sm transition-colors">
                              Get a Free Quote
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* FOMO DOJO card */}
                      <div className="bg-white rounded-lg p-6 md:p-8 border border-black/10">
                        <h4 className="text-2xl md:text-3xl font-extrabold mb-3">FOMO DOJO</h4>
                        <p className="text-black/80 text-sm md:text-base leading-relaxed">
                          This isn’t your mom’s charity raffle. These prizes are handpicked, super slick, and
                          exactly what you’ve always wanted. The only catch: you gotta be there for a chance to win them.
                        </p>
                      </div>
                    </div>

                    {/* Dashboard banner */}
                    <div className="relative rounded-lg overflow-hidden bg-black text-white">
                      <div className="px-6 md:px-10 py-14 md:py-20 text-center">
                        <h4 className="text-3xl md:text-4xl font-extrabold tracking-wide">DASHBOARD</h4>
                        <p className="mt-2 text-white/80 text-sm md:text-base">You’ll be hungry, so we’ve got you covered. Three food trucks. Three food types. Ready to quiet your rumbling tummy.</p>
                      </div>
                    </div>

                    {/* Expressive heading */}
                    <h3 className="font-regular font-bold text-black text-left text-[15px] md:text-[21px] leading-[200%]">EXPRESSIVE</h3>
                    <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%]">
                      The expressive side of our voice brings the personality, interest, and excitement (a bridled,
                      careful excitement). It should be implemented strategically: top-of–funnel, consideration,
                      post-deal, etc.
                    </p>
                  </section>
                </div>
                <div className="max-w-[1200px] text-left px-6 flex flex-col gap-[20px]">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">PERSONALITY</h2>
                  <p className="font-regular text-black text-left text-[15px] md:text-[21px] leading-[200%]">
                  We must be relatable and approachable—going solar feels like a big commitment.
                  <br/>
                  <br/>
                  However, that  must be matched with a seriousness that shows our consumers we understand that gravity of we’re providing. Additionally, being friendly matches our need to be transparent. Being trendy helps us stand up, and being serious provides confidence.
                  <br/>
                  <br/>
                  Although we can’t make solar a luxury product, we can help our consumers feel like experience of going solar is a luxurious one. 
                  <br/>
                  <br/>
                  They’re making a sophisticated decisions. One that has value-powered repercussions
                  </p>

                  <div className="flex flex-col gap-4">
                    <img src="/images/Personality1.png" alt="Aveyo" width={72} height={72} className="w-full object-cover" />
                    <img src="/images/Personality2.png" alt="Aveyo Wordmark" width={520} height={520} className="w-full object-contain" />
                  </div>

                </div>
              </div>
            </section>
          </div>
        </AdminLayout>
  )
}
