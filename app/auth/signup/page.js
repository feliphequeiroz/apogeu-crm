'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/useAuth'
import { Mail, Lock, Loader } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('Preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      setError('Senhas não conferem')
      return
    }

    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)
    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError(signUpError)
      setLoading(false)
    } else {
      router.push('/auth/login?registered=true')
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
            Criar Conta
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Junte-se ao Apogeu CRM
          </p>

          {/* Mensagem de sucesso */}
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg hidden">
            Conta criada! Verifique seu email.
          </div>

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
                  placeholder="Mínimo 6 caracteres"
                  className="flex-1 outline-none bg-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Confirmar Senha
              </label>
              <div className="flex items-center border border-border-color rounded-lg px-4 py-3">
                <Lock className="w-5 h-5 text-text-secondary mr-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
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
                  Criando...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Link para login */}
          <div className="mt-6 text-center">
            <span className="text-text-secondary">Já tem conta? </span>
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
