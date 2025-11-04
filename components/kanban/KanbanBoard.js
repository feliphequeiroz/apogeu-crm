'use client'

import { useState } from 'react'
import LeadCard from './LeadCard'
import LeadModal from '@/components/leads/LeadModal'
import EditLeadModal from '@/components/leads/EditLeadModal'
import { pipelineColors } from '@/lib/pipeline/constants'

export default function KanbanBoard({
  leads,
  pipelineStages,
  searchTerm,
  selectedLead,
  setSelectedLead,
  onChangeStatus,
  onLeadUpdated,
  onLeadDeleted,
  leadsLoading,
}) {
  const [draggedCard, setDraggedCard] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const stages = pipelineStages.map(stage => {
    const color = pipelineColors[stage.color] || pipelineColors.blue;
    return {
      key: stage.key || stage.name,
      title: `${stage.icon} ${stage.name}`,
      color: color.bg,
      borderColor: color.border,
    }
  });

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
    setSelectedLead(lead)
    setShowViewModal(true)
  }

  const handleEditLead = (lead) => {
    setSelectedLead(lead)
    setShowViewModal(false)
    setShowEditModal(true)
  }

  const handleCloseViewModal = () => {
    setShowViewModal(false)
    setSelectedLead(null)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedLead(null)
  }

  const filteredLeads = (stageKey) => {
    const stageLeads = leads[stageKey] || []
    const term = (searchTerm || '').toLowerCase()

    return stageLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term)
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
                        onView={handleViewLead}
                        onEdit={handleEditLead}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showViewModal && selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={handleCloseViewModal}
          onEdit={() => handleEditLead(selectedLead)}
        />
      )}

      {showEditModal && selectedLead && (
        <EditLeadModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          lead={selectedLead}
          onLeadUpdated={onLeadUpdated}
          onLeadDeleted={onLeadDeleted}
        />
      )}
    </>
  )
}