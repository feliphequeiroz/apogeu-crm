'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { X, Menu, ChevronDown } from 'lucide-react'
import ThemeSettings from '@/components/ThemeSettings'

export default function Sidebar({ sidebarOpen, setSidebarOpen, user }) {
  const [showArchived, setShowArchived] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <>
      {/* Sidebar Fixo */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gray-900 dark:bg-gray-950 text-white border-r border-gray-800 dark:border-gray-900 flex flex-col z-50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        style={{ transition: 'width 0.3s ease' }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800 dark:border-gray-900">
          {sidebarOpen && <span className="font-bold text-lg">Apogeu CRM</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 dark:hover:bg-gray-800 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-4 py-2 rounded-lg bg-blue-600 flex items-center gap-3 text-sm font-semibold">
            <span>📊</span>
            {sidebarOpen && 'Dashboard'}
          </div>
          <div className="px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 flex items-center gap-3 text-sm cursor-pointer transition">
            <span>👥</span>
            {sidebarOpen && 'Leads'}
          </div>
          <div className="px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 flex items-center gap-3 text-sm cursor-pointer transition">
            <span>📈</span>
            {sidebarOpen && 'Relatórios'}
          </div>
        </nav>

        {/* Archived Section */}
        <div className="p-4 border-t border-gray-800 dark:border-gray-900">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="w-full px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 flex items-center gap-3 text-sm transition"
          >
            <span>📦</span>
            {sidebarOpen && (
              <>
                <span>Arquivado</span>
                <ChevronDown
                  className={`w-4 h-4 ml-auto transition ${showArchived ? 'rotate-180' : ''}`}
                />
              </>
            )}
          </button>
        </div>

        {/* Theme Settings */}
        <div className={`px-2 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ThemeSettings />
        </div>

        {/* User */}
        <div className="p-4 border-t border-gray-800 dark:border-gray-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="text-xs truncate">
                <p className="font-semibold truncate">{user?.email?.split('@')[0]}</p>
                <p className="text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 flex items-center gap-3 text-sm transition text-red-400 hover:text-red-300"
          >
            <span>🚪</span>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Spacer - empurra o conteúdo pra direita. Add matching bg to avoid 1px seam during transition in dark mode */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 dark:bg-gray-950 pointer-events-none`}
      />
    </>
  )
}