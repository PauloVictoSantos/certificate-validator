'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { chamarApi, mensagemDeErro } from '@/lib/api-cliente'

export function FormularioLogin({ expirou = false }: { expirou?: boolean }) {
  const router = useRouter()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()
    if (!usuario.trim() || !senha) {
      setErro('Informe usuário e senha.')
      return
    }
    setEnviando(true)
    setErro('')
    try {
      await chamarApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ usuario: usuario.trim(), senha }),
      }, { redirecionarSe401: false })
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setErro(mensagemDeErro(err))
      setEnviando(false)
    }
  }

  return (
    <>
      {expirou && (
        <p role="status" className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Sua sessão expirou. Entre novamente.
        </p>
      )}

      <form className="mt-6 w-full max-w-sm" onSubmit={entrar}>
        <label className="block text-sm font-medium text-foreground">
          Usuário
          <input
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            autoComplete="username"
            className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-blue-500"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-foreground">
          Senha
          <div className="mt-1.5 flex items-center rounded-xl border border-input bg-white px-3 py-2.5 focus-within:border-blue-500">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              autoComplete="current-password"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {mostrarSenha ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </label>

        {erro && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Entrando…' : <>Entrar <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <Link href="/validar" className="mt-6 block text-sm font-medium text-muted-foreground hover:text-foreground">
        ← Voltar para validação pública
      </Link>
    </>
  )
}