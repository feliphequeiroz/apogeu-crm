'use client'

import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { getPipelineStages, createPipelineStage } from '@/lib/pipeline/actions'
import { defaultPipelineStages } from '@/lib/pipeline/constants'

export default function MainLayout({ children, user }) {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    setMounted(true)
    const savedSidebarState = localStorage.getItem('sidebarOpen')
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
    }
  }, [sidebarOpen, mounted])

  useEffect(() => {
    if (user) {
      const setupDefaultStages = async () => {
        const { data: stages } = await getPipelineStages(user.id)
        if (stages && stages.length === 0) {
          for (const stage of defaultPipelineStages) {
            await createPipelineStage({ ...stage, user_id: user.id })
          }
        }
      }
      setupDefaultStages()
    }
  }, [user])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
      <main
        className={`transition-[margin-left] duration-300 will-change-auto ${sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        role="main"
      >
        {children}
      </main>
    </div>
  )
}