import { NextResponse } from 'next/server'

const publicRoutes = ['/auth/login', '/auth/signup', '/']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar se tem cookie de sessão
  const session = request.cookies.get('sb-session')

  // Se não tem sessão e quer acessar rota protegida, redireciona para login
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/leads/:path*'],
}
