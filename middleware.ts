import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_SESSAO, verificarToken } from '@/lib/sessao'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin/login')) return NextResponse.next()

  const token = req.cookies.get(COOKIE_SESSAO)?.value
  if (await verificarToken(token)) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  url.search = token ? '?expirou=1' : '' // cookie presente mas invalido/expirado
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/admin/:path*'] }
