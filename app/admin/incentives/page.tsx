'use client'

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import IncentivesSection from '@/components/IncentivesSection'

export const dynamic = 'force-dynamic'

export default function AdminIncentivesPage() {
  return (
    <AdminLayout pageKey="incentives">
      <div className="bg-[#0d0d0d] min-h-screen">
        {/* Reuse the same CMS-driven section as the public Incentives page, but force detailed cards and wire View to admin details */}
        <IncentivesSection 
          pageReady={false} 
          cardVariant="detailed" 
          detailBasePath="/admin/incentives"
        />
      </div>
    </AdminLayout>
  )
}
