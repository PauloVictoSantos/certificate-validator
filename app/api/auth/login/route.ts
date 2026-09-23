import { createHash, timingSafeEqual } from 'crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_SESSAO, DURACAO_SESSAO_SEGUNDOS, criarToken } from '@/lib/sessao'
import { erro } from '@/lib/http'

const hash = (v: string) => createHash('sha256').update(v).digest()
const iguais = (a: string, b: string) => timingSafeEqual(hash(a), hash(b))

export async function POST(req: NextRequest) {
  const corpo = await req.json().catch(() => null)
  const usuario = corpo?.usuario
  const senha = corpo?.senha
  if (typeof usuario !== 'string' || typeof senha !== 'string') {
    return erro('Informe usuário e senha', 400)
  }

  const esperadoUsuario = process.env.ADMIN_USUARIO
  const esperadaSenha = process.env.ADMIN_SENHA
  if (!esperadoUsuario || !esperadaSenha) return erro('Login não configurado no servidor', 500)

  const usuarioOk = iguais(usuario, esperadoUsuario)
  const senhaOk = iguais(senha, esperadaSenha)
  if (!(usuarioOk && senhaOk)) return erro('Usuário ou senha inválidos', 401)

  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(COOKIE_SESSAO, await criarToken(usuario), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACAO_SESSAO_SEGUNDOS,
  })
  return resposta
}
