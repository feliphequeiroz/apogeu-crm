'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para detectar se o layout é mobile ou desktop
 * 
 * Breakpoint: 768px (padrão Tailwind md:)
 * 
 * @returns {boolean} true se mobile (<768px), false se desktop (≥768px)
 * 
 * Uso:
 * const isMobile = useResponsive()
 * 
 * if (isMobile) {
 *   return <MobileLayout>...</MobileLayout>
 * }
 * return <DesktopLayout>...</DesktopLayout>
 */
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Define inicial (evita hydration mismatch)
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()

    // Listen resize
    const handleResize = () => checkMobile()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Retorna false enquanto não monta (evita layout shift)
  if (!mounted) return false

  return isMobile
}