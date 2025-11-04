'use client'

import { useState } from 'react'
import { X, Loader, Trash2 } from 'lucide-react'
import { deletePipelineStage } from '@/lib/pipeline/actions'
import { reassignLeadsInStage } from '@/lib/leads/actions'

export default function DeleteStageModal({ isOpen, onClose, stage, stages, onStageDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [moveToStageId, setMoveToStageId] = useState('')

  if (!isOpen || !stage) return null

  const otherStages = stages.filter((s) => s.id !== stage.id)

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    if (otherStages.length > 0 && !moveToStageId) {
      setError('Por favor, selecione um estágio para mover os leads existentes.')
      setLoading(false)
      return
    }

    try {
      // If there are other stages and a target stage is selected, reassign leads
      if (otherStages.length > 0 && moveToStageId) {
        const newStage = stages.find((s) => s.id === moveToStageId)
        if (!newStage) {
          setError('Estágio de destino não encontrado.')
          setLoading(false)
          return
        }

        const { error: reassignError } = await reassignLeadsInStage(
          stage.name,
          newStage.name,
          stage.user_id
        )
        if (reassignError) {
          setError(reassignError.message)
          setLoading(false)
          return
        }
      }

      const { error: deleteError } = await deletePipelineStage(stage.id)

      if (deleteError) {
        setError(deleteError.message)
      } else {
        onStageDeleted(stage.id)
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Erro ao deletar estágio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Excluir Estágio: {stage.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              <p>{error}</p>
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Você está prestes a excluir o estágio "{stage.name}". Esta ação não pode ser desfeita.
          </p>

          {otherStages.length > 0 && (
            <div>
              <label htmlFor="moveToStage" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Existem leads neste estágio. Para onde eles devem ser movidos?
              </label>
              <select
                id="moveToStage"
                name="moveToStage"
                value={moveToStageId}
                onChange={(e) => setMoveToStageId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={loading}
              >
                <option value="">Selecione um estágio</option>
                {otherStages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {otherStages.length === 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Não há leads neste estágio para serem movidos.
            </p>
          )}
        </div>

        {/* Footer - Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <><Loader className="w-4 h-4 animate-spin" /> Excluindo...</>
            ) : (
              'Confirmar Exclusão'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
