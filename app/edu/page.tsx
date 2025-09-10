'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function EduPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsLoading(false)
    setEmail('')
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative z-10 px-4 sm:px-[50px] py-[80px] sm:py-[130px]">
        <div className="max-w-[1480px] mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            
            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0859D1] to-[#44A4F9] border border-white/10 rounded-full px-6 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 font-telegraf text-sm font-semibold">COMING SOON</span>
              </div>

              {/* Title */}
              <div className="flex items-start justify-center gap-3 mb-8">
                <span className="text-white/60 text-[16px] font-telegraf mt-4">(E)</span>
                <h1 className="text-[60px] sm:text-[80px] md:text-[120px] font-telegraf font-extrabold uppercase leading-[0.8] text-white">
                  Education<br />
                  <span className="text-transparent bg-gradient-to-r from-[#9EC5FE] via-[#0859D1] to-[#44A4F9] bg-clip-text">
                    Center.
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-[20px] sm:text-[24px] md:text-[32px] font-telegraf text-white/80 mb-6 leading-relaxed">
                Master the art of solar sales with our comprehensive training platform
              </p>

              {/* Description */}
              <p className="text-[16px] sm:text-[18px] font-telegraf text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                Get ready for interactive courses, expert-led workshops, certification programs, 
                and real-world case studies designed to elevate your solar sales expertise.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6 hover:border-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-telegraf font-bold text-white mb-2">Interactive Courses</h3>
                  <p className="text-white/60 font-telegraf text-sm">Hands-on learning modules with real-world scenarios</p>
                </div>

                <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6 hover:border-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-telegraf font-bold text-white mb-2">Certifications</h3>
                  <p className="text-white/60 font-telegraf text-sm">Earn recognized credentials to boost your career</p>
                </div>

                <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] border border-white/10 rounded-[3px] p-6 hover:border-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-telegraf font-bold text-white mb-2">Expert Workshops</h3>
                  <p className="text-white/60 font-telegraf text-sm">Learn from top performers and industry leaders</p>
                </div>
              </div>

              {/* Notification Signup */}
              <div className="max-w-md mx-auto">
                {!isSubmitted ? (
                  <form onSubmit={handleNotifySubmit} className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for updates"
                      className="flex-1 px-6 py-4 bg-gradient-to-b from-[#232323] to-[#171717] border border-white/20 rounded-[3px] text-white placeholder-white/60 font-telegraf focus:outline-none focus:border-white/40 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 bg-white text-black hover:bg-white/90 disabled:bg-white/50 rounded-[3px] font-telegraf font-semibold transition-colors whitespace-nowrap"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          Joining...
                        </div>
                      ) : (
                        'Get Notified'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="bg-gradient-to-b from-green-500/20 to-green-600/20 border border-green-400/30 rounded-[3px] p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-400 font-telegraf font-semibold">You're on the list!</span>
                    </div>
                    <p className="text-white/80 font-telegraf text-sm">We'll notify you as soon as the Education Center launches.</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="mt-16 pt-12 border-t border-white/10">
                <h3 className="text-2xl font-telegraf font-bold text-white mb-8">What's Coming</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-telegraf font-semibold mb-2">Phase 1: Foundation Courses</h4>
                      <p className="text-white/60 font-telegraf text-sm">Solar basics, customer psychology, and objection handling</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-telegraf font-semibold mb-2">Phase 2: Advanced Strategies</h4>
                      <p className="text-white/60 font-telegraf text-sm">Complex sales scenarios and territory management</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-telegraf font-semibold mb-2">Phase 3: Leadership Track</h4>
                      <p className="text-white/60 font-telegraf text-sm">Team building and management skills</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-telegraf font-semibold mb-2">Phase 4: Certification</h4>
                      <p className="text-white/60 font-telegraf text-sm">Industry-recognized credentials and assessments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
