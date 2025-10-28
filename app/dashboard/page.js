'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { Loader, Menu, X, Plus, Search, Filter } from 'lucide-react'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import Sidebar from '@/components/kanban/Sidebar'
import CreateLeadModal from '@/components/leads/CreateLeadModal'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estado Global - TUDO AQUI
  const [leads, setLeads] = useState({
    lead: [],
    qualified: [],
    diagnostic: [],
    proposal: [],
    negotiation: [],
    closed: [],
  })
  
  const [selectedLead, setSelectedLead] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [leadsLoading, setLeadsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, mounted, router])

  // Carregar leads
  useEffect(() => {
    if (user && mounted) {
      loadLeads()
    }
  }, [user, mounted])

  const loadLeads = async () => {
    setLeadsLoading(true)
    try {
      const { getLeads } = await import('@/lib/leads/actions')
      const { data, error } = await getLeads(user.id)

      if (!error && data) {
        const groupedLeads = {
          lead: [],
          qualified: [],
          diagnostic: [],
          proposal: [],
          negotiation: [],
          closed: [],
        }

        data.forEach((lead) => {
          const status = lead.status || 'lead'
          if (groupedLeads[status]) {
            groupedLeads[status].push({
              id: lead.id,
              name: lead.name,
              company: lead.company,
              days: Math.floor(
                (new Date() - new Date(lead.created_at)) / (1000 * 60 * 60 * 24)
              ),
              value: lead.value_estimate || 0,
              email: lead.email,
              phone: lead.whatsapp_number,
              nextTask: lead.next_action,
              status: lead.status || 'lead',
              created_at: lead.created_at,
            })
          }
        })

        setLeads(groupedLeads)
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
    } finally {
      setLeadsLoading(false)
    }
  }

  const handleLeadCreated = (newLead) => {
    const leadObj = {
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
    }

    setLeads((prev) => ({
      ...prev,
      lead: [leadObj, ...prev.lead],
    }))

    setShowCreateModal(false)
  }

  const handleLeadUpdated = (updatedLead) => {
    // Encontrar em qual stage está e atualizar
    Object.keys(leads).forEach((stage) => {
      setLeads((prev) => ({
        ...prev,
        [stage]: prev[stage].map((lead) =>
          lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
        ),
      }))
    })
    setShowEditModal(false)
    setSelectedLead(null)
  }

  const handleLeadDeleted = (leadId) => {
    Object.keys(leads).forEach((stage) => {
      setLeads((prev) => ({
        ...prev,
        [stage]: prev[stage].filter((lead) => lead.id !== leadId),
      }))
    })
    setShowEditModal(false)
    setSelectedLead(null)
  }

  const handleMoveToStage = async (leadId, fromStage, toStage) => {
    try {
      const { updateLeadStatus } = await import('@/lib/leads/actions')
      await updateLeadStatus(leadId, toStage)

      // Encontrar o lead e mover
      const lead = leads[fromStage].find((l) => l.id === leadId)
      if (lead) {
        setLeads((prev) => ({
          ...prev,
          [fromStage]: prev[fromStage].filter((c) => c.id !== leadId),
          [toStage]: [...prev[toStage], { ...lead, status: toStage }],
        }))
      }
    } catch (error) {
      console.error('Erro ao mover lead:', error)
    }
  }

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-text-secondary text-sm">Gerencie seu funil de vendas</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 font-semibold">TOTAL LEADS</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {Object.values(leads).flat().length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 font-semibold">PIPELINE</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                R$ {(Object.values(leads).flat().reduce((acc, lead) => acc + (lead.value || 0), 0) / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 font-semibold">FECHADOS</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {leads.closed?.length || 0}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 font-semibold">CONVERSÃO</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {Object.values(leads).flat().length > 0
                  ? ((leads.closed?.length / Object.values(leads).flat().length) * 100).toFixed(0)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold text-sm whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            leads={leads}
            searchTerm={searchTerm}
            selectedLead={selectedLead}
            setSelectedLead={setSelectedLead}
            showDetailModal={showDetailModal}
            setShowDetailModal={setShowDetailModal}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            onMoveToStage={handleMoveToStage}
            onLeadUpdated={handleLeadUpdated}
            onLeadDeleted={handleLeadDeleted}
            leadsLoading={leadsLoading}
          />
        </div>

        {/* Modal de criar lead - aqui no Dashboard */}
        <CreateLeadModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          userId={user?.id}
          onLeadCreated={handleLeadCreated}
        />

        {/* Botão flutuante */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition text-2xl z-40"
          title="Novo Lead"
        >
          +
        </button>
      </div>
    </main>
  )
}