'use client'

import { useState, useRef, useEffect } from 'react'

export default function LeadCardMobile({
  lead,
  stageKey,
  onView,
  onStatusChange,
  onEdit,
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const menuRef = useRef(null)

  const statusOptions = [
    { key: 'lead', label: '🔥 Lead', fullName: 'Lead Gerado' },
    { key: 'qualified', label: '✓ Qual.', fullName: 'Qualificado' },
    { key: 'diagnostic', label: '🔍 Diag.', fullName: 'Diagnóstico' },
    { key: 'proposal', label: '📋 Prop.', fullName: 'Proposta' },
    { key: 'negotiation', label: '💬 Neg.', fullName: 'Negociação' },
    { key: 'closed', label: '🤝 Fecha.', fullName: 'Fechado' },
  ]

  useEffect(() => {
    if (!showStatusMenu) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowStatusMenu(false)
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowStatusMenu(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [showStatusMenu])

  const handleStatusSelect = (newStatus) => {
    if (newStatus !== stageKey) {
      onStatusChange(newStatus)
    }
    setShowStatusMenu(false)
  }

  const handleCardClick = (e) => {
    // Evita abrir se clicou em botões
    if (e.target.closest('button')) return
    onView(lead)
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm active:shadow-md transition cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {lead.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {lead.company}
          </p>
        </div>
      </div>

      {/* Value */}
      <div className="mb-3 px-3 py-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          R$ {(lead.value / 1000).toFixed(1)}k
        </p>
      </div>

      {/* Next Task */}
      {lead.nextTask && (
        <div className="mb-3 px-3 py-2 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-300 line-clamp-2">
            {lead.nextTask}
          </p>
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center justify-between gap-2 mb-3 text-xs">
        <span className="text-gray-500 dark:text-gray-400">~{lead.days}d</span>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium">
          {stageKey}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(lead)
          }}
          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium active:bg-gray-200 dark:active:bg-gray-600 transition"
        >
          ✏️ Editar
        </button>

        <div className="relative flex-1" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowStatusMenu(!showStatusMenu)
            }}
            className="w-full px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium active:bg-blue-200 dark:active:bg-blue-800 transition"
          >
            📍 Mover
          </button>

          {showStatusMenu && (
            <div className="fixed inset-0 z-[60] flex items-end">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowStatusMenu(false)
                }}
              />

              {/* Bottom Sheet */}
              <div className="relative w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 shadow-2xl">
                <div className="mb-4 text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Mover para...
                  </p>
                </div>

                {/* Grid 3x2 - Sem scroll */}
                <div className="grid grid-cols-3 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusSelect(option.key)
                      }}
                      className={`p-3 rounded-lg text-center transition ${
                        option.key === stageKey
                          ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 text-blue-700 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">{option.label.split(' ')[0]}</div>
                      <div className="text-xs font-medium">{option.label.split(' ')[1]}</div>
                    </button>
                  ))}
                </div>

                {/* Close hint */}
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
                  Toque fora para fechar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}