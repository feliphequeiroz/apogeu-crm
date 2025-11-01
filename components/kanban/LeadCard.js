'use client'

import { ChevronDown, Edit2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

/**
 * LeadCard.js - Fixed Position Smart Menu
 * 
 * Menu usa position: fixed para escapar do overflow-y-auto da coluna
 * Detecta espaço e abre para cima ou baixo conforme necessário
 */
export default function LeadCard({
  card,
  stageKey,
  onDragStart,
  onStatusChange,
  onView,
  onEdit,
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, direction: 'down' })
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const statusOptions = [
    { key: 'lead', label: '📥 Lead Gerado' },
    { key: 'qualified', label: '✓ Qualificado' },
    { key: 'diagnostic', label: '🔍 Diagnóstico' },
    { key: 'proposal', label: '📋 Proposta' },
    { key: 'negotiation', label: '💬 Negociação' },
    { key: 'closed', label: '🤝 Fechado' },
  ]

  // Calcula posição fixa do menu baseado na viewport
  const calculateFixedPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, direction: 'down' }

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const menuHeight = 220
    const threshold = 300
    const bottomSpace = window.innerHeight - buttonRect.bottom

    const isTopDirection = bottomSpace < threshold

    return {
      top: isTopDirection 
        ? buttonRect.top - menuHeight - 8 
        : buttonRect.bottom + 8,
      left: buttonRect.left,
      direction: isTopDirection ? 'up' : 'down',
    }
  }

  useEffect(() => {
    if (!showStatusMenu) return

    const position = calculateFixedPosition()
    setMenuPosition(position)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowStatusMenu(false)
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowStatusMenu(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStatusMenu])

  const handleStatusSelect = (newStatus) => {
    onStatusChange(newStatus)
    setShowStatusMenu(false)
  }

  return (
    <div
      ref={menuRef}
      draggable
      onDragStart={(e) => onDragStart(e, card, stageKey)}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition group"
    >
      {/* Header - Click abre VISUALIZAÇÃO */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          onView(card)
        }}
        className="flex items-start gap-3 mb-3 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {card.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{card.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{card.company}</p>
        </div>
      </div>

      {/* Value */}
      <div className="mb-3 px-2 py-1 bg-blue-50 dark:bg-blue-900 rounded">
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          R$ {(card.value / 1000).toFixed(1)}k
        </p>
      </div>

      {/* Next Task */}
      {card.nextTask && (
        <div className="mb-3 px-2 py-1 bg-yellow-50 dark:bg-yellow-900 rounded">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">{card.nextTask}</p>
        </div>
      )}

      {/* Footer - Estágio e editar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">~{card.days}d</span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
            {stageKey}
          </span>
        </div>
        {/* Ícone de edição - Abre EDIÇÃO direto */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(card)
          }}
          className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Editar"
        >
          <Edit2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Status Change Button */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation()
            setShowStatusMenu(!showStatusMenu)
          }}
          className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition"
        >
          <span>Mudar estágio</span>
          <ChevronDown className={`w-3 h-3 transition ${showStatusMenu ? 'rotate-180' : ''}`} />
        </button>

        {showStatusMenu && (
          <>
            {/* Overlay - Fecha menu */}
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation()
                setShowStatusMenu(false)
              }}
              aria-hidden="true"
            />

            {/* Menu Fixed - Escapa do overflow da coluna */}
            <div
              className={`fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 w-48 ${
                menuPosition.direction === 'up'
                  ? 'animate-in fade-in slide-in-from-bottom-2 duration-200'
                  : 'animate-in fade-in slide-in-from-top-2 duration-200'
              }`}
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              {statusOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusSelect(option.key)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition ${
                    option.key === stageKey
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}