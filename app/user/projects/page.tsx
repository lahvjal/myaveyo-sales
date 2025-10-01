import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProjectsPageContent from '@/components/projects/ProjectsPageContent'

export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
  

  return (
    <AdminLayout pageKey="projects" className="">
        
        <div className="flex justify-center pt-10 md:pt-[100px]">
          
          <div className="w-[100%] px-6 md:max-w-[1480px]">
            <h1 className="text-6xl font-telegraf font-bold mb-4">
              My Projects
            </h1>
            <ProjectsPageContent />
          </div>
        </div>
    </AdminLayout>
  )
}
