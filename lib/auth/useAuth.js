'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('🔍 Sessão verificada:', session?.user?.email || 'sem sessão')
        setUser(session?.user || null)
      } catch (error) {
        console.error('❌ Erro ao verificar auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('📢 Auth state changed:', event, session?.user?.email)
        setUser(session?.user || null)
        if (event === 'SIGNED_OUT') {
          router.push('/auth/login')
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  const signUp = async (email, password) => {
    try {
      console.log('📝 Tentando signup:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      console.log('✅ Signup sucesso')
      return { data, error: null }
    } catch (error) {
      console.error('❌ Erro signup:', error.message)
      return { data: null, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      console.log('🔐 Tentando signin:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      console.log('✅ Signin sucesso, redirecionando...')
      return { data, error: null }
    } catch (error) {
      console.error('❌ Erro signin:', error.message)
      return { data: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
