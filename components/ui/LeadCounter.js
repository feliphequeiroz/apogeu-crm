'use client'

/**
 * LeadCounter
 * 
 * Componente que exibe a quantidade de leads na etapa atual
 * Posicionado FIXO acima do BottomNavigation
 * 
 * PROPS:
 * - count: número inteiro de leads filtrados
 * 
 * POSICIONAMENTO:
 * - fixed bottom-20 (80px do bottom)
 * - z-30 (abaixo de FAB z-40)
 * - acima de BottomNavigation (~70px)
 * - pointer-events-none (não interfere com cliques)
 * 
 * USADO EM:
 * - KanbanBoardMobile
 */
export default function LeadCounter({ count }) {
  return (
    <div className="fixed bottom-20 left-0 right-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400 z-30 pointer-events-none">
      {count} {count === 1 ? 'lead' : 'leads'} nessa etapa
    </div>
  )
}