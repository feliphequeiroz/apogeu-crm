'use client'

import { useState, useCallback } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { debug } from '@/lib/debug' // ← IMPORTAR
import MobileLayout from '@/components/layout/MobileLayout'
import DesktopLayout from '@/components/layout/DesktopLayout'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import KanbanBoardMobile from '@/components/kanban/KanbanBoardMobile'
import MobileDashboardCards from '@/components/dashboard/MobileDashboardCards'
import CreateLeadModal from '@/components/leads/CreateLeadModal'
import EditLeadModal from '@/components/leads/EditLeadModal'

export default function DashboardContent({
  user,
  leads,
  setLeads,
  leadsLoading,
  onChangeStatus,
  onLeadUpdated,
  onLeadDeleted,
  onLeadCreated,
}) {
  // ===== STATE =====
  const isMobile = useResponsive()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showMoreModal, setShowMoreModal] = useState(false)
  const [showTasksModal, setShowTasksModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editMode, setEditMode] = useState('view')
  const [activeTab, setActiveTab] = useState('leads')

  // ===== HANDLERS ESTADO LOCAL =====

  const handleChangeStatus = useCallback(
    async (leadId, fromStage, toStage) => {
      if (fromStage === toStage) return

      const leadToMove = leads[fromStage].find((l) => l.id === leadId)
      if (leadToMove) {
        setLeads((prev) => ({
          ...prev,
          [fromStage]: prev[fromStage].filter((c) => c.id !== leadId),
          [toStage]: [...prev[toStage], { ...leadToMove, status: toStage }],
        }))
      }

      await onChangeStatus(leadId, fromStage, toStage)
    },
    [leads, setLeads, onChangeStatus]
  )

  const handleUpdateLead = useCallback((updatedLead) => {
    setLeads((prev) => {
      const newLeads = { ...prev }
      Object.keys(newLeads).forEach((stage) => {
        newLeads[stage] = newLeads[stage].map((lead) =>
          lead.id === updatedLead.id
            ? {
                ...lead,
                ...updatedLead,
                value: updatedLead.value_estimate || updatedLead.value,
                nextTask: updatedLead.next_action || updatedLead.nextTask,
                phone: updatedLead.whatsapp_number || updatedLead.phone,
              }
            : lead
        )
      })
      return newLeads
    })
    setShowEditModal(false)
    setSelectedLead(null)
    onLeadUpdated(updatedLead)
  }, [setLeads, onLeadUpdated])

  const handleDeleteLead = useCallback((leadId) => {
    setLeads((prev) => {
      const newLeads = { ...prev }
      Object.keys(newLeads).forEach((stage) => {
        newLeads[stage] = newLeads[stage].filter((lead) => lead.id !== leadId)
      })
      return newLeads
    })
    setShowEditModal(false)
    setSelectedLead(null)
    onLeadDeleted(leadId)
  }, [setLeads, onLeadDeleted])

  const handleLeadCreated = useCallback((newLead) => {
    setLeads((prev) => ({
      ...prev,
      lead: [
        {
          id: newLead.id,
          name: newLead.name,
          company: newLead.company,
          days: 0,
          value: newLead.value_estimate || 0,
          email: newLead.email,
          phone: newLead.whatsapp_number,
          nextTask: newLead.next_action,
          status: 'lead',
          created_at: new Date().toISOString(),
          whatsapp_number: newLead.whatsapp_number,
          value_estimate: newLead.value_estimate,
          next_action: newLead.next_action,
        },
        ...prev.lead,
      ],
    }))
    setShowCreateModal(false)
    onLeadCreated(newLead)
  }, [setLeads, onLeadCreated])

  const handleSelectLeadFromSearch = useCallback((lead) => {
    setSelectedLead(lead)
    setEditMode('view')
    setShowEditModal(true)
  }, [])

  const handleSearchClick = useCallback(() => {
    setShowSearchModal(true)
  }, [])

  const handleMoreClick = useCallback(() => {
    setShowMoreModal(true)
  }, [])

  const handleTasksClick = useCallback(() => {
    setShowTasksModal(true)
  }, [])

  const handleViewLead = useCallback((lead) => {
    setSelectedLead(lead)
    setEditMode('view')
    setShowEditModal(true)
  }, [])

  const handleEditLead = useCallback((lead) => {
    setSelectedLead(lead)
    setEditMode('edit')
    setShowEditModal(true)
  }, [])

  // ===== SEARCH HANDLER COM DEBUG =====
  const handleSearchChange = useCallback((value) => {
    debug.log('🔍 [DashboardContent] Search changed:', value)
    setSearchTerm(value)
  }, [])

  // ===== RENDER MOBILE CONTENT =====

  const renderMobileContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <MobileDashboardCards leads={leads} />
      )
    }

    if (activeTab === 'leads') {
      return (
        <KanbanBoardMobile
          leads={leads}
          selectedLead={selectedLead}
          setSelectedLead={setSelectedLead}
          onChangeStatus={handleChangeStatus}
          onLeadUpdated={handleUpdateLead}
          onLeadDeleted={handleDeleteLead}
          leadsLoading={leadsLoading}
          searchOpen={showSearchModal}
          setSearchOpen={setShowSearchModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onView={handleViewLead}
          onEdit={handleEditLead}
        />
      )
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} (em breve)</p>
      </div>
    )
  }

  // ===== PROPS COMPARTILHADOS =====

  const kanbanProps = {
    leads,
    selectedLead,
    setSelectedLead,
    onChangeStatus: handleChangeStatus,
    onLeadUpdated: handleUpdateLead,
    onLeadDeleted: handleDeleteLead,
    leadsLoading,
    searchTerm,
    onView: handleViewLead,
    onEdit: handleEditLead,
  }

  const createModalProps = {
    isOpen: showCreateModal,
    onClose: () => setShowCreateModal(false),
    userId: user?.id,
    onLeadCreated: handleLeadCreated,
  }

  // ===== MOBILE LAYOUT =====

  if (isMobile) {
    return (
      <MobileLayout 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchClick={handleSearchClick}
        onMoreClick={handleMoreClick}
        onTasksClick={handleTasksClick}
      >
        <div key={activeTab} className="h-full">
          {renderMobileContent()}
        </div>

        <CreateLeadModal {...createModalProps} />

        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setShowSearchModal(false)
                setSearchTerm('')
              }}
            />

            <div className="relative w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 max-h-[70vh] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Nome, empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    setShowSearchModal(false)
                    setSearchTerm('')
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <span className="text-gray-500">✕</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {searchTerm.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Digite para buscar
                  </p>
                ) : (
                  (() => {
                    const allLeads = Object.values(leads).flat()
                    const searchResults = allLeads.filter(
                      (lead) =>
                        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    
                    return searchResults.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        Nenhum resultado
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {searchResults.map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() => {
                              setShowSearchModal(false)
                              setSearchTerm('')
                              handleSelectLeadFromSearch(lead)
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
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
                          </button>
                        ))}
                      </div>
                    )
                  })()
                )}
              </div>
            </div>
          </div>
        )}

        {showMoreModal && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowMoreModal(false)}
            />

            <div className="relative w-full bg-white dark:bg-gray-800 rounded-t-2xl p-6 flex flex-col items-center justify-center min-h-40">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Mais em breve
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Mais funcionalidades chegando em breve
              </p>
            </div>
          </div>
        )}

        {showTasksModal && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowTasksModal(false)}
            />

            <div className="relative w-full bg-white dark:bg-gray-800 rounded-t-2xl p-6 flex flex-col items-center justify-center min-h-40">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Tasks em breve
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Gerenciador de tarefas chegando em breve
              </p>
            </div>
          </div>
        )}

        {showEditModal && selectedLead && (
          <EditLeadModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false)
              setSelectedLead(null)
              setEditMode('view')
            }}
            lead={selectedLead}
            mode={editMode}
            onEditMode={() => {
              setEditMode('edit')
            }}
            onLeadUpdated={handleUpdateLead}
            onLeadDeleted={handleDeleteLead}
          />
        )}

        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-36 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition text-2xl z-40"
          title="Novo Lead"
          aria-label="Criar novo lead"
        >
          +
        </button>
      </MobileLayout>
    )
  }

  // ===== DESKTOP LAYOUT =====

  debug.log('🖥️ [DashboardContent] Desktop render - searchTerm:', searchTerm)

  return (
    <DesktopLayout
      user={user}
      searchTerm={searchTerm}
      setSearchTerm={handleSearchChange}
      leads={leads}
      onCreateLead={() => setShowCreateModal(true)}
    >
      <KanbanBoard {...kanbanProps} />

      <CreateLeadModal {...createModalProps} />

      {showEditModal && selectedLead && (
        <EditLeadModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedLead(null)
            setEditMode('view')
          }}
          lead={selectedLead}
          mode={editMode}
          onEditMode={() => {
            setEditMode('edit')
          }}
          onLeadUpdated={handleUpdateLead}
          onLeadDeleted={handleDeleteLead}
        />
      )}

      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary-hover dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition text-2xl z-40"
        title="Novo Lead"
        aria-label="Criar novo lead"
      >
        +
      </button>
    </DesktopLayout>
  )
}