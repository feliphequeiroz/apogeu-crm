'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeSettings() {
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
    <div className="border-t border-gray-800 p-4">
      <button
        onClick={toggleTheme}
        className="w-full px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-3 text-sm transition"
      >
        {theme === 'light' ? (
          <>
            <Moon className="w-4 h-4" />
            <span>Modo Escuro</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            <span>Modo Claro</span>
          </>
        )}
      </button>
    </div>
  )
}