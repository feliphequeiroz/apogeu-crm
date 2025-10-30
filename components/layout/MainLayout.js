'use client'

import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'

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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
      <main
        className={`transition-[margin-left] duration-300 will-change-auto ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
        role="main"
      >
        {children}
      </main>
    </div>
  )
}