'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { Loader, Menu, X, Plus, Search, Filter } from 'lucide-react'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import Sidebar from '@/components/kanban/Sidebar'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, mounted, router])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-text-secondary text-sm">Gerencie seu funil de vendas</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 font-semibold">TOTAL LEADS</p>
              <p className="text-2xl font-bold text-primary mt-1">12</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 font-semibold">PIPELINE</p>
              <p className="text-2xl font-bold text-green-600 mt-1">R$ 58.3k</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 font-semibold">FECHADOS</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">2</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 font-semibold">CONVERSÃO</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">17%</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold text-sm whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover flex items-center gap-2 font-semibold text-sm whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard searchTerm={searchTerm} />
        </div>
      </div>
    </main>
  )
}
