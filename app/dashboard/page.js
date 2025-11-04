'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { Loader } from 'lucide-react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { getLeads, updateLeadStatus } from '@/lib/leads/actions'
import { getPipelineStages } from '@/lib/pipeline/actions'
import { slugify } from '@/lib/utils'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [leadsLoaded, setLeadsLoaded] = useState(false)
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [pipelineStages, setPipelineStages] = useState([])

  const [leads, setLeads] = useState({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, mounted, router])

  const loadInitialData = useCallback(async () => {
    if (!user?.id) return

    setLeadsLoading(true)
    try {
      const [stagesResponse, leadsResponse] = await Promise.all([
        getPipelineStages(user.id),
        getLeads(user.id),
      ])

      if (stagesResponse.error) {
        console.error('❌ Erro ao carregar estágios do pipeline:', stagesResponse.error)
        setPipelineStages([])
      } else {
        setPipelineStages(stagesResponse.data)
      }

      if (leadsResponse.error) {
        console.error('❌ Erro ao carregar leads:', leadsResponse.error)
        setLeads({})
      } else if (stagesResponse.data && leadsResponse.data) {
        const stages = stagesResponse.data;
        const stageNameMap = new Map(stages.map(s => [s.name, s.key || slugify(s.name)]));
        const stageIdMap = new Map(stages.map(s => [s.id, s.key || slugify(s.name)]));

        const groupedLeads = {};
        stages.forEach(stage => {
            groupedLeads[stage.key || slugify(stage.name)] = [];
        });

        leadsResponse.data.forEach(lead => {
            let stageKey = stageIdMap.get(lead.status) || stageNameMap.get(lead.status) || lead.status;
            
            if (!groupedLeads[stageKey]) {
                stageKey = stages[0]?.key || slugify(stages[0]?.name);
            }

            if (groupedLeads[stageKey]) {
                groupedLeads[stageKey].push({
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
                    status: stageKey, // Ensure status is the key
                    created_at: lead.created_at,
                    whatsapp_number: lead.whatsapp_number,
                    value_estimate: lead.value_estimate,
                    next_action: lead.next_action,
                });
            }
        });

        setLeads(groupedLeads)
        console.log('✅ Leads carregados:', groupedLeads)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error)
    } finally {
      setLeadsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user && mounted && !leadsLoaded) {
      loadInitialData()
      setLeadsLoaded(true)
    }
  }, [user, mounted, leadsLoaded, loadInitialData])

  const handleChangeStatus = useCallback(
    async (leadId, fromStage, toStage) => {
      if (fromStage === toStage) return

      try {
        const { error } = await updateLeadStatus(leadId, toStage)
        if (error) {
          console.error('❌ Erro ao atualizar status:', error)
          loadInitialData() // Recarrega se erro
        } else {
          console.log('✅ Lead movido:', leadId, toStage)
        }
      } catch (error) {
        console.error('❌ Erro ao mover lead:', error)
        loadInitialData()
      }
    },
    [loadInitialData]
  )

  const handleLeadUpdated = useCallback((updatedLead) => {
    console.log('✅ Lead atualizado:', updatedLead)
    loadInitialData() // Recarrega para sincronizar
  }, [loadInitialData])

  const handleLeadDeleted = useCallback((leadId) => {
    console.log('✅ Lead deletado:', leadId)
    loadInitialData() // Recarrega para sincronizar
  }, [loadInitialData])

  const handleLeadCreated = useCallback((newLead) => {
    console.log('✅ Novo lead criado:', newLead)
    loadInitialData() // Recarrega para sincronizar
  }, [loadInitialData])

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
      pipelineStages={pipelineStages}
      leadsLoading={leadsLoading}
      onChangeStatus={handleChangeStatus}
      onLeadUpdated={handleLeadUpdated}
      onLeadDeleted={handleLeadDeleted}
      onLeadCreated={handleLeadCreated}
    />
  )
}