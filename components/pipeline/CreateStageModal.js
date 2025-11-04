'use client'

import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { createPipelineStage } from '@/lib/pipeline/actions'
import { pipelineColors } from '@/lib/pipeline/constants'

export default function CreateStageModal({ isOpen, onClose, userId, onStageCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: 'blue', // Default color
    position: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

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

    if (!formData.name.trim()) {
      setError('Nome do estágio é obrigatório.')
      setLoading(false)
      return
    }

    try {
      const { data, error: createError } = await createPipelineStage({
        ...formData,
        user_id: userId,
        is_visible: true, // Default to visible
      })

      if (createError) {
        setError(createError.message)
      } else if (data) {
        onStageCreated(data)
        setFormData({
          name: '',
          icon: '',
          color: 'blue',
          position: 0,
        })
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar estágio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Adicionar Novo Estágio
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              <p>{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Nome do Estágio *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Ícone (Emoji)</label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Ex: 🎯, ✓, 🔍"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Cor</label>
            <select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            >
              {Object.entries(pipelineColors).map(([colorName, color]) => (
                <option key={colorName} value={colorName} style={{ backgroundColor: color.hex }}>
                  {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Posição (0 para o início)</label>
            <input
              type="number"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              disabled={loading}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <><Loader className="w-4 h-4 animate-spin" /> Criando...</>
              ) : (
                'Criar Estágio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
