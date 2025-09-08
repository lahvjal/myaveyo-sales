'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function BrandPage() {
  const [pageReady, setPageReady] = useState(false)

  useEffect(() => {
    setPageReady(true)
  }, [])

  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200, disabled: !pageReady })
  const descriptionAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400, disabled: !pageReady })
  const valuesAnimation = useScrollAnimation<HTMLDivElement>({ delay: 600, disabled: !pageReady })
  const guidelinesAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: !pageReady })
  const logoAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1000, disabled: !pageReady })
  const colorAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1200, disabled: !pageReady })
  const typographyAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1400, disabled: !pageReady })
  const templatesAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1600, disabled: !pageReady })
  const quickLinksAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1800, disabled: !pageReady })

  const coreValues = [
    {
      title: "Integrity",
      description: "We uphold honesty, transparency, and doing what's right—even when no one is watching.",
      download: "Integrity poster / template",
      color: "from-blue-600 to-blue-800"
    },
    {
      title: "Change Maker Mentality",
      description: "We embrace innovation, challenge the status quo, and drive positive change in everything we do.",
      download: "Change Maker poster / template",
      color: "from-green-600 to-green-800"
    },
    {
      title: "Personal Growth",
      description: "We believe in continuous learning, improvement, and becoming the best version of ourselves.",
      download: "Personal Growth poster / template",
      color: "from-purple-600 to-purple-800"
    },
    {
      title: "Accountability",
      description: "We take ownership of our actions and results, ensuring responsibility at every step.",
      download: "Accountability poster / template",
      color: "from-red-600 to-red-800"
    },
    {
      title: "Succeed Together",
      description: "Collaboration and teamwork are at the heart of our mission—we win as a team.",
      download: "Succeed Together poster / template",
      color: "from-yellow-600 to-yellow-800"
    }
  ]

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      {/* Navigation */}
      <Navbar />

      <div className="px-[50px] py-[130px]">
        <div className="max-w-[1480px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-10 mb-20">
            <div 
              ref={headerAnimation.ref}
              className={`flex items-start gap-2.5 text-white transition-all duration-700 ${
                headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <span className="text-[16px] font-telegraf">(B)</span>
              <div>
                <h1 className="text-[60px] font-telegraf font-extrabold uppercase leading-[63px] mb-2">
                  Brand Hub.
                </h1>
                <p className="text-[rgba(255,255,255,0.6)] text-[16px] font-telegraf italic">
                  Internal Branding Reference Page
                </p>
              </div>
            </div>
            <div 
              ref={descriptionAnimation.ref}
              className={`text-white text-[16px] font-telegraf max-w-[400px] transition-all duration-700 ${
                descriptionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <p>
                Welcome to the central hub for all things Aveyo branding. Use this page to access our brand values, 
                guidelines, and downloadable assets to keep our identity consistent and strong.
              </p>
            </div>
          </div>

          <div className="space-y-32">
            {/* Core Values Section */}
            <section 
              ref={valuesAnimation.ref}
              className={`transition-all duration-700 ${
                valuesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-start gap-2.5 text-white mb-12">
                <span className="text-[16px] font-telegraf">(1)</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px] flex items-center">
                  <span className="mr-4">🌟</span>
                  Our Core Values.
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {coreValues.map((value, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] p-6 h-[280px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-10`}></div>
                    <div className="relative z-10">
                      <h3 className="text-white text-[20px] font-telegraf font-bold mb-4">
                        {value.title}
                      </h3>
                      <p className="text-[rgba(255,255,255,0.8)] text-[14px] font-telegraf leading-relaxed mb-4">
                        {value.description}
                      </p>
                    </div>
                    <p className="text-[rgba(255,255,255,0.5)] text-[12px] font-telegraf italic relative z-10">
                      Download available: {value.download}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Brand Guidelines Section */}
            <section 
              ref={guidelinesAnimation.ref}
              className={`transition-all duration-700 ${
                guidelinesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-start gap-2.5 text-white mb-8">
                <span className="text-[16px] font-telegraf">(2)</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px] flex items-center">
                  <span className="mr-4">🎨</span>
                  Brand Guidelines.
                </h2>
              </div>
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] p-8">
                <p className="text-white text-[16px] font-telegraf mb-4">
                  The official Aveyo brand guidelines cover logo usage, color palette, typography, and overall visual direction.
                </p>
                <p className="text-[rgba(255,255,255,0.5)] text-[14px] font-telegraf italic">
                  Download available: Full brand guidelines PDF
                </p>
              </div>
            </section>

            {/* Logo Usage Section */}
            <section 
              ref={logoAnimation.ref}
              className={`transition-all duration-700 ${
                logoAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-start gap-2.5 text-white mb-8">
                <span className="text-[16px] font-telegraf">(3)</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px] flex items-center">
                  <span className="mr-4">🔖</span>
                  Logo Usage.
                </h2>
              </div>
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] p-8">
                <ul className="text-white text-[16px] font-telegraf space-y-3 mb-6">
                  <li>• Always use the official Aveyo logos provided.</li>
                  <li>• Maintain clear space around the logo.</li>
                  <li>• Never stretch, rotate, or recolor outside approved variations.</li>
                </ul>
                <p className="text-[rgba(255,255,255,0.5)] text-[14px] font-telegraf italic">
                  Download available: Logo pack (light, dark, transparent, vector)
                </p>
              </div>
            </section>

            {/* Color Palette Section */}
            <section 
              ref={colorAnimation.ref}
              className={`transition-all duration-700 ${
                colorAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-start gap-2.5 text-white mb-8">
                <span className="text-[16px] font-telegraf">(4)</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px] flex items-center">
                  <span className="mr-4">🎨</span>
                  Color Palette.
                </h2>
              </div>
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] p-8">
                <p className="text-white text-[16px] font-telegraf mb-6">
                  Our color palette ensures brand consistency across all channels.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-white text-[18px] font-telegraf font-bold mb-3">Primary Colors</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-[14px] font-telegraf">
                      (Insert HEX/RGB/CMYK values from brand guidelines)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white text-[18px] font-telegraf font-bold mb-3">Secondary Colors</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-[14px] font-telegraf">
                      (Insert HEX/RGB/CMYK values)
                    </p>
                  </div>
                </div>
                <p className="text-[rgba(255,255,255,0.5)] text-[14px] font-telegraf italic">
                  Download available: Color palette file (HEX, RGB, CMYK, ASE/ACO)
                </p>
              </div>
            </section>

            {/* Typography Section */}
            <section 
              ref={typographyAnimation.ref}
              className={`transition-all duration-700 ${
                typographyAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-start gap-2.5 text-white mb-8">
                <span className="text-[16px] font-telegraf">(5)</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px] flex items-center">
                  <span className="mr-4">✍️</span>
                  Typography.
                </h2>
              </div>
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] p-8">
                <p className="text-white text-[16px] font-telegraf mb-6">
                  Typography reinforces our brand voice and should be consistent across all materials.
                </p>
                <div className="space-y-3 mb-6">
                  <p className="text-white text-[16px] font-telegraf">
                    <span className="font-bold">Primary Font:</span> PP Telegraf (Current brand font)
                  </p>
                  <p className="text-white text-[16px] font-telegraf">
                    <span className="font-bold">Secondary Font:</span> Inter (Supporting text)
                  </p>
                  <p className="text-white text-[16px] font-telegraf">
                    <span className="font-bold">Usage Notes:</span> Headings, body text, digital vs print
                  </p>
                </div>
                <p className="text-[rgba(255,255,255,0.5)] text-[14px] font-telegraf italic">
                  Download available: Font files + usage guide
                </p>
              </div>
            </section>

            {/* Templates Section */}
            <section 
              ref={templatesAnimation.ref}
              className={`transition-all duration-700 ${
                templatesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-start gap-2.5 text-white mb-8">
                <span className="text-[16px] font-telegraf">(6)</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px] flex items-center">
                  <span className="mr-4">📄</span>
                  Templates.
                </h2>
              </div>
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <h4 className="text-white text-[18px] font-telegraf font-bold mb-2">Presentation Decks</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-[14px] font-telegraf">
                      Sales presentations and pitch decks
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-white text-[18px] font-telegraf font-bold mb-2">Social Media Templates</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-[14px] font-telegraf">
                      Instagram, LinkedIn, and other platforms
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-white text-[18px] font-telegraf font-bold mb-2">Internal Docs</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-[14px] font-telegraf">
                      Reports, memos, and documentation
                    </p>
                  </div>
                </div>
                <p className="text-[rgba(255,255,255,0.5)] text-[14px] font-telegraf italic">
                  Download available: Template folder
                </p>
              </div>
            </section>

            {/* Quick Links Section */}
            <section 
              ref={quickLinksAnimation.ref}
              className={`transition-all duration-700 ${
                quickLinksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-start gap-2.5 text-white mb-8">
                <span className="text-[16px] font-telegraf">(7)</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-[42px] flex items-center">
                  <span className="mr-4">📂</span>
                  Quick Links.
                </h2>
              </div>
              <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <a href="#" className="text-white text-[16px] font-telegraf hover:text-[rgba(255,255,255,0.7)] transition-colors">
                    → Brand Guidelines PDF
                  </a>
                  <a href="#" className="text-white text-[16px] font-telegraf hover:text-[rgba(255,255,255,0.7)] transition-colors">
                    → Logo Pack
                  </a>
                  <a href="#" className="text-white text-[16px] font-telegraf hover:text-[rgba(255,255,255,0.7)] transition-colors">
                    → Color Palette
                  </a>
                  <a href="#" className="text-white text-[16px] font-telegraf hover:text-[rgba(255,255,255,0.7)] transition-colors">
                    → Fonts & Typography Guide
                  </a>
                  <a href="#" className="text-white text-[16px] font-telegraf hover:text-[rgba(255,255,255,0.7)] transition-colors">
                    → Posters & Templates
                  </a>
                  <a href="#" className="text-white text-[16px] font-telegraf hover:text-[rgba(255,255,255,0.7)] transition-colors">
                    → Social Media Assets
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
