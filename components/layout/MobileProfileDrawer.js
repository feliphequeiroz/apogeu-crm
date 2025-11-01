'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { useTheme } from 'next-themes'
import { LogOut, Sun, Moon } from 'lucide-react'

/**
 * SignOutModal
 * Modal de confirmação de logout
 */
const SignOutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center flex-shrink-0">
            <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar saída</h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Você tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
        </p>

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

/**
 * MobileProfileDrawer
 * 
 * Drawer que abre ao clicar no ícone de perfil
 * Com modal de confirmação de logout e toggle de tema
 * 
 * IMPORTANTE: Não fecha o drawer ao abrir o modal!
 */
export default function MobileProfileDrawer({
  isOpen,
  onClose,
  user,
}) {
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOutClick = () => {
    // Abre o modal SEM fechar o drawer
    setShowSignOutModal(true)
  }

  const handleConfirmSignOut = async () => {
    setShowSignOutModal(false)
    onClose() // Fecha drawer
    await signOut() // Depois faz logout
  }

  const handleCancelSignOut = () => {
    setShowSignOutModal(false)
    // Drawer permanece aberto
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay do Drawer */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl z-50 p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
              </div>
              
              {/* Mini Switch */}
              <div className={`w-9 h-5 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 m-0.5 ${
                  theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
          >
            👤 Editar Perfil
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
          >
            ⚙️ Preferências
          </button>
          
          <button
            onClick={handleSignOutClick}
            className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* SignOut Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    </>
  )
}