'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, BarChart3, Check, ClipboardCheck, FileCheck2, LogOut, X } from 'lucide-react'
import { Logo } from './Logo'
import { AlternarTema } from './AlternarTema'
import { CartaoEstatistica } from './CartaoEstatistica'
import { FormularioEmissao } from './FormularioEmissao'
import { TabelaCertificados } from './TabelaCertificados'
import { chamarApi, mensagemDeErro } from '@/lib/api-cliente'
import type { Certificado, Curso, FiltrosLista, RespostaLista } from '@/lib/tipos'

const POR_PAGINA = 10
const LISTA_VAZIA: RespostaLista = { certificados: [], total: 0, resumo: { total: 0, revogados: 0, no_mes: 0 } }

export function PainelAdmin() {
  const router = useRouter()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [lista, setLista] = useState<RespostaLista>(LISTA_VAZIA)
  const [filtros, setFiltros] = useState<FiltrosLista>({ busca: '', status: '', cursoId: '' })
  const [buscaAplicada, setBuscaAplicada] = useState('')
  const [pagina, setPagina] = useState(1)
  const [versao, setVersao] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [codigo, setCodigo] = useState('')
  const [aviso, setAviso] = useState<{ texto: string; erro: boolean } | null>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const avisar = useCallback((texto: string, erro = false) => {
    setAviso({ texto, erro })
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setAviso(null), 2400)
  }, [])

  useEffect(() => {
    chamarApi<{ cursos: Curso[] }>('/api/certificados')
      .then(r => setCursos(r.cursos))
      .catch(e => avisar(mensagemDeErro(e), true))
  }, [avisar])

  useEffect(() => {
    const t = setTimeout(() => { setBuscaAplicada(filtros.busca); setPagina(1) }, 300)
    return () => clearTimeout(t)
  }, [filtros.busca])

  useEffect(() => {
    const params = new URLSearchParams({ lista: '1', pagina: String(pagina) })
    if (buscaAplicada) params.set('busca', buscaAplicada)
    if (filtros.status) params.set('status', filtros.status)
    if (filtros.cursoId) params.set('curso_id', filtros.cursoId)

    setCarregando(true)
    chamarApi<RespostaLista>(`/api/certificados?${params}`)
      .then(setLista)
      .catch(e => avisar(mensagemDeErro(e), true))
      .finally(() => setCarregando(false))
  }, [pagina, buscaAplicada, filtros.status, filtros.cursoId, versao, avisar])

  function mudarFiltros(parcial: Partial<FiltrosLista>) {
    setFiltros(f => ({ ...f, ...parcial }))
    if (!('busca' in parcial)) setPagina(1)
  }

  function aoEmitir(emitido: string) {
    avisar(`Certificado ${emitido} emitido`)
    setCodigo('')
    setPagina(1)
    setVersao(v => v + 1)
  }

  async function revogar(c: Certificado) {
    if (!window.confirm(`Revogar o certificado ${c.codigo} de ${c.nome_aluno}? Esta ação não pode ser desfeita.`)) return
    try {
      await chamarApi(`/api/certificados/${c.codigo}`, { method: 'DELETE' })
      avisar('Certificado revogado')
      setVersao(v => v + 1)
    } catch (e) {
      avisar(mensagemDeErro(e), true)
    }
  }

  async function sair() {
    await chamarApi('/api/auth/logout', { method: 'POST' }, { redirecionarSe401: false }).catch(() => null)
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen bg-secondary/40">
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-border bg-white px-5 py-6">
        <div>
          <Logo />
          <nav className="mt-8 flex flex-col gap-1">
            <a className="flex items-center gap-2.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              <BarChart3 className="h-4 w-4" /> Visão geral
            </a>
          </nav>
        </div>
        <div>

          <a href="#"
            onClick={e => { e.preventDefault(); sair() }}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sair
          </a>
        </div>
      </aside>

      <section className="flex-1 px-8 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Painel administrativo <span>/</span> Visão geral
            </div>
            <h1 className="mt-1 text-2xl font-bold text-foreground">Certificados</h1>
            <p className="mt-1 text-sm text-muted-foreground">Acompanhe suas emissões e revogações.</p>
          </div>
          <div className="flex items-center gap-3">
            <AlternarTema />
            <button
              onClick={sair}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CartaoEstatistica rotulo="Certificados emitidos" valor={lista.resumo.total} icone={<FileCheck2 />} />
          <CartaoEstatistica rotulo="Revogados" valor={lista.resumo.revogados} icone={<ClipboardCheck />} />
          <CartaoEstatistica rotulo="Emitidos neste mês" valor={lista.resumo.no_mes} icone={<BadgeCheck />} />
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-white p-6">
            <span className="text-xs font-semibold tracking-widest text-blue-600">EMISSÃO</span>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Novo certificado</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Preencha os dados do certificado. O código é opcional — deixe em branco para gerar automaticamente.
            </p>

            <FormularioEmissao
              cursos={cursos}
              codigo={codigo}
              aoMudarCodigo={setCodigo}
              aoEmitir={aoEmitir}
              aoAvisar={avisar}
            />
          </section>

          <TabelaCertificados
            certificados={lista.certificados}
            total={lista.total}
            pagina={pagina}
            porPagina={POR_PAGINA}
            cursos={cursos}
            filtros={filtros}
            carregando={carregando}
            aoMudarFiltros={mudarFiltros}
            aoMudarPagina={setPagina}
            aoRevogar={revogar}
          />
        </div>
      </section>

      {aviso && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${aviso.erro ? 'bg-red-600' : 'bg-neutral-900'
            }`}
        >
          {aviso.erro ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />} {aviso.texto}
        </div>
      )}
    </main>
  )
}