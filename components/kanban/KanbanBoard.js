'use client'

import { useState } from 'react'
import LeadCard from './LeadCard'
import LeadModal from './LeadModal'
import EditLeadModal from '@/components/leads/EditLeadModal'

export default function KanbanBoard({
  leads,
  searchTerm,
  selectedLead,
  setSelectedLead,
  showDetailModal,
  setShowDetailModal,
  showEditModal,
  setShowEditModal,
  onChangeStatus,
  onLeadUpdated,
  onLeadDeleted,
  leadsLoading,
}) {
  const [draggedCard, setDraggedCard] = useState(null)

  const stages = [
    { key: 'lead', title: '📥 Lead Gerado', color: 'bg-blue-50', borderColor: 'border-blue-300' },
    { key: 'qualified', title: '✓ Qualificado', color: 'bg-cyan-50', borderColor: 'border-cyan-300' },
    { key: 'diagnostic', title: '🔍 Diagnóstico', color: 'bg-purple-50', borderColor: 'border-purple-300' },
    { key: 'proposal', title: '📋 Proposta', color: 'bg-orange-50', borderColor: 'border-orange-300' },
    { key: 'negotiation', title: '💬 Negociação', color: 'bg-yellow-50', borderColor: 'border-yellow-300' },
    { key: 'closed', title: '🤝 Fechado', color: 'bg-green-50', borderColor: 'border-green-300' },
  ]

  const handleDragStart = (e, card, fromStage) => {
    setDraggedCard({ card, fromStage })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, toStage) => {
    e.preventDefault()
    if (!draggedCard) return

    const { card, fromStage } = draggedCard

    if (fromStage !== toStage) {
      await onChangeStatus(card.id, fromStage, toStage)
    }

    setDraggedCard(null)
  }

  // Filtrar leads baseado no searchTerm
  const filteredLeads = (stageKey) => {
    return leads[stageKey].filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (leadsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">Carregando leads...</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto p-6 h-full">
        <div className="flex gap-6 min-w-max">
          {stages.map(({ key, title, color, borderColor }) => {
            const filtered = filteredLeads(key)
            
            // LÓGICA CORRIGIDA: mostrar coluna se:
            // 1. Não há busca ativa (searchTerm vazio) OU
            // 2. Há resultados nesta coluna
            const shouldShow = !searchTerm || filtered.length > 0

            if (!shouldShow) return null

            return (
              <div
                key={key}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, key)}
                className={`${color} rounded-lg border-2 ${borderColor} p-4 w-80 flex flex-col flex-shrink-0 min-h-96`}
              >
                <div className="mb-4 pb-4 border-b border-gray-300">
                  <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
                  <p className="text-xs text-gray-600 mt-1">
                    {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}
                  </p>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-xs">Vazio</p>
                    </div>
                  ) : (
                    filtered.map((card) => (
                      <LeadCard
                        key={card.id}
                        card={card}
                        stageKey={key}
                        onDragStart={handleDragStart}
                        onStatusChange={(newStage) => onChangeStatus(card.id, key, newStage)}
                        onClick={() => {
                          setSelectedLead(card)
                          setShowDetailModal(true)
                        }}
                        onEdit={() => {
                          setSelectedLead(card)
                          setShowEditModal(true)
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetailModal && selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedLead(null)
          }}
          onEdit={() => {
            setShowDetailModal(false)
            setShowEditModal(true)
          }}
        />
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedLead && (
        <EditLeadModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedLead(null)
          }}
          lead={selectedLead}
          onLeadUpdated={onLeadUpdated}
          onLeadDeleted={onLeadDeleted}
        />
      )}
    </>
  )
}