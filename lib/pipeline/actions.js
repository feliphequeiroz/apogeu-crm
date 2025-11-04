'use server'

import { createClient } from '@supabase/supabase-js'
import { slugify } from '@/lib/utils'

// NOTE: Don't forget to add the 'key' column to the 'pipeline_stages' table in Supabase.

// Configura o cliente Supabase para uso no lado do cliente (com RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Configura o cliente Supabase Admin para uso no lado do servidor (bypass RLS)
// A chave de serviço DEVE ser usada APENAS em ambientes seguros de servidor.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Função para obter todos os estágios do pipeline de um usuário
export async function getPipelineStages(userId) {
  if (!userId) {
    return { data: null, error: 'User ID is required' }
  }
  const { data, error } = await supabaseAdmin // Use supabaseAdmin here
    .from('pipeline_stages')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  return { data, error }
}

// Função para criar um novo estágio no pipeline
export async function createPipelineStage(stageData) {
  if (!stageData.user_id) {
    return { data: null, error: 'User ID is required' }
  }

  const key = slugify(stageData.name);

  const { data, error } = await supabaseAdmin
    .from('pipeline_stages')
    .insert([{ ...stageData, key }])
    .select()
    .single()

  return { data, error }
}

// Função para atualizar um estágio existente
export async function updatePipelineStage(stageId, updates) {

  if (updates.name) {
    updates.key = slugify(updates.name);
  }

  const { data, error } = await supabaseAdmin
    .from('pipeline_stages')
    .update(updates)
    .eq('id', stageId)
    .select()
    .single()

  return { data, error }
}

// Função para deletar um estágio
export async function deletePipelineStage(stageId) {
  const { error } = await supabaseAdmin
    .from('pipeline_stages')
    .delete()
    .eq('id', stageId)

  return { error }
}

// Função para reordenar estágios (exemplo simplificado)
export async function reorderPipelineStages(stages) {
  const updates = stages.map((stage, index) => ({
    id: stage.id,
    position: index, // Assumindo que a ordem na array é a nova posição
  }))

  // Usar transaction ou Promise.all para garantir atomicidade
  const { data, error } = await supabaseAdmin
    .from('pipeline_stages')
    .upsert(updates, { onConflict: 'id' })
    .select()

  return { data, error }
}
