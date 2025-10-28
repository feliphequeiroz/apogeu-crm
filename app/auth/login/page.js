'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/useAuth'
import { Mail, Lock, Loader } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Conta criada com sucesso! Faça login agora.')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Preencha email e senha')
      return
    }

    setLoading(true)
    const { data, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">
            Fazer Login
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Acesse seu Apogeu CRM
          </p>

          {/* Sucesso */}
          {success && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <div className="flex items-center border border-border-color rounded-lg px-4 py-3">
                <Mail className="w-5 h-5 text-text-secondary mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="flex-1 outline-none bg-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Senha
              </label>
              <div className="flex items-center border border-border-color rounded-lg px-4 py-3">
                <Lock className="w-5 h-5 text-text-secondary mr-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="flex-1 outline-none bg-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Fazer Login'
              )}
            </button>
          </form>

          {/* Link para signup */}
          <div className="mt-6 text-center">
            <span className="text-text-secondary">Não tem conta? </span>
            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
              Criar conta
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-primary-light">
            <p className="text-xs text-text-secondary font-semibold mb-2">🧪 Teste com:</p>
            <p className="text-xs text-text-primary">Email: <code className="bg-white px-2 py-1 rounded">test@apogeu.com</code></p>
            <p className="text-xs text-text-primary">Senha: <code className="bg-white px-2 py-1 rounded">123456</code></p>
          </div>
        </div>
      </div>
    </main>
  )
}
