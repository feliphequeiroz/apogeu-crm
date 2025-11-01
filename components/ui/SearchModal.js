'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronLeft } from 'lucide-react'

/**
 * SearchModal - Apple UI Human Interface
 * 
 * Princípios:
 * 1. Clareza - Informação clara, sem poluição
 * 2. Minimalismo - Apenas o essencial
 * 3. Profundidade - Hierarquia visual clara
 * 4. Feedback - Resposta visual imediata ao interagir
 * 5. Espaçamento - Whitespace generoso (Apple style)
 * 
 * PROPS:
 * - isOpen: visibilidade do modal
 * - onClose: callback ao fechar
 * - leads: todos os leads (objeto por estágio)
 * - onSelectLead: callback ao selecionar + qual estágio
 */
export default function SearchModal({
  isOpen,
  onClose,
  leads,
  onSelectLead,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef(null)

  // Auto-focus ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setSearchTerm('')
    }
  }, [isOpen])

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Filtra TODOS os leads de todas as etapas
  const allLeads = Object.entries(leads).flatMap(([stage, stageLeads]) =>
    stageLeads.map((lead) => ({ ...lead, stage }))
  )

  const filteredLeads = searchTerm.trim()
    ? allLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  // Mapa de estágios com emoji
  const stageMap = {
    lead: { emoji: '🔥', name: 'Lead' },
    qualified: { emoji: '✓', name: 'Qualificado' },
    diagnostic: { emoji: '🔍', name: 'Diagnóstico' },
    proposal: { emoji: '📋', name: 'Proposta' },
    negotiation: { emoji: '💬', name: 'Negociação' },
    closed: { emoji: '🤝', name: 'Fechado' },
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col">
      {/* Header - Clean, Apple style */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition -ml-2 px-2 py-2"
          title="Voltar"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          Buscar em todos
        </span>

        <div className="w-10" />
      </div>

      {/* Search Input - Minimalista */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Nome, empresa, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition text-base border-0"
            aria-label="Buscar leads"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1"
              title="Limpar"
              aria-label="Limpar busca"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results - Whitespace generoso, hierarquia clara */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredLeads.length === 0 ? (
          <div className="flex items-center justify-center h-full px-6">
            <div className="text-center">
              {searchTerm ? (
                <>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    Nenhum resultado
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tente outro termo de busca
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    Digite para buscar
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Busca em todos os leads
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredLeads.map((lead) => {
              const stage = stageMap[lead.stage]
              return (
                <button
                  key={`${lead.id}-${lead.stage}`}
                  onClick={() => {
                    onSelectLead(lead, lead.stage)
                    onClose()
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Lead Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {lead.name}
                        </p>
                        {/* Stage Badge - Pequeno, discreto */}
                        <span
                          className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                          title={stage.name}
                        >
                          {stage.emoji}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
                        {lead.company}
                      </p>

                      {/* Secondary info */}
                      <div className="flex flex-col gap-1 text-xs text-gray-400 dark:text-gray-500">
                        {lead.phone && (
                          <p className="truncate">{lead.phone}</p>
                        )}
                        {lead.email && (
                          <p className="truncate">{lead.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Value - Direita, destaque suave */}
                    {lead.value > 0 && (
                      <div className="flex-shrink-0 text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                          }).format(lead.value)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Estimado
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}