'use client'

import { X, Edit2, MessageCircle } from 'lucide-react'

/**
 * LeadModal - Modal de Visualização (Desktop Only)
 * 
 * Modal read-only para visualização rápida de leads no desktop.
 * Otimizado para fluxo: View → Edit (dois modais separados).
 * 
 * Features:
 * - Visualização sem edição
 * - Click no telefone abre WhatsApp
 * - Botão "Editar" fecha view e abre EditLeadModal
 * - ESC fecha modal
 * 
 * Mobile usa EditLeadModal com mode='view' (abordagem diferente)
 */
export default function LeadModal({ lead, onClose, onEdit }) {
  /**
   * Gera iniciais do nome (primeiro char de cada palavra)
   */
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) // Máximo 2 letras
  }

  /**
   * Abre WhatsApp em nova aba com número formatado
   * Adiciona +55 automaticamente se necessário
   */
  const openWhatsApp = (phone) => {
    if (!phone) return
    
    const cleaned = phone.replace(/\D/g, '')
    const number = cleaned.startsWith('55') ? cleaned : `55${cleaned}`
    
    window.open(
      `https://wa.me/${number}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-base font-bold shadow-lg">
              {getInitials(lead.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lead.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lead.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          {/* Email */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Email
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {lead.email || 'Não informado'}
            </p>
          </div>

          {/* Telefone com WhatsApp */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Telefone
            </p>
            {lead.phone ? (
              <button
                onClick={() => openWhatsApp(lead.phone)}
                className="group flex items-center gap-2 text-sm text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
                title="Abrir no WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="group-hover:underline">{lead.phone}</span>
              </button>
            ) : (
              <p className="text-sm text-gray-900 dark:text-white">
                Não informado
              </p>
            )}
          </div>

          {/* Valor */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Valor
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              R$ {lead.value?.toLocaleString('pt-BR') || '0'}
            </p>
          </div>

          {/* Próxima Ação */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Próxima Ação
            </p>
            <div className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/50 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
              {lead.nextTask || 'Nenhuma ação definida'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose()
              onEdit()
            }}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}