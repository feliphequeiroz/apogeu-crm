'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeSettings({ sidebarOpen = true }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 flex items-center gap-3 text-sm transition focus:outline-none"
    >
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {theme === 'light' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </div>
      <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
        sidebarOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
      }`}>
        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
      </span>
    </button>
  )
}