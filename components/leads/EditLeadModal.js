'use client'

import { useState, useEffect } from 'react'
import { X, Loader, Trash2 } from 'lucide-react'
import { updateLead, deleteLead } from '@/lib/leads/actions'

export default function EditLeadModal({ isOpen, onClose, lead, onLeadUpdated, onLeadDeleted }) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    nextTask: '',
  })

  useEffect(() => {
    if (lead && isOpen) {
      setFormData({
        name: lead.name || '',
        company: lead.company || '',
        email: lead.email || '',
        phone: lead.phone || lead.whatsapp_number || '',
        value: lead.value || lead.value_estimate || '',
        nextTask: lead.nextTask || lead.next_action || '',
      })
    }
  }, [lead, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Nome é obrigatório para edição')
      return
    }

    // Validação de email, se fornecido
    if (formData.email && !formData.email.includes('@')) {
      setError('Email inválido')
      return
    }

    // Validação de valor, se fornecido
    if (formData.value && isNaN(parseFloat(formData.value))) {
      setError('Valor deve ser um número válido')
      return
    }

    setLoading(true)
    const { error: updateError } = await updateLead(lead.id, {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      whatsapp_number: formData.phone,
      value_estimate: parseFloat(formData.value) || 0,
      next_action: formData.nextTask,
      updated_at: new Date().toISOString(),
    })

    if (updateError) {
      setError(updateError)
      setLoading(false)
    } else {
      onLeadUpdated({
        ...lead,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        whatsapp_number: formData.phone,
        value: formData.value,
        value_estimate: parseFloat(formData.value) || 0,
        nextTask: formData.nextTask,
        next_action: formData.nextTask,
      })
      onClose()
    }
  }

  // ✅ NOVO: Abre modal de confirmação ao invés de usar confirm()
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  // ✅ NOVO: Função que realmente deleta após confirmação
  const handleConfirmDelete = async () => {
    setDeleting(true)
    const { error: deleteError } = await deleteLead(lead.id)

    if (deleteError) {
      setError(deleteError)
      setDeleting(false)
      setShowDeleteConfirm(false)
    } else {
      onLeadDeleted(lead.id)
      onClose()
      setShowDeleteConfirm(false)
    }
  }

  if (!isOpen || !lead) return null

  return (
    <>
      {/* Modal Principal - Edição */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Lead</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-start">
              <div className="shrink-0 w-5 h-5 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={loading || deleting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Empresa</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={loading || deleting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={loading || deleting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={loading || deleting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Valor Estimado
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={loading || deleting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Próxima Ação
              </label>
              <input
                type="text"
                name="nextTask"
                value={formData.nextTask}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={loading || deleting}
              />
            </div>

            <div className="flex gap-3 pt-4">
              {/* ✅ ALTERADO: Agora abre modal de confirmação */}
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={loading || deleting}
                className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deletando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition"
                disabled={loading || deleting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || deleting}
                className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ NOVO: Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Excluir Lead
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tem certeza que quer deletar este lead?
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
                  {lead.name}
                </p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
              <p className="text-xs text-red-700 dark:text-red-300">
                ⚠️ Esta ação não pode ser desfeita. O lead será permanentemente removido.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-700 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Sim, Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}