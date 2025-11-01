'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { LogOut } from 'lucide-react'

/**
 * SignOutModal (reutilizado do desktop)
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
 * MobileSidebar
 * 
 * Menu lateral mobile com configurações
 * Usa o mesmo padrão de logout do desktop
 */
export default function MobileSidebar({
  isOpen,
  onClose,
  user,
}) {
  const { signOut } = useAuth()
  const [expandedSection, setExpandedSection] = useState(null)
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  const menuItems = [
    {
      section: 'Configurações',
      items: [
        { label: 'Perfil', icon: '👤', action: 'profile' },
        { label: 'Equipe', icon: '👥', action: 'team' },
        { label: 'Integrações', icon: '⚙️', action: 'integrations' },
        { label: 'Sair', icon: '🚪', action: 'logout' },
      ],
    },
  ]

  const handleAction = (action) => {
    if (action === 'logout') {
      setShowSignOutModal(true)
      return
    }

    // Outras ações (placeholder)
    console.log('Action:', action)
    onClose()
  }

  const handleConfirmSignOut = async () => {
    setShowSignOutModal(false)
    await signOut()
  }

  const handleCancelSignOut = () => {
    setShowSignOutModal(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-40 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            aria-label="Fechar menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === idx ? null : idx)
                }
                className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {group.section}
                </h3>
                <svg
                  className={`w-4 h-4 transition ${
                    expandedSection === idx ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {expandedSection === idx && (
                <div className="mt-2 space-y-1 pl-2">
                  {group.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => handleAction(item.action)}
                      className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg transition text-sm ${
                        item.action === 'logout'
                          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
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