import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProjectsPageContent from '@/components/projects/ProjectsPageContent'

export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
  

  return (
    <AdminLayout pageKey="projects" className="">
        <div className="flex justify-center pt-[100px]">
            <div className="w-[100%] max-w-[1480px]">
                <ProjectsPageContent />
            </div>
        </div>
    </AdminLayout>
  )
}
