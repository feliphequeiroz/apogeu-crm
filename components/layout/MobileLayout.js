'use client'

import { useState } from 'react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import BottomNavigation from './BottomNavigation'
import MobileSidebar from './MobileSidebar'
import MobileProfileDrawer from './MobileProfileDrawer'

/**
 * MobileLayout v5 - Atualizado
 * 
 * HIERARQUIA:
 * 1. Header (sticky top-0, flex-shrink-0)
 * 2. Main (flex-1, overflow-hidden, min-h-0) ← Permite scroll do filho
 * 3. BottomNavigation (sticky bottom-0, flex-shrink-0)
 * 
 * PROPS:
 * - user: dados do usuário
 * - activeTab: aba ativa (gerenciada em DashboardContent)
 * - setActiveTab: callback para mudar aba
 * - onSearchClick: callback para abrir SearchModal
 * - onMoreClick: callback para abrir MoreModal
 * - onTasksClick: callback para abrir TasksModal
 * - children: conteúdo renderizado
 * 
 * RESPONSABILIDADES:
 * 1. Renderizar apenas em mobile (< 768px)
 * 2. Receber e passar props para BottomNavigation
 * 3. Estruturar layout mobile com header + content + nav
 * 4. Gerenciar sidebars e drawers
 */
export default function MobileLayout({
  user,
  activeTab,
  setActiveTab,
  onSearchClick,
  onMoreClick,
  onTasksClick,
  onOpenPipelineCustomizer,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col">
      {/* Header - Sticky, não encolhe */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          aria-label="Menu"
          title="Abrir menu"
        >
          {sidebarOpen ? (
            <PanelRightOpen className="w-6 h-6" />
          ) : (
            <PanelRightClose className="w-6 h-6" />
          )}
        </button>

        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Apogeu CRM</h1>

        <button 
          onClick={() => setProfileOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition" 
          aria-label="Perfil"
          title="Abrir perfil"
        >
          <svg 
            className="w-6 h-6" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </button>
      </header>

      {/* Content Area - Flex-1, overflow controlado, min-h-0 para forçar scroll */}
      <main className="flex-1 overflow-hidden min-h-0">
        {children}
      </main>

      {/* Bottom Navigation - Sticky, não encolhe */}
      <BottomNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchClick={onSearchClick}
        onMoreClick={onMoreClick}
        onTasksClick={onTasksClick}
        onOpenPipelineCustomizer={onOpenPipelineCustomizer}
      />

      {/* Mobile Sidebar - Drawer lateral */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Profile Drawer - Drawer de perfil */}
      <MobileProfileDrawer
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />
    </div>
  )
}