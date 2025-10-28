'use server'

import { createClient } from '@supabase/supabase-js'

// Cliente anon (com RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Cliente service role (bypass RLS) - apenas no servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Buscar todos os leads de um usuário
 */
export async function getLeads(userId) {
  try {
    if (!userId) {
      return { data: null, error: 'User ID is required' }
    }

    // Usar supabaseAdmin pra bypass RLS no servidor
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error in getLeads:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Criar novo lead - CORRIGIDO COM SERVICE ROLE
 */
export async function createLead(leadData) {
  try {
    // Validar campos obrigatórios
    if (!leadData.user_id) {
      return { data: null, error: 'user_id é obrigatório' }
    }

    if (!leadData.name) {
      return { data: null, error: 'Nome é obrigatório' }
    }

    // Preparar dados com valores padrão
    const newLead = {
      user_id: leadData.user_id,
      name: leadData.name || '',
      email: leadData.email || '',
      company: leadData.company || '',
      whatsapp_number: leadData.whatsapp_number || '',
      value_estimate: leadData.value_estimate || 0,
      next_action: leadData.next_action || '',
      status: leadData.status || 'lead',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Usar supabaseAdmin pra bypass RLS no servidor
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([newLead])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error in createLead:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Atualizar lead
 */
export async function updateLead(leadId, updates) {
  try {
    if (!leadId) {
      return { data: null, error: 'Lead ID é obrigatório' }
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error in updateLead:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Atualizar status do lead (mover no Kanban)
 */
export async function updateLeadStatus(leadId, newStatus) {
  try {
    if (!leadId || !newStatus) {
      return { data: null, error: 'Lead ID e status são obrigatórios' }
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()

    if (error) {
      console.error('Error updating lead status:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error in updateLeadStatus:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Deletar lead
 */
export async function deleteLead(leadId) {
  try {
    if (!leadId) {
      return { data: null, error: 'Lead ID é obrigatório' }
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .delete()
      .eq('id', leadId)

    if (error) {
      console.error('Error deleting lead:', error)
      return { data: null, error: error.message }
    }

    return { data: { success: true }, error: null }
  } catch (error) {
    console.error('Error in deleteLead:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Adicionar interação ao lead
 */
export async function addInteraction(leadId, interaction) {
  try {
    if (!leadId) {
      return { data: null, error: 'Lead ID é obrigatório' }
    }

    const interactionData = {
      date: new Date().toISOString(),
      type: interaction.type || 'note',
      description: interaction.description || '',
      nextStep: interaction.nextStep || '',
    }

    const { data: lead, error: fetchError } = await supabase
      .from('leads')
      .select('interactions')
      .eq('id', leadId)
      .single()

    if (fetchError) {
      return { data: null, error: fetchError.message }
    }

    const interactions = Array.isArray(lead?.interactions) ? lead.interactions : []
    interactions.push(interactionData)

    const { data, error } = await supabase
      .from('leads')
      .update({
        interactions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error in addInteraction:', error)
    return { data: null, error: error.message }
  }
}