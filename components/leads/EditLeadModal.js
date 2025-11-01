'use client'

import { useState, useEffect } from 'react'
import { X, Loader, Trash2, Edit2 } from 'lucide-react'
import { updateLead, deleteLead } from '@/lib/leads/actions'
import { useResponsive } from '@/hooks/useResponsive'

/**
 * EditLeadModal - Unificado com Animações Suaves
 * 
 * PROPS:
 * - mode: 'view' | 'edit' (padrão: 'edit')
 *   - 'view': Mostra dados read-only com botão editar
 *   - 'edit': Formulário editável com save/delete
 * 
 * ANIMAÇÕES:
 * - backdrop-blur-sm: Blur suave no fundo
 * - animate-in fade-in zoom-in-95: Entrada suave com fade + zoom
 * - duration-200: Transição rápida e fluída
 * - rounded-xl: Bordas mais suaves
 * - shadow-2xl: Sombra mais dramática
 */
export default function EditLeadModal({ 
  isOpen, 
  onClose, 
  lead, 
  mode = 'edit',
  onLeadUpdated, 
  onLeadDeleted,
  onEditMode,
}) {
  const isMobile = useResponsive()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [currentMode, setCurrentMode] = useState(mode)
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
      setCurrentMode(mode)
    }
  }, [lead, isOpen, mode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditClick = () => {
    setCurrentMode('edit')
    onEditMode?.()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    if (formData.email && !formData.email.includes('@')) {
      setError('Email inválido')
      return
    }

    if (formData.value && isNaN(parseFloat(formData.value))) {
      setError('Valor deve ser um número')
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

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

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

  // ===== VIEW MODE =====
  if (currentMode === 'view') {
    if (isMobile) {
      return (
        <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-200">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detalhes</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content - Scroll fixo */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            <div className="space-y-4 pb-4">
              {[
                { label: 'Nome', value: lead.name },
                { label: 'Empresa', value: lead.company },
                { label: 'Email', value: lead.email, isLink: true, href: `mailto:${lead.email}` },
                { label: 'WhatsApp', value: lead.whatsapp_number, isLink: true, href: `https://wa.me/${lead.whatsapp_number?.replace(/\D/g, '')}` },
                { label: 'Valor', value: lead.value_estimate ? `R$ ${lead.value_estimate.toLocaleString('pt-BR')}` : null },
                { label: 'Próxima Ação', value: lead.next_action },
                { label: 'Status', value: lead.status },
                { label: 'Criado', value: lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : null },
              ].map(
                (item) =>
                  item.value && (
                    <div key={item.label}>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {item.label}
                      </label>
                      {item.isLink ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium mt-1 block"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium mt-1">
                          {item.value}
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Actions - Fixo no footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleEditClick}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>
      )
    }

    // Desktop view mode - COM ANIMAÇÕES
    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Lead</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content - Scroll */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
            <div className="space-y-4">
              {[
                { label: 'Nome', value: lead.name },
                { label: 'Empresa', value: lead.company },
                { label: 'Email', value: lead.email, isLink: true, href: `mailto:${lead.email}` },
                { label: 'WhatsApp', value: lead.whatsapp_number, isLink: true, href: `https://wa.me/${lead.whatsapp_number?.replace(/\D/g, '')}` },
                { label: 'Valor', value: lead.value_estimate ? `R$ ${lead.value_estimate.toLocaleString('pt-BR')}` : null },
                { label: 'Próxima Ação', value: lead.next_action },
                { label: 'Status', value: lead.status },
              ].map(
                (item) =>
                  item.value && (
                    <div key={item.label}>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {item.label}
                      </label>
                      {item.isLink ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium mt-1 block"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium mt-1">
                          {item.value}
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Footer - Fixo */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleEditClick}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== EDIT MODE =====
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-200">
          <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Editar Lead</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Form Content - Scroll */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            <form onSubmit={handleSubmit} className="space-y-4 pb-4">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm animate-in fade-in duration-150">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Nome</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base transition-shadow" disabled={loading || deleting} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Empresa</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base transition-shadow" disabled={loading || deleting} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base transition-shadow" disabled={loading || deleting} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Telefone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base transition-shadow" disabled={loading || deleting} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Valor Estimado</label>
                <input type="number" name="value" value={formData.value} onChange={handleChange} className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base transition-shadow" disabled={loading || deleting} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Próxima Ação</label>
                <input type="text" name="nextTask" value={formData.nextTask} onChange={handleChange} className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base transition-shadow" disabled={loading || deleting} />
              </div>
            </form>
          </div>

          {/* Actions - Fixo */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex gap-2 flex-shrink-0">
            <button onClick={handleDeleteClick} disabled={loading || deleting} className="px-4 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {deleting ? <><Loader className="w-4 h-4 animate-spin" />Deletando...</> : <><Trash2 className="w-4 h-4" />Deletar</>}
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-colors" disabled={loading || deleting}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={loading || deleting} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
              {loading ? <><Loader className="w-4 h-4 animate-spin" />Salvando...</> : 'Salvar'}
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[60] animate-in fade-in duration-200">
              <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Excluir Lead</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tem certeza que quer deletar?</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{lead.name}</p>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                  <p className="text-xs text-red-700 dark:text-red-300">⚠️ Esta ação não pode ser desfeita.</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-colors disabled:opacity-50">
                    Cancelar
                  </button>
                  <button onClick={handleConfirmDelete} disabled={deleting} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                    {deleting ? <><Loader className="w-4 h-4 animate-spin" />Excluindo...</> : <><Trash2 className="w-4 h-4" />Sim, Excluir</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  // Desktop edit mode - COM ANIMAÇÕES
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Lead</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form - Envolve tudo para submit funcionar */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Form Content - Scroll */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm animate-in fade-in duration-150">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Nome</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-shadow" disabled={loading || deleting} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Empresa</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-shadow" disabled={loading || deleting} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-shadow" disabled={loading || deleting} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Telefone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-shadow" disabled={loading || deleting} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Valor Estimado</label>
              <input type="number" name="value" value={formData.value} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-shadow" disabled={loading || deleting} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Próxima Ação</label>
              <input type="text" name="nextTask" value={formData.nextTask} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition-shadow" disabled={loading || deleting} />
            </div>
          </div>

          {/* Actions - Fixo DENTRO do form */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3 flex-shrink-0">
            <button type="button" onClick={handleDeleteClick} disabled={loading || deleting} className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {deleting ? <><Loader className="w-4 h-4 animate-spin" />Deletando...</> : <><Trash2 className="w-4 h-4" />Deletar</>}
            </button>
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors" disabled={loading || deleting}>
              Cancelar
            </button>
            <button type="submit" disabled={loading || deleting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
              {loading ? <><Loader className="w-4 h-4 animate-spin" />Salvando...</> : 'Salvar'}
            </button>
          </div>
        </form>

        {showDeleteConfirm && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Excluir Lead</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tem certeza que quer deletar?</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{lead.name}</p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                <p className="text-xs text-red-700 dark:text-red-300">⚠️ Esta ação não pode ser desfeita.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors disabled:opacity-50">
                  Cancelar
                </button>
                <button onClick={handleConfirmDelete} disabled={deleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                  {deleting ? <><Loader className="w-4 h-4 animate-spin" />Excluindo...</> : <><Trash2 className="w-4 h-4" />Sim, Excluir</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}