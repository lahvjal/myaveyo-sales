'use client'

import React, { useState, useEffect } from 'react'
import { Incentive, CreateIncentiveData, UpdateIncentiveData } from '@/lib/types/incentive'
import IncentiveForm from '@/components/admin/IncentiveForm'
import Button from '@/components/Button'

export default function AdminIncentivesPage() {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncentive, setEditingIncentive] = useState<Incentive | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Fetch all incentives (including unpublished for admin view)
  const fetchIncentives = async () => {
    try {
      const response = await fetch('/api/incentives/admin')
      if (response.ok) {
        const data = await response.json()
        setIncentives(data)
      }
    } catch (error) {
      console.error('Error fetching incentives:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncentives()
  }, [])

  const handleCreate = async (data: CreateIncentiveData) => {
    setFormLoading(true)
    try {
      const response = await fetch('/api/incentives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchIncentives()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating incentive:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: UpdateIncentiveData) => {
    setFormLoading(true)
    try {
      const response = await fetch(`/api/incentives/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchIncentives()
        setEditingIncentive(null)
      }
    } catch (error) {
      console.error('Error updating incentive:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this incentive?')) return

    try {
      const response = await fetch(`/api/incentives/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchIncentives()
      }
    } catch (error) {
      console.error('Error deleting incentive:', error)
    }
  }

  const handleEdit = (incentive: Incentive) => {
    setEditingIncentive(incentive)
    setShowForm(false)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingIncentive(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-4xl font-telegraf font-bold">
              Incentives CMS
            </h1>
            <p className="text-gray-400 mt-2">
              Manage incentives displayed on the public sales page
            </p>
          </div>
          
          {!showForm && !editingIncentive && (
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              Add New Incentive
            </Button>
          )}
        </div>

        {/* Form */}
        {(showForm || editingIncentive) && (
          <div className="mb-12">
            <IncentiveForm
              incentive={editingIncentive || undefined}
              onSubmit={editingIncentive ? handleUpdate : handleCreate}
              onCancel={handleCancel}
              isLoading={formLoading}
            />
          </div>
        )}

        {/* Incentives Grid */}
        {!showForm && !editingIncentive && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incentives.map((incentive) => (
              <div
                key={incentive.id}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#333]"
              >
                {/* Image */}
                <div className="h-48 relative">
                  <img
                    src={incentive.background_image_url}
                    alt={incentive.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Status badges */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      incentive.live_status === 'live' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {incentive.live_status}
                    </div>
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-semibold text-black"
                      style={{ backgroundColor: incentive.category_color }}
                    >
                      {incentive.category}
                    </div>
                  </div>

                  {!incentive.is_published && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      UNPUBLISHED
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-white text-xl font-telegraf font-bold mb-2">
                    {incentive.title}
                  </h3>
                  {incentive.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {incentive.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Order: {incentive.sort_order}</span>
                    <span>
                      {new Date(incentive.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(incentive)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(incentive.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {incentives.length === 0 && !showForm && !editingIncentive && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              No incentives found
            </div>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              Create Your First Incentive
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
