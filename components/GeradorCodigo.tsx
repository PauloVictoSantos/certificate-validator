'use client'

import { useState } from 'react'
import { Copy, Sparkles } from 'lucide-react'
import { chamarApi, mensagemDeErro } from '@/lib/api-cliente'

type Props = {
  codigo: string
  aoGerar: (codigo: string) => void
  aoAvisar: (texto: string, erro?: boolean) => void
}

export function GeradorCodigo({ codigo, aoGerar, aoAvisar }: Props) {
  const [gerando, setGerando] = useState(false)

  async function gerar() {
    setGerando(true)
    try {
      const { codigo: novo } = await chamarApi<{ codigo: string }>('/api/certificados/gerar-codigo')
      aoGerar(novo)
      aoAvisar('Código gerado')
    } catch (e) {
      aoAvisar(mensagemDeErro(e), true)
    } finally {
      setGerando(false)
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      aoAvisar('Código copiado')
    } catch {
      aoAvisar('Não foi possível copiar', true)
    }
  }

  return (
    <label className="block text-sm font-medium text-foreground">
      Código <span className="font-normal text-muted-foreground">(opcional)</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-input bg-white px-3 py-2.5 focus-within:border-blue-500">
        <input
          value={codigo}
          onChange={e => aoGerar(e.target.value.toUpperCase())}
          placeholder="Ex: A8F3D2E1"
          autoComplete="off"
          className="flex-1 bg-transparent font-mono text-sm tracking-wider text-foreground outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground"
        />

        {codigo && (
          <button
            type="button"
            aria-label="Copiar código"
            title="Copiar código"
            onClick={copiar}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          aria-label="Gerar código"
          title="Gerar código aleatório"
          onClick={gerar}
          disabled={gerando}
          className="shrink-0 text-muted-foreground hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className={`h-4 w-4 ${gerando ? 'animate-pulse' : ''}`} />
        </button>
      </div>
    </label>
  )
}