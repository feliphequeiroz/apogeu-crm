'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { Loader } from 'lucide-react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { getLeads, updateLeadStatus } from '@/lib/leads/actions'

/**
 * DashboardPage
 * 
 * RESPONSABILIDADES:
 * 1. Autenticação (useAuth)
 * 2. Carregamento de dados (getLeads)
 * 3. Handlers de API + atualização de estado
 * 4. Passa setLeads para DashboardContent sincronizar
 */
export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [leadsLoaded, setLeadsLoaded] = useState(false)
  const [leadsLoading, setLeadsLoading] = useState(true)

  const [leads, setLeads] = useState({
    lead: [],
    qualified: [],
    diagnostic: [],
    proposal: [],
    negotiation: [],
    closed: [],
  })

  // ===== AUTENTICAÇÃO =====

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, mounted, router])

  // ===== CARREGAMENTO DE DADOS =====

  const loadLeads = useCallback(async () => {
    if (!user?.id) return
    
    setLeadsLoading(true)
    try {
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
        console.log('✅ Leads carregados:', groupedLeads)
      } else {
        console.error('❌ Erro ao carregar leads:', error)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar leads:', error)
    } finally {
      setLeadsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user && mounted && !leadsLoaded) {
      loadLeads()
      setLeadsLoaded(true)
    }
  }, [user, mounted, leadsLoaded, loadLeads])

  // ===== HANDLERS DE API =====

  /**
   * Mover lead entre estágios
   * 1. Atualiza estado local
   * 2. Chama API
   * 3. Se erro, recarrega
   */
  const handleChangeStatus = useCallback(
    async (leadId, fromStage, toStage) => {
      if (fromStage === toStage) return

      try {
        const { error } = await updateLeadStatus(leadId, toStage)
        if (error) {
          console.error('❌ Erro ao atualizar status:', error)
          loadLeads() // Recarrega se erro
        } else {
          console.log('✅ Lead movido:', leadId, toStage)
        }
      } catch (error) {
        console.error('❌ Erro ao mover lead:', error)
        loadLeads()
      }
    },
    [loadLeads]
  )

  /**
   * Lead foi editado no modal
   * Recarrega leads para sincronizar
   */
  const handleLeadUpdated = useCallback((updatedLead) => {
    console.log('✅ Lead atualizado:', updatedLead)
    loadLeads() // Recarrega para sincronizar
  }, [loadLeads])

  /**
   * Lead foi deletado
   * Recarrega leads para sincronizar
   */
  const handleLeadDeleted = useCallback((leadId) => {
    console.log('✅ Lead deletado:', leadId)
    loadLeads() // Recarrega para sincronizar
  }, [loadLeads])

  /**
   * Novo lead foi criado
   * Recarrega leads para sincronizar
   */
  const handleLeadCreated = useCallback((newLead) => {
    console.log('✅ Novo lead criado:', newLead)
    loadLeads() // Recarrega para sincronizar
  }, [loadLeads])

  // ===== RENDER =====

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

  return (
    <DashboardContent
      user={user}
      leads={leads}
      setLeads={setLeads}
      leadsLoading={leadsLoading}
      onChangeStatus={handleChangeStatus}
      onLeadUpdated={handleLeadUpdated}
      onLeadDeleted={handleLeadDeleted}
      onLeadCreated={handleLeadCreated}
    />
  )
}