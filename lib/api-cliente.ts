export class ErroApi extends Error {
  constructor(mensagem: string, public status: number) {
    super(mensagem)
  }
}

export function mensagemDeErro(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro inesperado. Tente novamente.'
}

/**
 * fetch com cookies. Um 401 fora da tela de login redireciona para
 * /admin/login?expirou=1.
 */
export async function chamarApi<T>(
  url: string,
  init: RequestInit = {},
  { redirecionarSe401 = true } = {},
): Promise<T> {
  const resposta = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  const dados = await resposta.json().catch(() => null)

  if (resposta.status === 401 && redirecionarSe401 && typeof window !== 'undefined') {
    window.location.href = '/admin/login?expirou=1'
    throw new ErroApi('Sessão expirada', 401)
  }
  if (!resposta.ok) throw new ErroApi(dados?.erro ?? 'Erro inesperado', resposta.status)
  return dados as T
}
