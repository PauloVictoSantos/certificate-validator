'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { GeradorCodigo } from './GeradorCodigo'
import { chamarApi, mensagemDeErro } from '@/lib/api-cliente'
import type { Curso } from '@/lib/tipos'

type Props = {
  cursos: Curso[]
  codigo: string
  aoMudarCodigo: (codigo: string) => void
  aoEmitir: (codigo: string) => void
  aoAvisar: (texto: string, erro?: boolean) => void
}

export function FormularioEmissao({ cursos, codigo, aoMudarCodigo, aoEmitir, aoAvisar }: Props) {
  const [nome, setNome] = useState('')
  const [cursoId, setCursoId] = useState('')
  const [data, setData] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function emitir(e: FormEvent) {
    e.preventDefault()
    const nomeLimpo = nome.trim()
    if (nomeLimpo.length < 2) return setErro('Informe o nome do aluno.')
    if (!cursoId) return setErro('Selecione um curso.')
    if (!data) return setErro('Informe a data de conclusão.')

    setEnviando(true)
    setErro('')
    try {
      const resposta = await chamarApi<{ codigo: string }>('/api/certificados', {
        method: 'POST',
        body: JSON.stringify({
          curso_id: Number(cursoId),
          nome_aluno: nomeLimpo,
          data_conclusao: data,
          ...(codigo ? { codigo } : {}),
        }),
      })
      setNome('')
      setCursoId('')
      setData('')
      aoEmitir(resposta.codigo)
    } catch (err) {
      setErro(mensagemDeErro(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="mt-5 flex flex-col gap-4" onSubmit={emitir}>
      <GeradorCodigo codigo={codigo} aoGerar={aoMudarCodigo} aoAvisar={aoAvisar} />

      <label className="block text-sm font-medium text-foreground">
        Nome do aluno
        <input
          placeholder="Ex: João da Silva"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-blue-500"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Curso
        <select
          value={cursoId}
          onChange={e => setCursoId(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-blue-500"
        >
          <option value="" disabled>Selecione um curso</option>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </label>

      <div className="flex items-end gap-3">
        <label className="flex-1 text-sm font-medium text-foreground">
          Data de conclusão
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={enviando}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Emitindo…' : <>Emitir <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-destructive">
          {erro}
        </p>
      )}
    </form>
  )
}