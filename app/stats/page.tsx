'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import Navbar from '@/components/Navbar';
import { StatsContent } from '@/lib/types/stats'

export default function StatsPage() {
  const [statsContent, setStatsContent] = useState<StatsContent[]>([])
  const [loading, setLoading] = useState(true)

  // Animation state for sections
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(Array.from(prev).concat(sectionId)))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    // Observe all sections with IDs
    const sections = [
      'stats-header',
      'stats-comparison', 
      'stats-growth-path',
      'stats-sale-impact'
    ]

    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [loading]) // Re-run when loading changes to ensure elements exist

  useEffect(() => {
    fetchStatsContent()
  }, [])

  const fetchStatsContent = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStatsContent(data)
      }
    } catch (error) {
      console.error('Error fetching stats content:', error)
    } finally {
      setLoading(false)
    }
  }

  const getContentBySection = (section: string) => {
    return statsContent.find(item => item.section === section)
  }

  const headerContent = getContentBySection('header')
  const comparisonContent = getContentBySection('comparison')
  const growthPathContent = getContentBySection('growth_path')
  const saleImpactContent = getContentBySection('sale_impact')

  // Helper function to parse earnings string to number (e.g., "$25K" -> 25)
  const parseEarnings = (earningsStr: string): number => {
    if (!earningsStr) return 0
    const match = earningsStr.match(/\d+/)
    return match ? parseInt(match[0]) : 0
  }

  // Prepare bar chart data from CMS comparison content
  const barChartData = comparisonContent?.content?.jobs?.map((job: any) => ({
    name: job.name,
    earnings: parseEarnings(job.earnings),
    color: job.name.toLowerCase().includes('aveyo') ? '#9ec5fe' : '#a8a8a8'
  })) || [
    { name: 'Food Delivery', earnings: 13, color: '#a8a8a8' },
    { name: 'Retail Associate', earnings: 18, color: '#a8a8a8' },
    { name: 'Call Center Rep', earnings: 22, color: '#a8a8a8' },
    { name: 'Aveyo Solar Sales Rep', earnings: 40, color: '#9ec5fe' }
  ]

  // Prepare line chart data from CMS growth path content
  const lineChartData = growthPathContent?.content?.levels?.map((level: any) => ({
    name: level.name,
    earnings: parseEarnings(level.earnings)
  })) || [
    { name: 'Rookie', earnings: 30 },
    { name: 'Growing Rep', earnings: 70 },
    { name: 'Pro', earnings: 140 },
    { name: 'Veteran', earnings: 200 }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading stats...</p>
          </div>
        </div>
      )}
      
      <div className="box-border content-stretch flex flex-col items-center justify-start px-6 sm:px-8 md:px-10 lg:px-[50px] py-12 sm:py-16 lg:py-[100px] relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[60px] sm:gap-[80px] lg:gap-[90px] items-start justify-start max-w-[1480px] pb-[30px] pt-0 px-0 relative w-full">
          {/* Header Section */}
          <div 
            id="stats-header"
            className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 leading-[0] not-italic relative shrink-0 w-full transition-all duration-700 ${
              visibleSections.has('stats-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="content-stretch flex gap-2.5 items-start justify-start relative text-white">
              <div className="font-telegraf relative shrink-0 text-[16px] text-nowrap">
                <p className="leading-[normal] whitespace-pre">(1)</p>
              </div>
              <h1 className="font-telegraf font-extrabold leading-[0.8] text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px] uppercase w-full md:w-[70%]">
                {headerContent?.title || "Why Sell Solar With Aveyo?"}
              </h1>
            </div>
            <div className="font-telegraf font-bold leading-[0] not-italic relative shrink-0 text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] text-left md:text-right text-white uppercase w-full md:w-[555.304px]">
              <p className="leading-[normal]">
                <span>Real Numbers. Real earnings. real impact. </span>
                <span className="text-[rgba(255,255,255,0.6)]">
                  {headerContent?.subtitle || "Here's how aveyo stacks up against the jobs most people settle for"}
                </span>
              </p>
            </div>
          </div>

          {/* The Big Comparison Section */}
          <div 
            id="stats-comparison"
            className={`content-stretch flex flex-col gap-5 items-start justify-start relative shrink-0 w-full transition-all duration-700 ${
              visibleSections.has('stats-comparison') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-[30px] pt-0 px-0 relative shrink-0">
              <div className="font-telegraf font-black leading-[0] not-italic relative shrink-0 text-[30px] text-white uppercase w-[721.026px]">
                <p className="leading-[normal]">{comparisonContent?.title || "The big comparison"}</p>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="content-stretch flex gap-5 h-[260px] sm:h-[320px] md:h-[381px] items-start justify-start relative shrink-0 w-full">
              <div className="basis-0 bg-[#121212] box-border content-stretch flex flex-col grow h-full items-center justify-between min-h-px min-w-px overflow-clip pt-[40px] relative rounded-[3px] shrink-0">
                <div className="basis-0 content-stretch flex flex-col gap-6 grow items-center justify-start min-h-px min-w-px relative shrink-0 w-full">
                  <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0 w-full">
                    {/* Bar Chart - Recharts Implementation with built-in labels */}
                    <div className="basis-0 box-border content-stretch flex grow h-full items-center justify-center min-h-px min-w-px overflow-clip py-0 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barChartData}
                          margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
                        >
                          <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 12, 
                              fill: '#888d95', 
                              fontFamily: 'PP Telegraf, sans-serif',
                              fontWeight: 'bold'
                            }}
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                            height={60}
                            tickMargin={8}
                          />
                          <YAxis 
                            domain={[0, 50]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 14, 
                              fill: '#888d95', 
                              fontFamily: 'PP Telegraf, sans-serif',
                              fontWeight: 'bold'
                            }}
                            tickFormatter={(value) => `${value}k`}
                          />
                          <Bar dataKey="earnings" radius={[0, 0, 0, 0]}>
                            {barChartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comparison Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch relative w-full md:h-[200px] h-[340px]">
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">13</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Food Delivery</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">25</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Retail Associate</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">35</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Call Center Rep</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#9dc3fc] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">120+</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#9dc3fc] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Aveyo Solar Sales Rep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Path Section */}
          <div 
            id="stats-growth-path"
            className={`content-stretch flex flex-col gap-5 items-start justify-start relative shrink-0 w-full transition-all duration-700 ${
              visibleSections.has('stats-growth-path') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-[30px] pt-0 px-0 relative shrink-0">
              <div className="font-telegraf font-black leading-[0] not-italic relative shrink-0 text-[30px] text-white uppercase w-[100%]">
                <p className="leading-[normal]">{growthPathContent?.title || "Your Growth Path with Aveyo"}</p>
              </div>
            </div>
            
            {/* Line Graph Visualization */}
            <div className="content-stretch flex gap-5 h-[381px] items-start justify-start relative shrink-0 w-full">
              <div className="basis-0 bg-[#121212] box-border content-stretch flex flex-col grow h-full items-center justify-between min-h-px min-w-px overflow-clip pt-[40px] relative rounded-[3px] shrink-0">
                <div className="basis-0 content-stretch flex flex-col gap-6 grow items-center justify-start min-h-px min-w-px relative shrink-0 w-full">
                  <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0 w-full">
                    
                    {/* Line Graph Area - Recharts Implementation */}
                    <div className="basis-0 box-border content-stretch flex grow h-full items-center justify-center min-h-px min-w-px overflow-clip py-0 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={lineChartData}
                          margin={{ top: 30, right: 10, left: 0, bottom: 50 }}
                        >
                          <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 12, 
                              fill: '#888d95', 
                              fontFamily: 'PP Telegraf, sans-serif',
                              fontWeight: 'bold'
                            }}
                            interval={0}
                            padding={{ left: 20, right: 20 }}
                            angle={-35}
                            textAnchor="end"
                            height={60}
                            tickMargin={8}
                          />
                          <YAxis 
                            domain={[0, 200]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 14, 
                              fill: '#888d95', 
                              fontFamily: 'PP Telegraf, sans-serif',
                              fontWeight: 'bold'
                            }}
                            tickFormatter={(value) => `${value}k`}
                          />
                          {/* Grid lines */}
                          <ReferenceLine y={0} stroke="#333" strokeOpacity={0.3} strokeWidth={0.5} />
                          <ReferenceLine y={50} stroke="#333" strokeOpacity={0.3} strokeWidth={0.5} />
                          <ReferenceLine y={100} stroke="#333" strokeOpacity={0.3} strokeWidth={0.5} />
                          <ReferenceLine y={150} stroke="#333" strokeOpacity={0.3} strokeWidth={0.5} />
                          <ReferenceLine y={200} stroke="#333" strokeOpacity={0.3} strokeWidth={0.5} />
                          <Line 
                            type="linear" 
                            dataKey="earnings" 
                            stroke="#4A90E2" 
                            strokeWidth={3}
                            dot={{ fill: '#4A90E2', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: '#4A90E2' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Growth Path Milestone Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch relative w-full md:h-[200px] h-[340px]">
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">30</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Rookie</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">70</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Growing Rep</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">140</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Pro</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                      <p className="leading-[normal] whitespace-pre">200+</p>
                    </div>
                    <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                      <p className="leading-[normal]">K</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre">Veteran</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What One Sale Means Section */}
          <div 
            id="stats-sale-impact"
            className={`content-stretch flex flex-col gap-5 items-start justify-start relative shrink-0 w-full transition-all duration-700 ${
              visibleSections.has('stats-sale-impact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-[30px] pt-0 px-0 relative shrink-0">
              <div className="font-telegraf font-black leading-[0] not-italic relative shrink-0 text-[30px] text-nowrap text-white uppercase">
                <p className="leading-[normal] whitespace-pre">{saleImpactContent?.title || "What one sale means"}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch relative w-full md:h-[200px] h-[340px]">
              <div className="basis-0 bg-gradient-to-t box-border content-stretch flex flex-col from-[#121212] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#37414f]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-nowrap text-white w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 md:text-[25px] text-[18px]">
                      <p className="leading-[normal] text-nowrap whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px]">
                      <p className="leading-[normal] text-nowrap whitespace-pre">2500</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[14px]">
                    <p className="leading-[normal] text-nowrap whitespace-pre">Your Commission</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-t box-border content-stretch flex flex-col from-[#121212] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#37414f]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-nowrap text-white w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 md:text-[25px] text-[18px]">
                      <p className="leading-[normal] text-nowrap whitespace-pre">$</p>
                    </div>
                    <div className="relative shrink-0 text-[50px]">
                      <p className="leading-[normal] text-nowrap whitespace-pre">1500</p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[14px]">
                    <p className="leading-[normal] text-nowrap whitespace-pre">Customer Savings (1 year)</p>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-gradient-to-t box-border content-stretch flex flex-col from-[#121212] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#37414f]">
                <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-nowrap text-white w-full">
                  <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                    <div className="relative shrink-0 text-[50px]">
                      <p className="leading-[normal] text-nowrap whitespace-pre">15</p>
                    </div>
                    <div className="flex flex-col justify-end relative shrink-0 md:text-[19px] text-[16px]">
                      <p className="leading-[20px] text-nowrap whitespace-pre">
                        Trees<br />Planted
                      </p>
                    </div>
                  </div>
                  <div className="font-telegraf relative shrink-0 text-[14px]">
                    <p className="leading-[normal] text-nowrap whitespace-pre">Carbon Offset</p>
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
