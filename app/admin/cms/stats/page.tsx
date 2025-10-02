'use client'

import React, { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CMSgridCard from '@/components/admin/CMSgridCard'
import Button from '@/components/Button'

type SectionStat = { name: string; prefix: string; value: string; suffix: string }
type StatsGrid = {
  pageHeader: { prefix: string; text: string }
  subHeader: { whiteText: string; greyText: string }
  Section1: { title: string; stat1: SectionStat; stat2: SectionStat; stat3: SectionStat; stat4: SectionStat }
  Section2: { title: string; stat1: SectionStat; stat2: SectionStat; stat3: SectionStat; stat4: SectionStat }
  Section3: { title: string; stat1: SectionStat; stat2: SectionStat; stat3: SectionStat }
}

interface StatsData { grid: StatsGrid }

const defaultData: StatsData = {
  grid: {
    pageHeader: { prefix: '(1)', text: 'WHY SELL SOLAR WITH AVEYO?' },
    subHeader: {
      whiteText: 'Real Numbers. Real earnings. real impact.',
      greyText: 'Here’s how aveyo stacks up against the jobs most people settle for',
    },
    Section1: {
      title: 'THE BIG COMPARISON',
      stat1: { name: 'Food Delivery', prefix: '$', value: '13', suffix: 'K' },
      stat2: { name: 'Retail Associates', prefix: '$', value: '25', suffix: 'K' },
      stat3: { name: 'Call Center Rep', prefix: '$', value: '35', suffix: 'K' },
      stat4: { name: 'Aveyo Solar Sales Rep', prefix: '$', value: '120+', suffix: 'K' },
    },
    Section2: {
      title: 'YOUR GROWTH PATH WITH AVEYO',
      stat1: { name: 'Rookie', prefix: '$', value: '30', suffix: 'K' },
      stat2: { name: 'Growing Rep', prefix: '$', value: '70', suffix: 'K' },
      stat3: { name: 'Pro', prefix: '$', value: '140', suffix: 'K' },
      stat4: { name: 'Veteran', prefix: '$', value: '200+', suffix: 'K' },
    },
    Section3: {
      title: 'WHAT ONE SALE MEANS',
      stat1: { name: 'Your Commission', prefix: '$', value: '2500', suffix: '' },
      stat2: { name: 'Customer Savings (1 year)', prefix: '$', value: '1500', suffix: '' },
      stat3: { name: 'Carbon Offset', prefix: '', value: '15', suffix: 'Trees Planted' },
    },
  },
}

export default function StatsPageCMS() {
  const [data, setData] = useState<StatsData>(defaultData)
  const [baseline, setBaseline] = useState<StatsData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState<null | 'header' | 'subheader' | 's1' | 's2' | 's3'>(null)
  const [form, setForm] = useState<any>({})

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/cms/stats', { cache: 'no-store' })
      if (res.ok) {
        const resJson = await res.json()
        const content = resJson?.content && resJson.content.grid ? resJson.content : defaultData
        setData(content)
        setBaseline(content)
      }
    } catch (e) {
      console.error('[CMS][stats] fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const openModal = (key: 'header' | 'subheader' | 's1' | 's2' | 's3') => {
    setModal(key)
    if (key === 'header') setForm(data.grid.pageHeader)
    if (key === 'subheader') setForm(data.grid.subHeader)
    if (key === 's1') setForm({ ...data.grid.Section1 })
    if (key === 's2') setForm({ ...data.grid.Section2 })
    if (key === 's3') setForm({ ...data.grid.Section3 })
  }

  const applyForm = () => {
    if (modal === 'header') setData({ grid: { ...data.grid, pageHeader: { ...form } } })
    if (modal === 'subheader') setData({ grid: { ...data.grid, subHeader: { ...form } } })
    if (modal === 's1') setData({ grid: { ...data.grid, Section1: { ...data.grid.Section1, ...form } } })
    if (modal === 's2') setData({ grid: { ...data.grid, Section2: { ...data.grid.Section2, ...form } } })
    if (modal === 's3') setData({ grid: { ...data.grid, Section3: { ...data.grid.Section3, ...form } } })
    setModal(null)
    setForm({})
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { section_key: 'stats_page', content: data, is_published: true }
      const resp = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        setBaseline(data)
        await fetchStats()
      } else {
        console.error('[CMS][stats] save failed', resp.status)
      }
    } catch (e) {
      console.error('[CMS][stats] save exception', e)
    } finally {
      setSaving(false)
    }
  }

  const isDirty = () => JSON.stringify(data) !== JSON.stringify(baseline)

  if (loading) {
    return (
      <AdminLayout
        pageKey="admin"
        topBarTitle="Admin"
        breadcrumbs={[{ name: 'Admin', href: '/admin' }, { name: 'CMS', href: '/admin/cms' }, { name: 'Stats Page' }]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading stats...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      pageKey="admin"
      topBarTitle="Admin"
      breadcrumbs={[{ name: 'Admin', href: '/admin' }, { name: 'CMS', href: '/admin/cms' }, { name: 'Stats Page' }]}
    >
      <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-3xl font-telegraf font-bold">Stats Page CMS</h1>
              <p className="text-gray-400 mt-2">Edit the stats page hero and metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving || !isDirty()} className="bg-blue-600 hover:bg-blue-700">
                {saving ? 'Saving...' : isDirty() ? 'Save Changes' : 'Saved'}
              </Button>
              <Button variant="secondary" onClick={() => window.open('/stats', '_blank')} className="bg-gray-700 hover:bg-gray-600">
                View /stats →
              </Button>
            </div>
          </div>

          {/* Preview grid matching design */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Row 1: Header (left) and Subheader (right) */}
            <CMSgridCard
              type="text"
              className="md:col-span-2"
              title={`${data.grid.pageHeader.prefix} ${data.grid.pageHeader.text}`}
              onClick={() => openModal('header')}
              dirty={JSON.stringify(data.grid.pageHeader) !== JSON.stringify(baseline.grid.pageHeader)}
            />
            {/* <div className="hidden md:block" /> */}
            <CMSgridCard
              type="text"
              className="md:col-span-2"
              title={data.grid.subHeader.whiteText}
              description={data.grid.subHeader.greyText}
              onClick={() => openModal('subheader')}
              dirty={JSON.stringify(data.grid.subHeader) !== JSON.stringify(baseline.grid.subHeader)}
            />

            {/* Row 2: Section 1 Title */}
            <CMSgridCard
              type="text"
              className="md:col-span-4"
              title={data.grid.Section1.title}
              onClick={() => openModal('s1')}
              dirty={JSON.stringify(data.grid.Section1) !== JSON.stringify(baseline.grid.Section1)}
            />

            {/* Row 3: Section 1 Stats (4 cols) */}
            {[data.grid.Section1.stat1, data.grid.Section1.stat2, data.grid.Section1.stat3, data.grid.Section1.stat4].map((s, idx) => (
              <CMSgridCard
                key={`s1-${idx}`}
                type="text"
                title={`${s.prefix}${s.value}${s.suffix}`}
                subtitle={s.name}
                onClick={() => openModal('s1')}
                dirty={JSON.stringify(data.grid.Section1) !== JSON.stringify(baseline.grid.Section1)}
              />
            ))}

            {/* Row 4: Section 2 Title */}
            <CMSgridCard
              type="text"
              className="md:col-span-4"
              title={data.grid.Section2.title}
              onClick={() => openModal('s2')}
              dirty={JSON.stringify(data.grid.Section2) !== JSON.stringify(baseline.grid.Section2)}
            />

            {/* Row 5: Section 2 Stats (4 cols) */}
            {[data.grid.Section2.stat1, data.grid.Section2.stat2, data.grid.Section2.stat3, data.grid.Section2.stat4].map((s, idx) => (
              <CMSgridCard
                key={`s2-${idx}`}
                type="text"
                title={`${s.prefix}${s.value}${s.suffix}`}
                subtitle={s.name}
                onClick={() => openModal('s2')}
                dirty={JSON.stringify(data.grid.Section2) !== JSON.stringify(baseline.grid.Section2)}
              />
            ))}

            {/* Row 6: Section 3 Title */}
            <CMSgridCard
              type="text"
              className="md:col-span-4"
              title={data.grid.Section3.title}
              onClick={() => openModal('s3')}
              dirty={JSON.stringify(data.grid.Section3) !== JSON.stringify(baseline.grid.Section3)}
            />

            {/* Row 7: Section 3 Stats (3 cols) */}
            {[data.grid.Section3.stat1, data.grid.Section3.stat2, data.grid.Section3.stat3].map((s, idx) => (
              <CMSgridCard
                key={`s3-${idx}`}
                type="text"
                title={`${s.prefix}${s.value}${s.suffix}`}
                subtitle={s.name}
                onClick={() => openModal('s3')}
                dirty={JSON.stringify(data.grid.Section3) !== JSON.stringify(baseline.grid.Section3)}
              />
            ))}
          </div>

          {/* Edit Modal */}
          {modal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-[#111] border border-[#2a2a2a] rounded p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto text-white space-y-4">
                <h3 className="text-lg font-semibold">
                  {modal === 'header' && 'Edit Page Header'}
                  {modal === 'subheader' && 'Edit Subheader'}
                  {modal === 's1' && 'Edit Section 1: The Big Comparison'}
                  {modal === 's2' && 'Edit Section 2: Growth Path'}
                  {modal === 's3' && 'Edit Section 3: One Sale Means'}
                </h3>

                {modal === 'header' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm">Prefix
                      <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form.prefix || ''} onChange={(e)=>setForm({...form, prefix:e.target.value})} />
                    </label>
                    <label className="text-sm">Text
                      <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form.text || ''} onChange={(e)=>setForm({...form, text:e.target.value})} />
                    </label>
                  </div>
                )}

                {modal === 'subheader' && (
                  <div className="grid grid-cols-1 gap-4">
                    <label className="text-sm">White Text
                      <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form.whiteText || ''} onChange={(e)=>setForm({...form, whiteText:e.target.value})} />
                    </label>
                    <label className="text-sm">Grey Text
                      <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form.greyText || ''} onChange={(e)=>setForm({...form, greyText:e.target.value})} />
                    </label>
                  </div>
                )}

                {(modal === 's1' || modal === 's2' || modal === 's3') && (
                  <div className="space-y-4">
                    <label className="text-sm block">Title
                      <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form.title || ''} onChange={(e)=>setForm({...form, title:e.target.value})} />
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['stat1','stat2','stat3','stat4'].map((key) => (
                        (form[key] || (key !== 'stat4' || modal !== 's3')) && (
                          <div key={key} className="space-y-2 border border-[#2a2a2a] rounded p-3">
                            <div className="font-semibold text-sm uppercase">{key}</div>
                            <label className="text-xs block">Name
                              <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form[key]?.name || ''} onChange={(e)=>setForm({...form, [key]: { ...(form[key]||{name:'',prefix:'',value:'',suffix:''}), name:e.target.value }})} />
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <label className="text-xs">Prefix
                                <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form[key]?.prefix || ''} onChange={(e)=>setForm({...form, [key]: { ...(form[key]||{name:'',prefix:'',value:'',suffix:''}), prefix:e.target.value }})} />
                              </label>
                              <label className="text-xs">Value
                                <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form[key]?.value || ''} onChange={(e)=>setForm({...form, [key]: { ...(form[key]||{name:'',prefix:'',value:'',suffix:''}), value:e.target.value }})} />
                              </label>
                              <label className="text-xs">Suffix
                                <input className="w-full p-2 bg-gray-800 rounded border border-[#333]" value={form[key]?.suffix || ''} onChange={(e)=>setForm({...form, [key]: { ...(form[key]||{name:'',prefix:'',value:'',suffix:''}), suffix:e.target.value }})} />
                              </label>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={applyForm} className="bg-blue-600 hover:bg-blue-700">Apply</Button>
                  <Button variant="secondary" onClick={()=>{ setModal(null); setForm({}) }} className="bg-gray-700 hover:bg-gray-600">Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
