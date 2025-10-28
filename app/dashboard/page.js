'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { Loader, Menu, X, Search, Filter, Info } from 'lucide-react'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import Sidebar from '@/components/kanban/Sidebar'
import CreateLeadModal from '@/components/leads/CreateLeadModal'
import { getLeads, updateLeadStatus } from '@/lib/leads/actions'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [leadsLoaded, setLeadsLoaded] = useState(false)

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
    const savedSidebarState = localStorage.getItem('sidebarOpen')
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState))
    }
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, mounted, router])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
    }
  }, [sidebarOpen, mounted])

  const loadLeads = useCallback(async () => {
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
              whatsapp_number: lead.whatsapp_number,
              value_estimate: lead.value_estimate,
              next_action: lead.next_action,
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
  }, [user?.id])

  useEffect(() => {
    if (user && mounted && !leadsLoaded) {
      loadLeads()
      setLeadsLoaded(true)
    }
  }, [user, mounted, leadsLoaded])

  const handleChangeStatus = useCallback(
    async (leadId, fromStage, toStage) => {
      if (fromStage === toStage) return

      try {
        const leadToMove = leads[fromStage].find((l) => l.id === leadId)
        if (leadToMove) {
          setLeads((prev) => ({
            ...prev,
            [fromStage]: prev[fromStage].filter((c) => c.id !== leadId),
            [toStage]: [...prev[toStage], { ...leadToMove, status: toStage }],
          }))
        }

        const { error } = await updateLeadStatus(leadId, toStage)
        if (error) {
          console.error('Erro ao atualizar status:', error)
          loadLeads()
        }
      } catch (error) {
        console.error('Erro ao mover lead:', error)
        loadLeads()
      }
    },
    [leads, loadLeads]
  )

  const handleUpdateLead = useCallback(
    (updatedLead) => {
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
    },
    []
  )

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
  }, [])

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
  }, [])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalLeads = Object.values(leads).flat().length
  const totalPipeline = Object.values(leads)
    .flat()
    .reduce((acc, lead) => acc + (lead.value || 0), 0)
  const closedLeads = leads.closed?.length || 0
  const conversionRate =
    totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(0) : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Gerencie seu funil de vendas</p>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    title="Limpar busca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 font-semibold text-sm whitespace-nowrap transition">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">Total Leads</p>
                <span className="text-xl">📊</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalLeads}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Leads em seu funil</p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">Pipeline</p>
                <span className="text-xl">💼</span>
              </div>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                R$ {(totalPipeline / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">Valor em progresso</p>
            </div>

            <div className="bg-green-50 dark:bg-green-950 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">Fechados</p>
                <span className="text-xl">✅</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{closedLeads}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">Vendas realizadas</p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950 p-6 rounded-xl border-2 border-orange-300 dark:border-orange-800 shadow-sm hover:shadow-md transition ring-2 ring-orange-200 dark:ring-orange-900 ring-opacity-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wide">Taxa Conversão</p>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-orange-500 hover:text-orange-600 transition cursor-pointer" />
                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg p-4 z-50 whitespace-normal shadow-lg transition-all duration-300 ease-in-out">
                      <p className="font-semibold mb-2">Taxa de Conversão</p>
                      <p className="mb-2">Mostra qual % de seus leads chegou até o fechamento.</p>
                      <div className="space-y-1 mb-3 pl-3 border-l-2 border-orange-400">
                        <p>• <span className="font-semibold">Total de leads:</span> todos os contatos em seu funil</p>
                        <p>• <span className="font-semibold">Leads fechados:</span> aqueles que viraram clientes</p>
                      </div>
                      
                      <div className="bg-orange-900 dark:bg-orange-900 bg-opacity-40 rounded p-3 mb-3 border border-orange-700">
                        <p className="font-semibold mb-1">Seus dados:</p>
                        <p>• Total: <span className="text-orange-300 font-bold">{totalLeads}</span> leads</p>
                        <p>• Fechados: <span className="text-orange-300 font-bold">{closedLeads}</span> leads</p>
                        <p className="mt-1 text-orange-200">= <span className="text-lg font-bold">{conversionRate}%</span> de conversão</p>
                      </div>
                      
                      <p className="text-orange-300 text-xs italic">Aumente essa métrica melhorando cada etapa do funil.</p>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-800"></div>
                    </div>
                  </div>
                </div>
                <span className="text-xl">🎯</span>
              </div>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{conversionRate}%</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-semibold">Métrica crítica</p>
            </div>
          </div>
        </div>

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
            onChangeStatus={handleChangeStatus}
            onLeadUpdated={handleUpdateLead}
            onLeadDeleted={handleDeleteLead}
            leadsLoading={leadsLoading}
          />
        </div>

        <CreateLeadModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          userId={user?.id}
          onLeadCreated={handleLeadCreated}
        />

        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary-hover dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition text-2xl z-40"
          title="Novo Lead"
        >
          +
        </button>
      </div>
    </div>
  )
}