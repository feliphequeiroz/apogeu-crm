'use client'

/**
 * BottomNavigation
 * 
 * ALTURA REAL: ~70px
 * 
 * ABAS:
 * 1. Dashboard (📊)
 * 2. Leads (👥)
 * 3. Tasks (✓)
 * 4. Busca (🔍) ← Abre SearchModal
 * 5. Mais (⋯) ← Abre MoreModal
 * 
 * CALLBACKS:
 * - onSearchClick: abre modal bottom de busca
 * - onMoreClick: abre modal bottom "Em breve"
 * - onTasksClick: abre modal bottom "Tasks em breve"
 */
export default function BottomNavigation({ 
  activeTab, 
  setActiveTab,
  onSearchClick,
  onMoreClick,
  onTasksClick,
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'leads', label: 'Leads', icon: '👥' },
    { id: 'tasks', label: 'Tasks', icon: '✓' },
    { id: 'search', label: 'Busca', icon: '🔍' },
    { id: 'more', label: 'Mais', icon: '⋯' },
  ]

  const handleTabClick = (tabId) => {
    // Busca abre modal, não muda aba
    if (tabId === 'search') {
      onSearchClick()
      return
    }

    // Mais abre modal, não muda aba
    if (tabId === 'more') {
      onMoreClick()
      return
    }

    // Tasks abre modal, não muda aba
    if (tabId === 'tasks') {
      onTasksClick()
      return
    }

    setActiveTab(tabId)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex justify-around sticky bottom-0 z-40 flex-shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition ${
            tab.id === 'search' || tab.id === 'more' || tab.id === 'tasks'
              ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              : activeTab === tab.id
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          aria-label={tab.label}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          title={tab.label}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}