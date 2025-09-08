'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StatsContent, UpdateStatsContentData } from '@/lib/types/stats'
import Button from '@/components/Button'

export default function StatsAdmin() {
  const [statsContent, setStatsContent] = useState<StatsContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)

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

  const updateContent = async (id: string, updatedData: Partial<UpdateStatsContentData>) => {
    setSaving(id)
    try {
      const response = await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        await fetchStatsContent()
        setEditingSection(null)
      } else {
        throw new Error('Failed to update content')
      }
    } catch (error) {
      console.error('Error updating content:', error)
      alert('Failed to update content. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  const getContentBySection = (section: string) => {
    return statsContent.find(item => item.section === section)
  }

  const renderHeaderEditor = () => {
    const content = getContentBySection('header')
    if (!content) return null

    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-telegraf font-bold">Header Section</h3>
          <button
            onClick={() => setEditingSection(editingSection === 'header' ? null : 'header')}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
          >
            {editingSection === 'header' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingSection === 'header' ? (
          <HeaderEditForm 
            content={content} 
            onSave={(data) => updateContent(content.id, data)}
            saving={saving === content.id}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Main Title</label>
              <p className="text-white">{content.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
              <p className="text-white">{content.subtitle}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <p className="text-white">{content.content.description}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderComparisonEditor = () => {
    const content = getContentBySection('comparison')
    if (!content) return null

    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-telegraf font-bold">Comparison Section</h3>
          <button
            onClick={() => setEditingSection(editingSection === 'comparison' ? null : 'comparison')}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
          >
            {editingSection === 'comparison' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingSection === 'comparison' ? (
          <ComparisonEditForm 
            content={content} 
            onSave={(data) => updateContent(content.id, data)}
            saving={saving === content.id}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <p className="text-white">{content.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
              <p className="text-white">{content.subtitle}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Jobs Comparison</label>
              <div className="grid grid-cols-2 gap-2">
                {content.content.jobs?.map((job: any, index: number) => (
                  <div key={index} className="bg-[#2a2a2a] p-3 rounded">
                    <span className="mr-2">{job.icon}</span>
                    <span className="text-white">{job.name}: </span>
                    <span className="text-green-400 font-bold">{job.earnings}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Highlight Text</label>
              <p className="text-white italic">"{content.content.highlight_text}"</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderGrowthPathEditor = () => {
    const content = getContentBySection('growth_path')
    if (!content) return null

    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-telegraf font-bold">Growth Path Section</h3>
          <button
            onClick={() => setEditingSection(editingSection === 'growth_path' ? null : 'growth_path')}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
          >
            {editingSection === 'growth_path' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingSection === 'growth_path' ? (
          <GrowthPathEditForm 
            content={content} 
            onSave={(data) => updateContent(content.id, data)}
            saving={saving === content.id}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <p className="text-white">{content.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Growth Levels</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {content.content.levels?.map((level: any, index: number) => (
                  <div key={index} className="bg-[#2a2a2a] p-3 rounded">
                    <div className="font-bold text-yellow-400">{level.name}</div>
                    <div className="text-sm text-gray-300">{level.installs} installs → {level.earnings}</div>
                    <div className="text-xs text-gray-400">{level.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bottom Text</label>
              <p className="text-white italic">"{content.content.bottom_text}"</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSaleImpactEditor = () => {
    const content = getContentBySection('sale_impact')
    if (!content) return null

    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-telegraf font-bold">Sale Impact Section</h3>
          <button
            onClick={() => setEditingSection(editingSection === 'sale_impact' ? null : 'sale_impact')}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
          >
            {editingSection === 'sale_impact' ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingSection === 'sale_impact' ? (
          <SaleImpactEditForm 
            content={content} 
            onSave={(data) => updateContent(content.id, data)}
            saving={saving === content.id}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <p className="text-white">{content.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Impact Metrics</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {content.content.metrics?.map((metric: any, index: number) => (
                  <div key={index} className="bg-[#2a2a2a] p-3 rounded text-center">
                    <div className="text-2xl mb-1">{metric.icon}</div>
                    <div className="text-sm text-gray-300">{metric.label}</div>
                    <div className="font-bold text-green-400">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bottom Text</label>
              <p className="text-white italic">"{content.content.bottom_text}"</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading stats content...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="border-b border-[#333] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-telegraf font-bold">Stats Page CMS</h1>
              <p className="text-gray-400 text-sm">Edit earnings comparison and growth path content</p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/stats"
                target="_blank"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
              >
                Preview Page
              </Link>
              <Link 
                href="/admin"
                className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
              >
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {renderHeaderEditor()}
          {renderComparisonEditor()}
          {renderGrowthPathEditor()}
          {renderSaleImpactEditor()}
        </div>
      </div>
    </div>
  )
}

// Header Edit Form Component
function HeaderEditForm({ content, onSave, saving }: { content: StatsContent, onSave: (data: UpdateStatsContentData) => void, saving: boolean }) {
  const [formData, setFormData] = useState({
    title: content.title,
    subtitle: content.subtitle || '',
    description: content.content.description || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: content.id,
      section: content.section as any,
      title: formData.title,
      subtitle: formData.subtitle,
      content: { description: formData.description }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Main Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white resize-none"
        />
      </div>
      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

// Comparison Edit Form Component
function ComparisonEditForm({ content, onSave, saving }: { content: StatsContent, onSave: (data: UpdateStatsContentData) => void, saving: boolean }) {
  const [formData, setFormData] = useState({
    title: content.title,
    subtitle: content.subtitle || '',
    jobs: content.content.jobs || [],
    highlight_text: content.content.highlight_text || ''
  })

  const updateJob = (index: number, field: string, value: string) => {
    const updatedJobs = [...formData.jobs]
    updatedJobs[index] = { ...updatedJobs[index], [field]: value }
    setFormData(prev => ({ ...prev, jobs: updatedJobs }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: content.id,
      section: content.section as any,
      title: formData.title,
      subtitle: formData.subtitle,
      content: { 
        jobs: formData.jobs,
        highlight_text: formData.highlight_text
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-4">Jobs Comparison</label>
        <div className="space-y-4">
          {formData.jobs.map((job: any, index: number) => (
            <div key={index} className="bg-[#2a2a2a] p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Icon</label>
                  <input
                    type="text"
                    value={job.icon}
                    onChange={(e) => updateJob(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Job Name</label>
                  <input
                    type="text"
                    value={job.name}
                    onChange={(e) => updateJob(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Earnings</label>
                  <input
                    type="text"
                    value={job.earnings}
                    onChange={(e) => updateJob(index, 'earnings', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Highlight Text</label>
        <textarea
          value={formData.highlight_text}
          onChange={(e) => setFormData(prev => ({ ...prev, highlight_text: e.target.value }))}
          rows={2}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white resize-none"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

// Growth Path Edit Form Component
function GrowthPathEditForm({ content, onSave, saving }: { content: StatsContent, onSave: (data: UpdateStatsContentData) => void, saving: boolean }) {
  const [formData, setFormData] = useState({
    title: content.title,
    levels: content.content.levels || [],
    bottom_text: content.content.bottom_text || ''
  })

  const updateLevel = (index: number, field: string, value: string | number) => {
    const updatedLevels = [...formData.levels]
    updatedLevels[index] = { ...updatedLevels[index], [field]: value }
    setFormData(prev => ({ ...prev, levels: updatedLevels }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: content.id,
      section: content.section as any,
      title: formData.title,
      subtitle: '',
      content: { 
        levels: formData.levels,
        bottom_text: formData.bottom_text
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-4">Growth Levels</label>
        <div className="space-y-4">
          {formData.levels.map((level: any, index: number) => (
            <div key={index} className="bg-[#2a2a2a] p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Level Name</label>
                  <input
                    type="text"
                    value={level.name}
                    onChange={(e) => updateLevel(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Installs</label>
                  <input
                    type="number"
                    value={level.installs}
                    onChange={(e) => updateLevel(index, 'installs', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Earnings</label>
                  <input
                    type="text"
                    value={level.earnings}
                    onChange={(e) => updateLevel(index, 'earnings', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={level.description}
                    onChange={(e) => updateLevel(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Bottom Text</label>
        <textarea
          value={formData.bottom_text}
          onChange={(e) => setFormData(prev => ({ ...prev, bottom_text: e.target.value }))}
          rows={2}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white resize-none"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

// Sale Impact Edit Form Component
function SaleImpactEditForm({ content, onSave, saving }: { content: StatsContent, onSave: (data: UpdateStatsContentData) => void, saving: boolean }) {
  const [formData, setFormData] = useState({
    title: content.title,
    metrics: content.content.metrics || [],
    bottom_text: content.content.bottom_text || ''
  })

  const updateMetric = (index: number, field: string, value: string) => {
    const updatedMetrics = [...formData.metrics]
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value }
    setFormData(prev => ({ ...prev, metrics: updatedMetrics }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: content.id,
      section: content.section as any,
      title: formData.title,
      subtitle: '',
      content: { 
        metrics: formData.metrics,
        bottom_text: formData.bottom_text
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-4">Impact Metrics</label>
        <div className="space-y-4">
          {formData.metrics.map((metric: any, index: number) => (
            <div key={index} className="bg-[#2a2a2a] p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Icon</label>
                  <input
                    type="text"
                    value={metric.icon}
                    onChange={(e) => updateMetric(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Value</label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, 'value', e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Bottom Text</label>
        <textarea
          value={formData.bottom_text}
          onChange={(e) => setFormData(prev => ({ ...prev, bottom_text: e.target.value }))}
          rows={2}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-white resize-none"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
