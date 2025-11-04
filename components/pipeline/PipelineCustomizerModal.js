'use client'

import { useEffect, useState } from 'react'
import { X, Loader } from 'lucide-react'
import { getPipelineStages } from '@/lib/pipeline/actions'
import { useAuth } from '@/lib/auth/useAuth'
import CreateStageModal from './CreateStageModal'
import EditStageModal from './EditStageModal'
import DeleteStageModal from './DeleteStageModal'
import { pipelineColors } from '@/lib/pipeline/constants'

export default function PipelineCustomizerModal({ isOpen, onClose }) {
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateStageModal, setShowCreateStageModal] = useState(false)
  const [showEditStageModal, setShowEditStageModal] = useState(false)
  const [showDeleteStageModal, setShowDeleteStageModal] = useState(false)
  const [selectedStageToEdit, setSelectedStageToEdit] = useState(null)
  const [selectedStageToDelete, setSelectedStageToDelete] = useState(null)
  const { user } = useAuth()

  const handleStageCreated = (newStage) => {
    setStages((prevStages) => [...prevStages, newStage].sort((a, b) => a.position - b.position))
    setShowCreateStageModal(false)
  }

  const handleStageUpdated = (updatedStage) => {
    setStages((prevStages) =>
      prevStages.map((stage) => (stage.id === updatedStage.id ? updatedStage : stage)).sort((a, b) => a.position - b.position)
    )
    setShowEditStageModal(false)
    setSelectedStageToEdit(null)
  }

  const handleStageDeleted = (deletedStageId) => {
    setStages((prevStages) => prevStages.filter((stage) => stage.id !== deletedStageId))
    setShowDeleteStageModal(false)
    setSelectedStageToDelete(null)
  }

  useEffect(() => {
    if (isOpen && user?.id) {
      const fetchStages = async () => {
        setLoading(true)
        setError(null)
        const { data, error } = await getPipelineStages(user.id)
        if (error) {
          setError(error.message)
          setStages([])
        } else {
          setStages(data)
        }
        setLoading(false)
      }
      fetchStages()
    }
  }, [isOpen, user?.id])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Pipeline Customizer
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              <p>Erro ao carregar estágios: {error}</p>
            </div>
          )}

          {!loading && !error && stages.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-semibold">Nenhum estágio encontrado.</p>
              <p className="text-sm">Comece adicionando um novo estágio ao seu pipeline.</p>
            </div>
          )}

          {!loading && !error && stages.length > 0 && (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-2 border-b border-gray-200 dark:border-gray-700">
                <div>#</div>
                <div>Ícone</div>
                <div>Nome</div>
                <div>Cor</div>
                <div className="text-right">Ações</div>
              </div>

              {/* Stages List */}
              {stages.map((stage) => (
                <div key={stage.id} className="grid grid-cols-5 gap-4 items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                  <div className="text-sm text-gray-900 dark:text-white">{stage.position + 1}</div>
                  <div className="text-lg">{stage.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{stage.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: pipelineColors[stage.color]?.hex || '#000000' }}></span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{stage.color}</span>
                  </div>
                  <div className="text-right">
                    {/* Action Buttons Placeholder */}
                    <button
                      onClick={() => {
                        setSelectedStageToEdit(stage)
                        setShowEditStageModal(true)
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStageToDelete(stage)
                        setShowDeleteStageModal(true)
                      }}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition ml-2"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (optional, for actions like "Save All" if needed) */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={() => setShowCreateStageModal(true)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
          >
            Adicionar Estágio
          </button>
        </div>
      </div>

      {/* Create Stage Modal */}
      {showCreateStageModal && (
        <CreateStageModal
          isOpen={showCreateStageModal}
          onClose={() => setShowCreateStageModal(false)}
          userId={user?.id}
          onStageCreated={handleStageCreated}
        />
      )}

      {/* Edit Stage Modal */}
      {showEditStageModal && selectedStageToEdit && (
        <EditStageModal
          isOpen={showEditStageModal}
          onClose={() => setShowEditStageModal(false)}
          stage={selectedStageToEdit}
          onStageUpdated={handleStageUpdated}
        />
      )}

      {/* Delete Stage Modal */}
      {showDeleteStageModal && selectedStageToDelete && (
        <DeleteStageModal
          isOpen={showDeleteStageModal}
          onClose={() => setShowDeleteStageModal(false)}
          stage={selectedStageToDelete}
          stages={stages}
          onStageDeleted={handleStageDeleted}
        />
      )}
    </div>
  )
}
