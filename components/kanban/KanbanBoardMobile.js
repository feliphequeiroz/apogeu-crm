'use client'

import { useState } from 'react'
import LeadCardMobile from './LeadCardMobile'
import EditLeadModal from '@/components/leads/EditLeadModal'
import LeadCounter from '@/components/ui/LeadCounter'

/**
 * KanbanBoardMobile
 * 
 * Kanban otimizado para mobile:
 * 1. Abas por estágio (horizontal scroll)
 * 2. Cards em lista (space-y-3)
 * 3. EditLeadModal com modo 'view' para visualização
 * 4. LeadCounter fixo acima BottomNavigation
 * 
 * NOTA: Search modal é renderizado globalmente em DashboardContent
 */
export default function KanbanBoardMobile({
  leads,
  pipelineStages,
  selectedLead,
  setSelectedLead,
  onChangeStatus,
  onLeadUpdated,
  onLeadDeleted,
  leadsLoading,
  searchOpen,
  setSearchOpen,
  searchTerm,
  setSearchTerm,
}) {
  const [activeStage, setActiveStage] = useState(pipelineStages[0]?.name || '')
  const [showEditModal, setShowEditModal] = useState(false)
  const [modalMode, setModalMode] = useState('view') // 'view' | 'edit'

  const stages = pipelineStages.map(stage => ({
    key: stage.name,
    emoji: stage.icon,
    fullName: stage.name,
  }));

  const stageLeads = leads[activeStage] || []

  const handleViewLead = (lead) => {
    setSelectedLead(lead)
    setModalMode('view')
    setShowEditModal(true)
  }

  const handleEditLead = (lead) => {
    setSelectedLead(lead)
    setModalMode('edit')
    setShowEditModal(true)
  }

  const handleEditModeSwitch = () => {
    setModalMode('edit')
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
    setSelectedLead(null)
    setModalMode('view')
  }

  if (leadsLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-400">Carregando leads...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full bg-white dark:bg-gray-950">
        {/* Stage Tabs - Não encolhem, z-10 */}
        <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto flex-shrink-0 z-10 relative">
          <div className="flex gap-1 px-3 py-2">
            {stages.map((stage) => (
              <button
                key={stage.key}
                onClick={() => setActiveStage(stage.key)}
                className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition ${
                  activeStage === stage.key
                    ? 'bg-blue-600 dark:bg-blue-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-current={activeStage === stage.key ? 'true' : undefined}
                title={stage.fullName}
              >
                {activeStage === stage.key ? (
                  <span>{stage.emoji} {stage.fullName}</span>
                ) : (
                  <span>{stage.emoji}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Scrollável */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {stageLeads.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="text-gray-500 dark:text-gray-400 px-6">
                <p className="text-lg font-medium mb-1">Nenhum lead</p>
                <p className="text-sm">Nessa etapa não há leads</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4 pb-24">
              {stageLeads.map((lead) => (
                <LeadCardMobile
                  key={lead.id}
                  lead={lead}
                  stageKey={activeStage}
                  onView={handleViewLead}
                  onStatusChange={(newStage) =>
                    onChangeStatus(lead.id, activeStage, newStage)
                  }
                  onEdit={handleEditLead}
                />
              ))}
            </div>
          )}
        </div>

        {/* LeadCounter */}
        <LeadCounter count={stageLeads.length} />
      </div>



      {/* Modal Unificado - View + Edit */}
      {showEditModal && selectedLead && (
        <EditLeadModal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          lead={selectedLead}
          mode={modalMode}
          onEditMode={handleEditModeSwitch}
          onLeadUpdated={onLeadUpdated}
          onLeadDeleted={onLeadDeleted}
        />
      )}
    </>
  )
}