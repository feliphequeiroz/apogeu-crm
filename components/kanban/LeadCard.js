'use client'

import { ChevronDown, Edit2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LeadCard({
  card,
  stageKey,
  onDragStart,
  onStatusChange,
  onClick,
  onEdit,
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState('bottom')
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

  const currentStatusLabel = statusOptions.find((s) => s.key === stageKey)?.label || stageKey

  // Fechar dropdown ao pressionar ESC ou clicar fora
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

    // Usar setTimeout pra garantir que o menu foi renderizado
    const timer = setTimeout(() => {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const cardElement = buttonRef.current.closest('[draggable="true"]')
      const columnContainer = cardElement?.closest('[class*="flex-col"]')
      
      if (!columnContainer) {
        setMenuPosition('bottom')
        return
      }

      // Encontrar todos os cards na coluna
      const allCards = columnContainer.querySelectorAll('[draggable="true"]')
      const cardIndex = Array.from(allCards).indexOf(cardElement)
      const isLastCard = cardIndex === allCards.length - 1
      
      const menuHeight = 220 // Altura aproximada do menu
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top

      // LÓGICA:
      // Se é o único card ou primeiro card → sempre para baixo
      // Se é o último card (segundo em diante) → verificar espaço
      if (allCards.length === 1 || cardIndex === 0) {
        setMenuPosition('bottom')
      } else if (isLastCard) {
        // Se é o último card: priorizar para cima se não houver espaço abaixo
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card, stageKey)}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition cursor-move group"
    >
      {/* Avatar + Nome */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {card.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{card.name}</p>
          <p className="text-xs text-gray-500 truncate">{card.company}</p>
        </div>
      </div>

      {/* Valor */}
      <div className="mb-3 px-2 py-1 bg-blue-50 rounded">
        <p className="text-sm font-bold text-blue-600">
          R$ {(card.value / 1000).toFixed(1)}k
        </p>
      </div>

      {/* Próxima Ação */}
      {card.nextTask && (
        <div className="mb-3 px-2 py-1 bg-yellow-50 rounded">
          <p className="text-xs text-yellow-800">{card.nextTask}</p>
        </div>
      )}

      {/* Dias + Status + Edit */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">~{card.days}d</span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {stageKey}
          </span>
        </div>
        <button
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 rounded"
          title="Editar"
        >
          <Edit2 className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      {/* Dropdown Status - Com Posicionamento Inteligente */}
      <div className="relative mt-3 pt-3 border-t border-gray-200" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded transition"
        >
          <span>Mudar estágio</span>
          <ChevronDown className={`w-3 h-3 transition ${showStatusMenu ? 'rotate-180' : ''}`} />
        </button>

        {showStatusMenu && (
          <div
            className={`absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
              menuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            {statusOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleStatusSelect(option.key)}
                className={`w-full text-left px-3 py-2 text-xs transition ${
                  option.key === stageKey
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
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