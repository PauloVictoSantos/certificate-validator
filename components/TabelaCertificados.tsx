'use client'

import { ArrowRight, Search } from 'lucide-react'
import { BadgeStatus } from './BadgeStatus'
import { formatarData, iniciais } from '@/lib/formato'
import type { Certificado, Curso, FiltrosLista } from '@/lib/tipos'

type Props = {
  certificados: Certificado[]
  total: number
  pagina: number
  porPagina: number
  cursos: Curso[]
  filtros: FiltrosLista
  carregando: boolean
  aoMudarFiltros: (parcial: Partial<FiltrosLista>) => void
  aoMudarPagina: (pagina: number) => void
  aoRevogar: (certificado: Certificado) => void
}

export function TabelaCertificados(p: Props) {
  const totalPaginas = Math.max(1, Math.ceil(p.total / p.porPagina))

  return (
    <section className="rounded-2xl border border-border bg-white p-6">
      <div>
        <span className="text-xs font-semibold tracking-widest text-blue-600">REGISTROS RECENTES</span>
        <h2 className="mt-1 text-lg font-semibold text-foreground">Certificados emitidos</h2>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border border-input bg-white px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            placeholder="Buscar por nome ou código"
            value={p.filtros.busca}
            onChange={e => p.aoMudarFiltros({ busca: e.target.value })}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <select
          aria-label="Filtrar por curso"
          value={p.filtros.cursoId}
          onChange={e => p.aoMudarFiltros({ cursoId: e.target.value })}
          className="rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground outline-none"
        >
          <option value="">Todos os cursos</option>
          {p.cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>

        <select
          aria-label="Filtrar por status"
          value={p.filtros.status}
          onChange={e => p.aoMudarFiltros({ status: e.target.value as FiltrosLista['status'] })}
          className="rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground outline-none"
        >
          <option value="">Todos os status</option>
          <option value="valido">Válidos</option>
          <option value="revogado">Revogados</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Código</th>
              <th className="py-2 pr-4 font-medium">Aluno</th>
              <th className="py-2 pr-4 font-medium">Curso</th>
              <th className="py-2 pr-4 font-medium">Conclusão</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            {p.certificados.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  {p.carregando ? 'Carregando…' : 'Nenhum certificado encontrado.'}
                </td>
              </tr>
            )}
            {p.certificados.map(c => (
              <tr key={c.codigo} className="border-b border-border last:border-0">
                <td className="py-3 pr-4">
                  <code className="text-xs font-semibold text-foreground">{c.codigo}</code>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {iniciais(c.nome_aluno)}
                    </div>
                    {c.nome_aluno}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="block text-foreground">{c.curso}</span>
                  <small className="text-muted-foreground">{c.carga_horaria} horas</small>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{formatarData(c.data_conclusao)}</td>
                <td className="py-3 pr-4"><BadgeStatus status={c.status} /></td>
                <td className="py-3 pr-4 text-right">
                  {c.status === 'valido' && (
                    <button
                      onClick={() => p.aoRevogar(c)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Revogar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          disabled={p.pagina <= 1}
          onClick={() => p.aoMudarPagina(p.pagina - 1)}
          className="font-medium text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="text-muted-foreground">
          Página {p.pagina} de {totalPaginas} · {p.total} registros
        </span>
        <button
          disabled={p.pagina >= totalPaginas}
          onClick={() => p.aoMudarPagina(p.pagina + 1)}
          className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}