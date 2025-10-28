'use client'

import { X, Edit2 } from 'lucide-react'

export default function LeadModal({ lead, onClose, onEdit }) {
  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary dark:bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
              {getInitials(lead.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{lead.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">EMAIL</p>
            <p className="text-sm text-gray-900 dark:text-white">{lead.email || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">TELEFONE</p>
            <p className="text-sm text-gray-900 dark:text-white">{lead.phone || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">VALOR</p>
            <p className="text-lg font-bold text-primary dark:text-blue-400">R$ {lead.value?.toLocaleString('pt-BR') || '0'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">PRÓXIMA AÇÃO</p>
            <p className="text-sm text-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-amber-900 p-2 rounded">{lead.nextTask || 'Nenhuma'}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose()
              onEdit()
            }}
            className="flex-1 px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary-hover dark:hover:bg-blue-700 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}