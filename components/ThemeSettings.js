'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeSettings() {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeValue) => {
    const html = document.documentElement
    
    if (themeValue === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    localStorage.setItem('theme', themeValue)
    setTheme(themeValue)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
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