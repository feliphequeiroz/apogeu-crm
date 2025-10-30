'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '@/lib/auth/useAuth'

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsReady(true)
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (!isReady || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-600 rounded-lg">
            <span className="text-white text-2xl font-bold">A</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Apogeu CRM
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4">
            Gerencie seus leads, conversas e follow-ups em um só lugar
          </p>

          <div className="space-y-4 mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-700 transition"
              >
                Fazer Login
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              >
                Criar Conta
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Kanban de Leads</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organize seus prospects em colunas de status.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Histórico Integrado</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Todas as conversas em um só lugar.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Follow-ups</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nunca esqueça um próximo passo.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}