'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import Navbar from '@/components/Navbar';

export default function StatsPage() {
  const [cms, setCms] = useState<any>(null)
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
      const response = await fetch('/api/cms/stats', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setCms(data?.content || null)
      }
    } catch (error) {
      console.error('Error fetching stats content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Shortcuts into CMS nested grid object
  const grid = cms?.grid
  const section1 = grid?.Section1
  const section2 = grid?.Section2
  const section3 = grid?.Section3

  // Helper function to parse earnings string to number (e.g., "$25K" -> 25)
  const parseEarnings = (earningsStr: string): number => {
    if (!earningsStr) return 0
    const match = earningsStr.match(/\d+/)
    return match ? parseInt(match[0]) : 0
  }

  // Prepare bar chart data from CMS Section1
  const barChartData = section1 ? [
    { name: section1.stat1.name, earnings: parseEarnings(`${section1.stat1.value}`), color: '#a8a8a8' },
    { name: section1.stat2.name, earnings: parseEarnings(`${section1.stat2.value}`), color: '#a8a8a8' },
    { name: section1.stat3.name, earnings: parseEarnings(`${section1.stat3.value}`), color: '#a8a8a8' },
    { name: section1.stat4.name, earnings: parseEarnings(`${section1.stat4.value}`), color: '#9ec5fe' }
  ] : [
    { name: 'Food Delivery', earnings: 13, color: '#a8a8a8' },
    { name: 'Retail Associate', earnings: 18, color: '#a8a8a8' },
    { name: 'Call Center Rep', earnings: 22, color: '#a8a8a8' },
    { name: 'Aveyo Solar Sales Rep', earnings: 40, color: '#9ec5fe' }
  ]

  // Prepare line chart data from CMS Section2
  const lineChartData = section2 ? [
    { name: section2.stat1.name, earnings: parseEarnings(`${section2.stat1.value}`) },
    { name: section2.stat2.name, earnings: parseEarnings(`${section2.stat2.value}`) },
    { name: section2.stat3.name, earnings: parseEarnings(`${section2.stat3.value}`) },
    { name: section2.stat4.name, earnings: parseEarnings(`${section2.stat4.value}`) },
  ] : [
    { name: 'Rookie', earnings: 30 },
    { name: 'Growing Rep', earnings: 70 },
    { name: 'Pro', earnings: 140 },
    { name: 'Veteran', earnings: 200 }
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-[50px] md:pt-[150px] overflow-x-hidden">
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
                <p className="leading-[normal] whitespace-pre">{grid?.pageHeader?.prefix || '(1)'}</p>
              </div>
              <h1 className="font-telegraf font-extrabold leading-[0.8] text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px] uppercase w-full md:w-[70%]">
                {grid?.pageHeader?.text || 'Why Sell Solar With Aveyo?'}
              </h1>
            </div>
            <div className="font-telegraf font-bold leading-[0] not-italic relative shrink-0 text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] text-left md:text-right text-white uppercase w-full md:w-[555.304px]">
              <p className="leading-[normal]">
                <span>{grid?.subHeader?.whiteText || 'Real Numbers. Real earnings. real impact.'} </span>
                <span className="text-[rgba(255,255,255,0.6)]">
                  {grid?.subHeader?.greyText || "Here's how aveyo stacks up against the jobs most people settle for"}
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
                <p className="leading-[normal]">{section1?.title || 'The big comparison'}</p>
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
                          {/* <XAxis 
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
                          /> */}
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
            
            {/* Comparison Tiles (from CMS Section1) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch relative w-full md:h-[200px] h-[340px]">
              {(
                section1
                  ? [section1.stat1, section1.stat2, section1.stat3, section1.stat4]
                  : [
                      { name: 'Food Delivery', prefix: '$', value: '13', suffix: 'K' },
                      { name: 'Retail Associate', prefix: '$', value: '25', suffix: 'K' },
                      { name: 'Call Center Rep', prefix: '$', value: '35', suffix: 'K' },
                      { name: 'Aveyo Solar Sales Rep', prefix: '$', value: '120+', suffix: 'K' },
                    ]
              ).map((s: any, idx: number) => {
                const highlight = (s?.name || '').toLowerCase().includes('aveyo')
                const colorClass = highlight ? 'text-[#9dc3fc]' : 'text-[#888d95]'
                return (
                  <div key={`s1-tile-${idx}`} className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                    <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                      <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                        <div className={`relative shrink-0 ${colorClass} md:text-[25px] text-[18px] text-nowrap`}>
                          <p className="leading-[normal] whitespace-pre">{s?.prefix || ''}</p>
                        </div>
                        <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                          <p className="leading-[normal] whitespace-pre">{s?.value || ''}</p>
                        </div>
                        {s?.suffix ? (
                          <div className={`flex flex-col justify-end relative self-stretch shrink-0 ${colorClass} md:text-[25px] text-[18px] w-3.5`}>
                            <p className="leading-[normal]">{s.suffix}</p>
                          </div>
                        ) : null}
                      </div>
                      <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                        <p className="leading-[normal] whitespace-pre">{s?.name || ''}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
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
                <p className="leading-[normal]">{section2?.title || 'Your Growth Path with Aveyo'}</p>
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

            {/* Growth Path Milestone Cards (from CMS Section2) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch relative w-full md:h-[200px] h-[340px]">
              {(
                section2
                  ? [section2.stat1, section2.stat2, section2.stat3, section2.stat4]
                  : [
                      { name: 'Rookie', prefix: '$', value: '30', suffix: 'K' },
                      { name: 'Growing Rep', prefix: '$', value: '70', suffix: 'K' },
                      { name: 'Pro', prefix: '$', value: '140', suffix: 'K' },
                      { name: 'Veteran', prefix: '$', value: '200+', suffix: 'K' },
                    ]
              ).map((s: any, idx: number) => (
                <div key={`s2-tile-${idx}`} className="basis-0 bg-gradient-to-b box-border content-stretch flex flex-col from-[#171717] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#0e0e0e]">
                  <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 w-full">
                    <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                      <div className="relative shrink-0 text-[#888d95] md:text-[25px] text-[18px] text-nowrap">
                        <p className="leading-[normal] whitespace-pre">{s?.prefix || ''}</p>
                      </div>
                      <div className="relative shrink-0 text-[50px] text-nowrap text-white">
                        <p className="leading-[normal] whitespace-pre">{s?.value || ''}</p>
                      </div>
                      {s?.suffix ? (
                        <div className="flex flex-col justify-end relative self-stretch shrink-0 text-[#888d95] md:text-[25px] text-[18px] w-3.5">
                          <p className="leading-[normal]">{s.suffix}</p>
                        </div>
                      ) : null}
                    </div>
                    <div className="font-telegraf relative shrink-0 text-[#888d95] text-[14px] text-nowrap">
                      <p className="leading-[normal] whitespace-pre">{s?.name || ''}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                <p className="leading-[normal] whitespace-pre">{section3?.title || 'What one sale means'}</p>
              </div>
            </div>
            
            {/* What One Sale Means (from CMS Section3) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch relative w-full md:h-[200px] h-[340px]">
              {(
                section3
                  ? [section3.stat1, section3.stat2, section3.stat3]
                  : [
                      { name: 'Your Commission', prefix: '$', value: '2500', suffix: '' },
                      { name: 'Customer Savings (1 year)', prefix: '$', value: '1500', suffix: '' },
                      { name: 'Carbon Offset', prefix: '', value: '15', suffix: 'Trees Planted' },
                    ]
              ).map((s: any, idx: number) => (
                <div key={`s3-tile-${idx}`} className="basis-0 bg-gradient-to-t box-border content-stretch flex flex-col from-[#121212] grow h-full items-center justify-between min-h-px min-w-px overflow-clip p-[20px] relative rounded-[3px] shrink-0 to-[#37414f]">
                  <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-nowrap text-white w-full">
                    <div className="content-stretch flex font-telegraf font-black gap-[7px] items-start justify-center relative shrink-0">
                      {s?.prefix ? (
                        <div className="relative shrink-0 md:text-[25px] text-[18px]">
                          <p className="leading-[normal] text-nowrap whitespace-pre">{s.prefix}</p>
                        </div>
                      ) : null}
                      <div className="relative shrink-0 text-[50px]">
                        <p className="leading-[normal] text-nowrap whitespace-pre">{s?.value || ''}</p>
                      </div>
                      {s?.suffix ? (
                        <div className="flex flex-col justify-end relative shrink-0 md:text-[19px] text-[16px]">
                          <p className="leading-[20px] text-nowrap whitespace-pre">
                            {s.suffix.includes('\n') ? s.suffix : s.suffix}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="font-telegraf relative shrink-0 text-[14px]">
                      <p className="leading-[normal] text-nowrap whitespace-pre">{s?.name || ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
