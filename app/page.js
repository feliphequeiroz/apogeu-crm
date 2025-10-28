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

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg">
            <span className="text-white text-2xl font-bold">A</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4">
            Apogeu CRM
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-4">
            Gerencie seus leads, conversas e follow-ups em um só lugar
          </p>

          {isReady && (
            <div className="space-y-4 mb-16">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition"
                >
                  Fazer Login
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary-light transition"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Kanban de Leads</h3>
              <p className="text-sm text-text-secondary">Organize seus prospects em colunas de status.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Histórico Integrado</h3>
              <p className="text-sm text-text-secondary">Todas as conversas em um só lugar.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Follow-ups</h3>
              <p className="text-sm text-text-secondary">Nunca esqueça um próximo passo.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
