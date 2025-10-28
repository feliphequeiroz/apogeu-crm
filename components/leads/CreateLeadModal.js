'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createLead } from '@/lib/leads/actions'

export default function CreateLeadModal({ isOpen, onClose, userId, onLeadCreated }) {
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
      // Validar que userId existe
      if (!userId) {
        setError('Erro: usuário não identificado. Faça login novamente.')
        setLoading(false)
        return
      }

      // Validar campos obrigatórios
      if (!formData.name.trim()) {
        setError('Nome é obrigatório')
        setLoading(false)
        return
      }

      // Preparar dados com user_id do cliente
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

      console.log('Enviando lead com dados:', leadData) // Debug

      const { data, error: createError } = await createLead(leadData)

      if (createError) {
        setError(createError)
        console.error('Erro ao criar lead:', createError)
        return
      }

      // Sucesso - callback com novo lead
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

        // Limpar formulário
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
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Novo Lead</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body com scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="João Silva"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Estimativa de Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Estimativa de Valor (R$)
              </label>
              <input
                type="number"
                name="value_estimate"
                value={formData.value_estimate}
                onChange={handleChange}
                placeholder="5000"
                step="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Próxima Ação */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Próxima Ação
              </label>
              <input
                type="text"
                name="next_action"
                value={formData.next_action}
                onChange={handleChange}
                placeholder="Enviar proposta"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>


          </div>
        </form>

        {/* Footer fixo */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-blue-400"
            >
              {loading ? 'Salvando...' : 'Criar Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}