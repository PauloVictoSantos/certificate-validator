import type { Metadata } from 'next'
import Link from 'next/link'
import { LayoutPublico } from '@/components/LayoutPublico'
import { ResultadoValidacao } from '@/components/ResultadoValidacao'
import { HeroVisual } from '@/components/HeroVisual'
import { buscarCertificado } from '@/lib/certificados'
import { formatarData } from '@/lib/formato'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Resultado da validação — Verifica', robots: { index: false } }

export default async function PaginaResultado({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params
  const resultado = await buscarCertificado(decodeURIComponent(codigo))
  const c = resultado.valido ? resultado.certificado : null

  return (
    <LayoutPublico>
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-red-500">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            RESULTADO DA VALIDAÇÃO
          </div>

          <h1 className="mt-4 text-5xl font-bold leading-[1.1] text-foreground">
            Consulta
            <br />
            <em className="font-serif italic text-blue-600">concluída.</em>
          </h1>

          <ResultadoValidacao resultado={resultado} />

          <Link
            href="/validar"
            className="mt-6 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Consultar outro código
          </Link>
        </div>

        <HeroVisual
          nome={c?.nome_aluno}
          curso={c?.curso}
          data={c ? formatarData(c.data_conclusao) : ''}
        />
      </section>
    </LayoutPublico>
  )
}