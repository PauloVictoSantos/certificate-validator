'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'
import { normalizarCodigo } from '@/lib/codigo'

export function FormularioBuscaCodigo() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')

  function enviar(e: FormEvent) {
    e.preventDefault()
    const normalizado = normalizarCodigo(codigo)
    if (normalizado.length < 6) {
      setErro('Digite pelo menos 6 caracteres do código.')
      return
    }
    setErro('')
    router.push(`/validar/${encodeURIComponent(normalizado)}`)
  }

  return (
    <form
      className="mt-8 w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm"
      onSubmit={enviar}
    >
      <label htmlFor="certificate-code" className="text-sm font-medium text-foreground">
        Digite o código do certificado
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-input bg-white px-3 py-2.5">
          <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            id="certificate-code"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder="Ex: A8F3D2E1"
            autoComplete="off"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Validar <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {erro && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {erro}
        </p>
      )}

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" /> A consulta é pública e protegida
      </p>
    </form>
  )
}