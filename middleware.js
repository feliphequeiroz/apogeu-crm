import { NextResponse } from 'next/server'

const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Permitir acesso às rotas protegidas por enquanto
  // A proteção real acontece no componente com useAuth()
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/leads/:path*'],
}