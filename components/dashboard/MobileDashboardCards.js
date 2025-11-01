'use client'

/**
 * MobileDashboardCards
 * 
 * Exibe métricas do dashboard em layout mobile
 * Estrutura de scroll corrigida
 */
export default function MobileDashboardCards({ leads }) {
  const totalLeads = Object.values(leads).reduce((sum, stage) => sum + stage.length, 0)
  const qualifiedLeads = leads.qualified?.length || 0
  const negotiationLeads = leads.negotiation?.length || 0
  const closedLeads = leads.closed?.length || 0

  const totalValue = Object.values(leads)
    .flat()
    .reduce((sum, lead) => sum + (lead.value || 0), 0)

  const cards = [
    {
      id: 'total',
      label: 'Total de Leads',
      value: totalLeads,
      icon: '📊',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'qualified',
      label: 'Qualificados',
      value: qualifiedLeads,
      icon: '✅',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 'negotiation',
      label: 'Em Negociação',
      value: negotiationLeads,
      icon: '💬',
      color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      id: 'closed',
      label: 'Fechados',
      value: closedLeads,
      icon: '🤝',
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header - Não scrollável */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visão geral de leads e métricas
        </p>
      </div>

      {/* Content - Scrollável com min-h-0 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-3 pb-24">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-lg border ${card.color} transition hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold ${card.textColor} mt-2`}>
                    {card.value}
                  </p>
                </div>
                <span className="text-3xl opacity-60">{card.icon}</span>
              </div>
            </div>
          ))}

          {/* Total Value Card */}
          <div className="p-4 rounded-lg border bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Valor Total Estimado
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                  }).format(totalValue)}
                </p>
              </div>
              <span className="text-3xl opacity-60">💰</span>
            </div>
          </div>

          {/* Stages Breakdown */}
          <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 mt-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Distribuição por Etapa
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">🔥 Lead</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {leads.lead?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">✓ Qualificado</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {leads.qualified?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">🔍 Diagnóstico</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {leads.diagnostic?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">📋 Proposta</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {leads.proposal?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">💬 Negociação</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {leads.negotiation?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">🤝 Fechado</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {leads.closed?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}