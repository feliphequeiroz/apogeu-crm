'use client'

import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { createLead } from '@/lib/leads/actions'
import { useResponsive } from '@/hooks/useResponsive'

/**
 * CreateLeadModal - Unificado
 * 
 * LAYOUT:
 * - Mobile: Tela cheia com header fixo, conteúdo scrollável, footer fixo
 * - Desktop: Modal centralizado (max-w-md) com max-h-[90vh]
 * 
 * ESTRUTURA FLEX:
 * - Mobile: flex flex-col h-full (header shrink-0, content flex-1 overflow, footer shrink-0)
 * - Desktop: Similar mas dentro de um modal box
 */
export default function CreateLeadModal({ isOpen, onClose, userId, onLeadCreated }) {
  const isMobile = useResponsive()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    whatsapp_number: '',
    value_estimate: '',
    next_action: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!userId) {
        setError('Erro: usuário não identificado. Faça login novamente.')
        setLoading(false)
        return
      }

      if (!formData.name.trim()) {
        setError('Nome é obrigatório')
        setLoading(false)
        return
      }

      const leadData = {
        user_id: userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        whatsapp_number: formData.whatsapp_number.trim(),
        value_estimate: formData.value_estimate ? parseFloat(formData.value_estimate) : 0,
        next_action: formData.next_action.trim(),
        status: 'lead',
      }

      const { data, error: createError } = await createLead(leadData)

      if (createError) {
        setError(createError)
        return
      }

      if (data) {
        onLeadCreated({
          id: data.id,
          name: data.name,
          company: data.company,
          email: data.email,
          whatsapp_number: data.whatsapp_number,
          value_estimate: data.value_estimate,
          next_action: data.next_action,
          status: 'lead',
          created_at: data.created_at,
        })

        setFormData({
          name: '',
          email: '',
          company: '',
          whatsapp_number: '',
          value_estimate: '',
          next_action: '',
        })
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar lead')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return null
  }

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Novo Lead</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content - Scrollável */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="João Silva"
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                disabled={loading}
                required
              />
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc"
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                disabled={loading}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="(11) 98765-4321"
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@example.com"
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                disabled={loading}
              />
            </div>

            {/* Valor Estimado */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Estimativa de Valor (R$)
              </label>
              <input
                type="number"
                name="value_estimate"
                value={formData.value_estimate}
                onChange={handleChange}
                placeholder="5000"
                step="100"
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                disabled={loading}
              />
            </div>

            {/* Próxima Ação */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Próxima Ação
              </label>
              <input
                type="text"
                name="next_action"
                value={formData.next_action}
                onChange={handleChange}
                placeholder="Enviar proposta"
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                disabled={loading}
              />
            </div>
          </form>
        </div>

        {/* Footer - Fixo */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Lead'
            )}
          </button>
        </div>
      </div>
    )
  }

  // ===== DESKTOP LAYOUT =====
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Novo Lead</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content - Scrollável */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Nome *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="João Silva"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
              required
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Empresa
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Inc"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              placeholder="(11) 98765-4321"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="joao@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            />
          </div>

          {/* Valor Estimado */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Estimativa de Valor (R$)
            </label>
            <input
              type="number"
              name="value_estimate"
              value={formData.value_estimate}
              onChange={handleChange}
              placeholder="5000"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            />
          </div>

          {/* Próxima Ação */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Próxima Ação
            </label>
            <input
              type="text"
              name="next_action"
              value={formData.next_action}
              onChange={handleChange}
              placeholder="Enviar proposta"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            />
          </div>
        </form>

        {/* Footer - Fixo */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Lead'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}