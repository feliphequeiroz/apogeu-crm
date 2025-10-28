'use client'

import { Clock, Edit2 } from 'lucide-react'

export default function LeadCard({ card, stageKey, onDragStart, onClick, onEdit }) {
  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase()
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card, stageKey)}
      onClick={onClick}
      className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition cursor-grab active:cursor-grabbing border-l-4 border-primary group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {getInitials(card.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{card.name}</p>
            <p className="text-xs text-gray-600 truncate">{card.company}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition"
          title="Editar"
        >
          <Edit2 className="w-4 h-4 text-primary" />
        </button>
      </div>

      <div className="mb-2 p-1.5 bg-primary/10 rounded">
        <p className="text-xs font-bold text-primary">R$ {(card.value / 1000).toFixed(1)}k</p>
      </div>

      {card.nextTask && (
        <div className="mb-2 p-1.5 bg-amber-50 rounded border-l-2 border-amber-400">
          <p className="text-xs text-amber-800 font-semibold line-clamp-2">{card.nextTask}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{card.days === 0 ? 'Hoje' : `${card.days}d`}</span>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{card.status}</span>
      </div>
    </div>
  )
}
