import { SignJWT, jwtVerify } from 'jose'

export const COOKIE_SESSAO = 'sessao'
export const DURACAO_SESSAO_SEGUNDOS = 12 * 60 * 60 // 12h

const chave = () => new TextEncoder().encode(process.env.SESSAO_SEGREDO ?? '')

export async function criarToken(usuario: string) {
  return new SignJWT({ usuario })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SESSAO_SEGUNDOS}s`)
    .sign(chave())
}

export async function verificarToken(token?: string) {
  if (!token || !process.env.SESSAO_SEGREDO) return null
  try {
    const { payload } = await jwtVerify(token, chave())
    return payload
  } catch {
    return null
  }
}
