'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { X, Menu, ChevronDown, LogOut } from 'lucide-react'
import ThemeSettings from '@/components/ThemeSettings'

const SidebarHeader = ({ sidebarOpen, setSidebarOpen }) => (
  <div className="p-4 flex items-center justify-between border-b border-gray-800 dark:border-gray-900 min-h-16">
    <span className={`font-bold text-lg transition-all duration-300 overflow-hidden whitespace-nowrap ${
      sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
    }`}>
      Apogeu CRM
    </span>
    
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label={sidebarOpen ? 'Fechar sidebar' : 'Abrir sidebar'}
      className={`p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition focus:outline-none flex-shrink-0 ${
        sidebarOpen ? '' : 'mx-auto'
      }`}
    >
      {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  </div>
)

const SidebarNav = ({ sidebarOpen }) => (
  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
    <a
      href="#"
      aria-label="Dashboard"
      className="px-4 py-2 rounded-lg bg-blue-600 flex items-center gap-3 text-sm font-semibold focus:outline-none"
    >
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">📊</div>
      <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
        sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
      }`}>
        Dashboard
      </span>
    </a>
    <a
      href="#"
      aria-label="Leads"
      className="px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center gap-3 text-sm cursor-pointer transition focus:outline-none"
    >
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">👥</div>
      <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
        sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
      }`}>
        Leads
      </span>
    </a>
    <a
      href="#"
      aria-label="Relatórios"
      className="px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center gap-3 text-sm cursor-pointer transition focus:outline-none"
    >
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">📈</div>
      <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
        sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
      }`}>
        Relatórios
      </span>
    </a>
  </nav>
)

const SidebarArchived = ({ sidebarOpen }) => {
  const [showArchived, setShowArchived] = useState(false)

  return (
    <div className="p-4 border-t border-gray-800 dark:border-gray-900">
      <button
        onClick={() => setShowArchived(!showArchived)}
        aria-label={showArchived ? 'Esconder arquivados' : 'Mostrar arquivados'}
        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center gap-3 text-sm transition focus:outline-none"
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">📦</div>
        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
        }`}>
          Arquivado
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition ml-auto ${
            sidebarOpen ? (showArchived ? 'rotate-180' : '') : ''
          } ${!sidebarOpen ? 'hidden' : ''}`}
        />
      </button>
    </div>
  )
}

const ThemeSettingsWrapper = ({ sidebarOpen, onSignOut, userName }) => {
  const userInitial = userName?.charAt(0).toUpperCase() || '?'

  return (
    <div className="space-y-2 p-4 border-t border-gray-800 dark:border-gray-900">
      <ThemeSettings sidebarOpen={sidebarOpen} />
      
      <button
        aria-label="Configurações"
        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center gap-3 text-sm transition focus:outline-none"
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">⚙️</div>
        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
        }`}>
          Configurações
        </span>
      </button>

      <button
        aria-label={`Perfil: ${userName}`}
        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center gap-3 text-sm transition focus:outline-none"
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 bg-blue-600 text-white rounded-full text-xs font-bold">
          {userInitial}
        </div>
        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
        }`}>
          {userName}
        </span>
      </button>

      <button
        onClick={onSignOut}
        aria-label="Sair"
        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center gap-3 text-sm transition focus:outline-none text-red-400 hover:text-red-300"
      >
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">🚪</div>
        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
        }`}>
          Sair
        </span>
      </button>
    </div>
  )
}

const SignOutModal = ({ isOpen, onConfirm, onCancel }) => {
  // 📋 PADRÃO DE MODAL - Use este template para todos os modais de confirmação
  // Regra: Sempre use ícones da lucide-react (não emojis)
  // - Ícone destacado: color + rounded-full container (w-10 h-10)
  // - Cor do ícone: alinhada ao propósito (red para destrutivas, blue para ações, etc)
  // - Layout: ícone + título | descrição | botões em full-width (Cancelar | Ação Principal)
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-4">
        {/* Cabeçalho: ícone destacado + título */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center flex-shrink-0">
            <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar saída</h2>
        </div>

        {/* Descrição/conteúdo */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Você tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
        </p>

        {/* Rodapé: botões full-width (Cancelar | Ação com ícone) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-sm transition focus:outline-none"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition focus:outline-none flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, user }) {
  const { signOut } = useAuth()
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  const handleSignOutClick = () => {
    setShowSignOutModal(true)
  }

  const handleConfirmSignOut = async () => {
    setShowSignOutModal(false)
    await signOut()
  }

  const handleCancelSignOut = () => {
    setShowSignOutModal(false)
  }

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen bg-gray-900 dark:bg-gray-950 text-white flex flex-col z-50 transition-[width] duration-300 shadow-lg will-change-auto border-r border-gray-800 dark:border-gray-900 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <SidebarNav sidebarOpen={sidebarOpen} />
        <SidebarArchived sidebarOpen={sidebarOpen} />
        <ThemeSettingsWrapper sidebarOpen={sidebarOpen} onSignOut={handleSignOutClick} userName={user?.email || user?.name} />
      </div>

      <SignOutModal
        isOpen={showSignOutModal}
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    </>
  )
}