'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader } from 'lucide-react'

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extrair tokens do hash da URL
        // URL vem assim: #access_token=xxx&refresh_token=yyy&...
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)

        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        console.log('Access Token:', accessToken ? 'encontrado' : 'não encontrado')
        console.log('Refresh Token:', refreshToken ? 'encontrado' : 'não encontrado')

        if (accessToken && refreshToken) {
          // Criar sessão com os tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error('Erro ao criar sessão:', sessionError)
            setError(sessionError.message)
            setLoading(false)
            return
          }

          // Sessão criada com sucesso
          console.log('Sessão criada com sucesso')
          
          // Redirecionar para dashboard após 1 segundo
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        } else {
          console.error('Tokens não encontrados. Hash:', hash)
          setError('Tokens não encontrados na URL. Tente fazer login novamente.')
          setLoading(false)
        }
      } catch (err) {
        console.error('Erro no callback:', err)
        setError(err.message || 'Erro ao processar callback')
        setLoading(false)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <a
            href="/auth/signup"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition"
          >
            Tentar Novamente
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Confirmando email...
        </h1>
        <p className="text-text-secondary">
          Você será redirecionado em breve.
        </p>
      </div>
    </div>
  )
}