'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

interface SalesContent {
  section_number: string
  section_title: string
  main_heading: string
  description: string
  copyright: string
  background_logo: string
  grid: {
    large_image: {
      url: string
      alt: string
    }
    text_block: {
      title: string
      content: string
    }
    button: {
      text: string
      variant: string
    }
    stat_card_1: {
      value: string
      prefix?: string
      suffix?: string
      title: string
      description: string
    }
    stat_card_2: {
      value: string
      prefix?: string
      suffix?: string
      title: string
      description: string
    }
    bottom_image: {
      url: string
      alt: string
    }
  }
}

export default function SalesAdmin() {
  const [content, setContent] = useState<SalesContent>({
    section_number: '(3)',
    section_title: 'Sales.',
    main_heading: 'Not Your Average Sales Gig.',
    description: 'UNLIMITED POTENTIAL. PROVEN METHODS. MASSIVE EARNINGS. REAL FREEDOM. AND A CULTURE THAT CARES. HERE, YOUR HARD WORK SPEAKS FOR ITSELF.',
    copyright: '© 2025 myaveyo',
    background_logo: '/aveyoSalesLogo.svg',
    grid: {
      large_image: {
        url: '/images/donny-hammond.jpeg',
        alt: 'Sales representative'
      },
      text_block: {
        title: 'A COMPLETELY KITTED TOOL KIT.',
        content: 'No limits, just wins. From your first deal to your biggest bonus, we set you up with the tools, training, and support you need to crush goals and climb fast. When you win, the whole team wins—and we celebrate every step of the way.'
      },
      button: {
        text: 'JOIN THE TEAM',
        variant: 'primary'
      },
      stat_card_1: {
        value: '540',
        title: 'Milestones Achieved',
        description: 'Career milestones achieved by Aveyo reps last year'
      },
      stat_card_2: {
        value: '850',
        prefix: '$',
        suffix: 'K',
        title: 'Total Earned',
        description: 'By our reps in commissions and bonuses'
      },
      bottom_image: {
        url: '/images/Alpha Aveyo-4.jpeg',
        alt: 'Team photo'
      }
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<SalesContent>(content)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/sales')
        if (response.ok) {
          const data = await response.json()
          setContent(data)
          setEditForm(data)
        }
      } catch (error) {
        console.error('Failed to fetch sales content:', error)
      }
    }

    fetchContent()
  }, [])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/sales', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setContent(editForm)
        setIsEditing(false)
      } else {
        console.error('Failed to save sales content')
      }
    } catch (error) {
      console.error('Error saving sales content:', error)
    }
  }

  const handleCancel = () => {
    setEditForm(content)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="border-b border-[#333] px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-[#888d95] hover:text-white text-sm mb-2 block">
              ← Back to Admin
            </Link>
            <h1 className="text-2xl font-telegraf font-bold">Sales Section CMS</h1>
            <p className="text-[#888d95] text-sm mt-1">
              Manage the sales section content and messaging
            </p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Edit Content
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[#888d95] text-sm mb-2">Section Number</label>
                <input
                  type="text"
                  value={editForm.section_number}
                  onChange={(e) => setEditForm(prev => ({ ...prev, section_number: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-[#888d95] text-sm mb-2">Section Title</label>
                <input
                  type="text"
                  value={editForm.section_title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, section_title: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#888d95] text-sm mb-2">Main Heading</label>
              <input
                type="text"
                value={editForm.main_heading}
                onChange={(e) => setEditForm(prev => ({ ...prev, main_heading: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[#888d95] text-sm mb-2">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white h-32 resize-none"
                placeholder="Enter the main description text..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[#888d95] text-sm mb-2">Copyright Text</label>
                <input
                  type="text"
                  value={editForm.copyright}
                  onChange={(e) => setEditForm(prev => ({ ...prev, copyright: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-[#888d95] text-sm mb-2">Background Logo Path</label>
                <input
                  type="text"
                  value={editForm.background_logo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, background_logo: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                  placeholder="/path/to/logo.svg"
                />
              </div>
            </div>

            {/* Grid Content Section */}
            <div className="mt-8 p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
              <h4 className="text-lg font-telegraf font-semibold mb-6">Grid Content</h4>
              
              {/* Large Image */}
              <div className="mb-6">
                <ImageUpload
                  currentUrl={editForm.grid.large_image.url}
                  currentAlt={editForm.grid.large_image.alt}
                  onImageChange={(url, alt) => setEditForm(prev => ({
                    ...prev,
                    grid: {
                      ...prev.grid,
                      large_image: { url, alt }
                    }
                  }))}
                  label="Large Image"
                />
              </div>

            {/* Text Block */}
            <div className="mb-6">
              <h5 className="text-md font-telegraf font-medium mb-3">Text Block</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#888d95] text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={editForm.grid.text_block.title}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      grid: { 
                        ...prev.grid, 
                        text_block: { ...prev.grid.text_block, title: e.target.value }
                      }
                    }))}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#888d95] text-sm mb-2">Content</label>
                  <textarea
                    value={editForm.grid.text_block.content}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      grid: { 
                        ...prev.grid, 
                        text_block: { ...prev.grid.text_block, content: e.target.value }
                      }
                    }))}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white h-24 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="mb-6">
              <h5 className="text-md font-telegraf font-medium mb-3">Button</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#888d95] text-sm mb-2">Button Text</label>
                  <input
                    type="text"
                    value={editForm.grid.button.text}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      grid: { 
                        ...prev.grid, 
                        button: { ...prev.grid.button, text: e.target.value }
                      }
                    }))}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#888d95] text-sm mb-2">Variant</label>
                  <select
                    value={editForm.grid.button.variant}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      grid: { 
                        ...prev.grid, 
                        button: { ...prev.grid.button, variant: e.target.value }
                      }
                    }))}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-2 text-white"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Stat Card 1 */}
              <div>
                <h5 className="text-md font-telegraf font-medium mb-3">Stats Card 1</h5>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[#888d95] text-xs mb-1">Prefix</label>
                      <input
                        type="text"
                        value={editForm.grid.stat_card_1.prefix || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          grid: { 
                            ...prev.grid, 
                            stat_card_1: { ...prev.grid.stat_card_1, prefix: e.target.value || undefined }
                          }
                        }))}
                        className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                        placeholder="$"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888d95] text-xs mb-1">Value</label>
                      <input
                        type="text"
                        value={editForm.grid.stat_card_1.value}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          grid: { 
                            ...prev.grid, 
                            stat_card_1: { ...prev.grid.stat_card_1, value: e.target.value }
                          }
                        }))}
                        className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888d95] text-xs mb-1">Suffix</label>
                      <input
                        type="text"
                        value={editForm.grid.stat_card_1.suffix || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          grid: { 
                            ...prev.grid, 
                            stat_card_1: { ...prev.grid.stat_card_1, suffix: e.target.value || undefined }
                          }
                        }))}
                        className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                        placeholder="K"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#888d95] text-xs mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.grid.stat_card_1.title}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        grid: { 
                          ...prev.grid, 
                          stat_card_1: { ...prev.grid.stat_card_1, title: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[#888d95] text-xs mb-1">Description</label>
                    <textarea
                      value={editForm.grid.stat_card_1.description}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        grid: { 
                          ...prev.grid, 
                          stat_card_1: { ...prev.grid.stat_card_1, description: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm h-16 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div>
                <h5 className="text-md font-telegraf font-medium mb-3">Stats Card 2</h5>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[#888d95] text-xs mb-1">Prefix</label>
                      <input
                        type="text"
                        value={editForm.grid.stat_card_2.prefix || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          grid: { 
                            ...prev.grid, 
                            stat_card_2: { ...prev.grid.stat_card_2, prefix: e.target.value || undefined }
                          }
                        }))}
                        className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                        placeholder="$"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888d95] text-xs mb-1">Value</label>
                      <input
                        type="text"
                        value={editForm.grid.stat_card_2.value}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          grid: { 
                            ...prev.grid, 
                            stat_card_2: { ...prev.grid.stat_card_2, value: e.target.value }
                          }
                        }))}
                        className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888d95] text-xs mb-1">Suffix</label>
                      <input
                        type="text"
                        value={editForm.grid.stat_card_2.suffix || ''}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          grid: { 
                            ...prev.grid, 
                            stat_card_2: { ...prev.grid.stat_card_2, suffix: e.target.value || undefined }
                          }
                        }))}
                        className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                        placeholder="K"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#888d95] text-xs mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.grid.stat_card_2.title}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        grid: { 
                          ...prev.grid, 
                          stat_card_2: { ...prev.grid.stat_card_2, title: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[#888d95] text-xs mb-1">Description</label>
                    <textarea
                      value={editForm.grid.stat_card_2.description}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        grid: { 
                          ...prev.grid, 
                          stat_card_2: { ...prev.grid.stat_card_2, description: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-white text-sm h-16 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Image */}
            <div>
              <ImageUpload
                currentUrl={editForm.grid.bottom_image.url}
                currentAlt={editForm.grid.bottom_image.alt}
                onImageChange={(url, alt) => setEditForm(prev => ({
                  ...prev,
                  grid: {
                    ...prev.grid,
                    bottom_image: { url, alt }
                  }
                }))}
                label="Bottom Image"
              />
            </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <h3 className="text-lg font-telegraf font-semibold mb-4">Current Content</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[#888d95] text-sm">Section Number</p>
                  <p className="text-white">{content.section_number}</p>
                </div>
                <div>
                  <p className="text-[#888d95] text-sm">Section Title</p>
                  <p className="text-white">{content.section_title}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#888d95] text-sm">Main Heading</p>
                  <p className="text-white text-lg">{content.main_heading}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#888d95] text-sm">Description</p>
                  <p className="text-white">{content.description}</p>
                </div>
                <div>
                  <p className="text-[#888d95] text-sm">Copyright</p>
                  <p className="text-white">{content.copyright}</p>
                </div>
                <div>
                  <p className="text-[#888d95] text-sm">Background Logo</p>
                  <p className="text-white">{content.background_logo}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className="mt-12">
          <h3 className="text-lg font-telegraf font-semibold mb-4">Preview</h3>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-6">
              This is how the sales section will appear on the homepage:
            </p>
            <div className="bg-[#0d0d0d] rounded-lg p-8 relative overflow-hidden">
              {/* Header Preview */}
              <div className="flex items-start gap-2.5 text-white mb-8">
                <span className="text-[16px] font-telegraf">{content.section_number}</span>
                <h2 className="text-[40px] font-telegraf font-extrabold uppercase leading-tight">
                  {content.main_heading}
                </h2>
              </div>
              
              {/* Content Preview */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-white opacity-40 text-sm">
                  {content.copyright}
                </div>
                <div className="font-telegraf font-bold text-white text-[20px] text-right uppercase max-w-[400px]">
                  {content.description}
                </div>
              </div>
              
              {/* Background Logo Preview */}
              {content.background_logo && (
                <div className="absolute bottom-4 right-4 opacity-10">
                  <img src={content.background_logo} alt="Background Logo" className="w-16 h-16" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
