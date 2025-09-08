'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { StatsContent } from '@/lib/types/stats'

export default function StatsPage() {
  const [statsContent, setStatsContent] = useState<StatsContent[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading stats...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        {headerContent && (
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-telegraf font-bold mb-6">
              {headerContent.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              {headerContent.subtitle}
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              {headerContent.content.description}
            </p>
          </div>
        )}

        {/* Comparison Section */}
        {comparisonContent && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-telegraf font-bold mb-4">
                1. {comparisonContent.title}
              </h2>
              <p className="text-xl text-gray-300">
                {comparisonContent.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {comparisonContent.content.jobs?.map((job: any, index: number) => (
                <div
                  key={index}
                  className={`bg-[#1a1a1a] border rounded-lg p-6 text-center transition-all duration-300 ${
                    job.name === 'Aveyo Solar Sales Rep'
                      ? 'border-yellow-400 bg-yellow-400/10 scale-105'
                      : 'border-[#333] hover:border-gray-500'
                  }`}
                >
                  <div className="text-4xl mb-4">{job.icon}</div>
                  <h3 className="font-telegraf font-semibold mb-2 text-sm">
                    {job.name}
                  </h3>
                  <div className={`text-2xl font-bold ${
                    job.name === 'Aveyo Solar Sales Rep' ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {job.earnings}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 text-center">
              <p className="text-lg text-gray-300 italic">
                "{comparisonContent.content.highlight_text}"
              </p>
            </div>
          </div>
        )}

        {/* Growth Path Section */}
        {growthPathContent && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-telegraf font-bold mb-4">
                2. {growthPathContent.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {growthPathContent.content.levels?.map((level: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-white transition-all duration-300"
                >
                  <h3 className="text-xl font-telegraf font-bold mb-3 text-yellow-400">
                    {level.name}
                  </h3>
                  <div className="mb-3">
                    <span className="text-2xl font-bold">{level.installs}</span>
                    <span className="text-gray-400 ml-1">installs →</span>
                  </div>
                  <div className="text-xl font-bold text-green-400 mb-3">
                    {level.earnings}
                  </div>
                  <p className="text-sm text-gray-400 italic">
                    {level.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 text-center">
              <p className="text-lg text-gray-300 italic">
                "{growthPathContent.content.bottom_text}"
              </p>
            </div>
          </div>
        )}

        {/* Sale Impact Section */}
        {saleImpactContent && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-telegraf font-bold mb-4">
                3. {saleImpactContent.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {saleImpactContent.content.metrics?.map((metric: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 text-center hover:border-white transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{metric.icon}</div>
                  <h3 className="font-telegraf font-semibold mb-2 text-gray-300">
                    {metric.label}
                  </h3>
                  <div className="text-2xl font-bold text-green-400">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 text-center">
              <p className="text-lg text-gray-300 italic">
                "{saleImpactContent.content.bottom_text}"
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-2xl p-12">
          <h2 className="text-3xl font-telegraf font-bold mb-4">
            Ready to Start Your Solar Career?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of reps who've already discovered the earning potential of solar sales.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-telegraf font-bold text-lg hover:bg-yellow-300 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}
