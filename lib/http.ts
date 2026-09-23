import 'server-only'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { COOKIE_SESSAO, verificarToken } from './sessao'

export const erro = (mensagem: string, status: number) =>
  NextResponse.json({ erro: mensagem }, { status })

export const naoAutorizado = () => erro('Sessão expirada ou ausente', 401)

export async function sessaoAtiva(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_SESSAO)?.value
  return !!(await verificarToken(token))
}
