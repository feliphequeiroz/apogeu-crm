'use client'

import { useState } from 'react'
import LeadCard from './LeadCard'
import LeadModal from './LeadModal'

export default function KanbanBoard({ searchTerm }) {
  const [selectedLead, setSelectedLead] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [draggedCard, setDraggedCard] = useState(null)

  const stages = [
    { key: 'lead', title: '📥 Lead Gerado', color: 'bg-blue-50', borderColor: 'border-blue-300' },
    { key: 'qualified', title: '✓ Qualificado', color: 'bg-cyan-50', borderColor: 'border-cyan-300' },
    { key: 'diagnostic', title: '🔍 Diagnóstico', color: 'bg-purple-50', borderColor: 'border-purple-300' },
    { key: 'proposal', title: '📋 Proposta', color: 'bg-orange-50', borderColor: 'border-orange-300' },
    { key: 'negotiation', title: '💬 Negociação', color: 'bg-yellow-50', borderColor: 'border-yellow-300' },
    { key: 'closed', title: '🤝 Fechado', color: 'bg-green-50', borderColor: 'border-green-300' },
  ]

  const [leads, setLeads] = useState({
    lead: [
      { id: 1, name: 'Ana Silva', company: 'Tech Solutions', days: 3, value: 5000, email: 'ana@tech.com', phone: '11987654321', nextTask: 'Ligar 28/07 17:00', status: 'Em andamento' },
      { id: 2, name: 'João Santos', company: 'Marketing Pro', days: 1, value: 8000, email: 'joao@marketing.com', phone: '11912345678', nextTask: 'Enviar material', status: 'Em andamento' },
    ],
    qualified: [
      { id: 3, name: 'Maria Costa', company: 'Acme Corp', days: 5, value: 12000, email: 'maria@acme.com', phone: '11998765432', nextTask: 'Agendar call', status: 'Em andamento' },
    ],
    diagnostic: [
      { id: 4, name: 'Carlos Mendes', company: 'StartupXYZ', days: 15, value: 15000, email: 'carlos@startup.com', phone: '11987123456', nextTask: 'Fazer diagnóstico', status: 'Em andamento' },
    ],
    proposal: [
      { id: 5, name: 'Lucia Oliveira', company: 'DigitalCo', days: 22, value: 10000, email: 'lucia@digital.com', phone: '11991234567', nextTask: 'Enviar proposta', status: 'Em andamento' },
    ],
    negotiation: [
      { id: 6, name: 'Pedro Alves', company: 'OldBiz Inc', days: 45, value: 3000, email: 'pedro@oldbiz.com', phone: '11988776655', nextTask: 'Negociar preço', status: 'Em discussão' },
    ],
    closed: [],
  })

  const handleDragStart = (e, card, fromStage) => {
    setDraggedCard({ card, fromStage })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, toStage) => {
    e.preventDefault()
    if (!draggedCard) return

    const { card, fromStage } = draggedCard

    if (fromStage !== toStage) {
      setLeads((prev) => ({
        ...prev,
        [fromStage]: prev[fromStage].filter((c) => c.id !== card.id),
        [toStage]: [...prev[toStage], card],
      }))
    }

    setDraggedCard(null)
  }

  const filteredLeads = (stageKey) => {
    return leads[stageKey].filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <>
      <div className="overflow-x-auto p-6">
        <div className="flex gap-6 min-w-max">
          {stages.map(({ key, title, color, borderColor }) => (
            <div
              key={key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, key)}
              className={`${color} rounded-lg border-2 ${borderColor} p-4 w-80 flex flex-col flex-shrink-0 min-h-96`}
            >
              {/* Stage Header */}
              <div className="mb-4 pb-4 border-b border-gray-300">
                <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
                <p className="text-xs text-gray-600 mt-1">
                  {filteredLeads(key).length} {filteredLeads(key).length === 1 ? 'lead' : 'leads'}
                </p>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {filteredLeads(key).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-xs">Vazio</p>
                  </div>
                ) : (
                  filteredLeads(key).map((card) => (
                    <LeadCard
                      key={card.id}
                      card={card}
                      stageKey={key}
                      onDragStart={handleDragStart}
                      onClick={() => {
                        setSelectedLead(card)
                        setShowModal(true)
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
