'use client'

import { useState } from 'react'
import LeadCard from './LeadCard'
import LeadModal from './LeadModal'
import EditLeadModal from '@/components/leads/EditLeadModal'
import ViewLeadModal from '@/components/leads/ViewLeadModal'

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
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingLead, setViewingLead] = useState(null)

  const stages = [
    { key: 'lead', title: '📥 Lead Gerado', color: 'bg-blue-50 dark:bg-blue-950', borderColor: 'border-blue-300 dark:border-blue-800' },
    { key: 'qualified', title: '✓ Qualificado', color: 'bg-cyan-50 dark:bg-cyan-950', borderColor: 'border-cyan-300 dark:border-cyan-800' },
    { key: 'diagnostic', title: '🔍 Diagnóstico', color: 'bg-purple-50 dark:bg-purple-950', borderColor: 'border-purple-300 dark:border-purple-800' },
    { key: 'proposal', title: '📋 Proposta', color: 'bg-orange-50 dark:bg-orange-950', borderColor: 'border-orange-300 dark:border-orange-800' },
    { key: 'negotiation', title: '💬 Negociação', color: 'bg-yellow-50 dark:bg-yellow-950', borderColor: 'border-yellow-300 dark:border-yellow-800' },
    { key: 'closed', title: '🤝 Fechado', color: 'bg-green-50 dark:bg-green-950', borderColor: 'border-green-300 dark:border-green-800' },
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

  const handleViewLead = (lead) => {
    setViewingLead(lead)
    setShowViewModal(true)
  }

  const handleEditFromView = (lead) => {
    setSelectedLead(lead)
    setShowEditModal(true)
  }

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
        <p className="text-gray-600 dark:text-gray-400">Carregando leads...</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto p-6 h-full bg-white dark:bg-gray-950">
        <div className="flex gap-6 min-w-max">
          {stages.map(({ key, title, color, borderColor }) => {
            const filtered = filteredLeads(key)
            
            const shouldShow = !searchTerm || filtered.length > 0

            if (!shouldShow) return null

            return (
              <div
                key={key}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, key)}
                className={`${color} rounded-lg border-2 ${borderColor} p-4 w-80 flex flex-col flex-shrink-0 min-h-96`}
              >
                <div className="mb-4 pb-4 border-b border-gray-300 dark:border-gray-700">
                  <h2 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}
                  </p>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-600">
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
                        onView={() => handleViewLead(card)}
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

      <ViewLeadModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setViewingLead(null)
        }}
        lead={viewingLead}
        onEdit={handleEditFromView}
      />

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