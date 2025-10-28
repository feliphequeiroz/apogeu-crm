'use client'

import { X } from 'lucide-react'

export default function LeadModal({ lead, onClose }) {
  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
              {getInitials(lead.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{lead.name}</h2>
              <p className="text-text-secondary text-sm">{lead.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs text-text-secondary font-semibold">EMAIL</p>
            <p className="text-sm text-text-primary">{lead.email}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-semibold">TELEFONE</p>
            <p className="text-sm text-text-primary">{lead.phone}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-semibold">VALOR</p>
            <p className="text-lg font-bold text-primary">R$ {lead.value.toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-semibold">PRÓXIMA AÇÃO</p>
            <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded">{lead.nextTask}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold text-sm transition">
            Editar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 font-semibold text-sm transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
