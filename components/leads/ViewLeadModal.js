'use client'

import { X, Edit2 } from 'lucide-react'

export default function ViewLeadModal({ isOpen, onClose, lead, onEdit }) {
  if (!isOpen || !lead) return null

  const handleEdit = () => {
    onClose()
    onEdit(lead)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nome</label>
            <p className="text-gray-900 dark:text-white font-medium mt-1">{lead.name || '—'}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Empresa</label>
            <p className="text-gray-900 dark:text-white font-medium mt-1">{lead.company || '—'}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
            <p className="text-gray-900 dark:text-white font-medium mt-1">
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {lead.email}
                </a>
              ) : (
                '—'
              )}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">WhatsApp</label>
            <p className="text-gray-900 dark:text-white font-medium mt-1">
              {lead.whatsapp_number ? (
                <a
                  href={`https://wa.me/${lead.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline"
                >
                  {lead.whatsapp_number}
                </a>
              ) : (
                '—'
              )}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Valor Estimado</label>
            <p className="text-gray-900 dark:text-white font-medium mt-1">
              {lead.value_estimate ? `R$ ${lead.value_estimate.toLocaleString('pt-BR')}` : '—'}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Próxima Ação</label>
            <p className="text-gray-900 dark:text-white font-medium mt-1">{lead.next_action || '—'}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
            <p className="text-gray-900 dark:text-white font-medium mt-1 capitalize">{lead.status || '—'}</p>
          </div>

          {lead.created_at && (
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Criado em</label>
              <p className="text-gray-900 dark:text-white font-medium mt-1">
                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-medium text-sm transition flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}