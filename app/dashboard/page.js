'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { LogOut, Loader } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, mounted, router])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border-color">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Apogeu CRM</h1>
            <p className="text-sm text-text-secondary">Dashboard</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Bem-vindo! 👋</h2>
          <p className="text-text-secondary mb-6">
            Email: <strong>{user.email}</strong>
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-primary-light rounded-lg">
              <h3 className="font-semibold text-primary mb-2">✨ Próximo passo</h3>
              <p className="text-sm text-text-secondary">
                Estamos construindo o Kanban de Leads aqui. Em breve você poderá:
              </p>
              <ul className="text-sm text-text-secondary mt-2 space-y-1 ml-4">
                <li>📊 Ver todos seus leads em um kanban</li>
                <li>💬 Acessar histórico de conversas</li>
                <li>✅ Gerenciar follow-ups automáticos</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary-light to-white p-6 rounded-lg border border-primary-light">
                <div className="text-3xl mb-2">📊</div>
                <p className="font-semibold text-text-primary">0 Leads</p>
                <p className="text-sm text-text-secondary">Total de prospects</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-200">
                <div className="text-3xl mb-2">🔄</div>
                <p className="font-semibold text-text-primary">0 Em progresso</p>
                <p className="text-sm text-text-secondary">Status consultoria</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-200">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-semibold text-text-primary">0 Clientes</p>
                <p className="text-sm text-text-secondary">Vendas fechadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
