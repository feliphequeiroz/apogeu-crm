'use client'

import { ChevronDown, Edit2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LeadCard({
  card,
  stageKey,
  onDragStart,
  onStatusChange,
  onView,
  onEdit,
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState('bottom')
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const cardRef = useRef(null)

  const statusOptions = [
    { key: 'lead', label: '📥 Lead Gerado' },
    { key: 'qualified', label: '✓ Qualificado' },
    { key: 'diagnostic', label: '🔍 Diagnóstico' },
    { key: 'proposal', label: '📋 Proposta' },
    { key: 'negotiation', label: '💬 Negociação' },
    { key: 'closed', label: '🤝 Fechado' },
  ]

  useEffect(() => {
    if (!showStatusMenu) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowStatusMenu(false)
      }
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

  useEffect(() => {
    if (!showStatusMenu || !buttonRef.current) {
      setMenuPosition('bottom')
      return
    }

    const timer = setTimeout(() => {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const cardElement = buttonRef.current.closest('[draggable="true"]')
      const columnContainer = cardElement?.closest('[class*="flex-col"]')
      
      if (!columnContainer) {
        setMenuPosition('bottom')
        return
      }

      const allCards = columnContainer.querySelectorAll('[draggable="true"]')
      const cardIndex = Array.from(allCards).indexOf(cardElement)
      const isLastCard = cardIndex === allCards.length - 1
      
      const menuHeight = 220
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top

      if (allCards.length === 1 || cardIndex === 0) {
        setMenuPosition('bottom')
      } else if (isLastCard) {
        if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
          setMenuPosition('top')
        } else {
          setMenuPosition('bottom')
        }
      } else {
        setMenuPosition('bottom')
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [showStatusMenu])

  const handleStatusSelect = (newStatus) => {
    onStatusChange(newStatus)
    setShowStatusMenu(false)
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('[class*="chevron"]')) {
      return
    }
    onView()
  }

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={(e) => onDragStart(e, card, stageKey)}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {card.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{card.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{card.company}</p>
        </div>
      </div>

      <div className="mb-3 px-2 py-1 bg-blue-50 dark:bg-blue-900 rounded">
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          R$ {(card.value / 1000).toFixed(1)}k
        </p>
      </div>

      {card.nextTask && (
        <div className="mb-3 px-2 py-1 bg-yellow-50 dark:bg-yellow-900 rounded">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">{card.nextTask}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">~{card.days}d</span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
            {stageKey}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Editar"
        >
          <Edit2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="relative mt-3 pt-3 border-t border-gray-200 dark:border-gray-700" ref={menuRef}>
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
          <div
            className={`absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${
              menuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            {statusOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleStatusSelect(option.key)}
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
        )}
      </div>
    </div>
  )
}