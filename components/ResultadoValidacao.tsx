import { BadgeCheck, X } from 'lucide-react'
import { formatarData } from '@/lib/formato'
import type { ResultadoValidacao as Resultado } from '@/lib/tipos'

export function ResultadoValidacao({ resultado }: { resultado: Resultado }) {
  if (resultado.valido) {
    const c = resultado.certificado
    return (
      <div className="mt-8 w-full max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <strong className="text-base font-semibold text-emerald-900">Certificado autêntico</strong>
        </div>

        <dl className="mt-4 divide-y divide-emerald-200/70 border-t border-emerald-200/70 text-sm">
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-emerald-700">Aluno</dt>
            <dd className="font-medium text-emerald-950">{c.nome_aluno}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-emerald-700">Curso</dt>
            <dd className="font-medium text-emerald-950">{c.curso}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-emerald-700">Carga horária</dt>
            <dd className="font-medium text-emerald-950">{c.carga_horaria} horas</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-emerald-700">Concluído em</dt>
            <dd className="font-medium text-emerald-950">{formatarData(c.data_conclusao)}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-emerald-700">Código</dt>
            <dd className="font-mono font-medium text-emerald-950">{c.codigo}</dd>
          </div>
        </dl>
      </div>
    )
  }

  if (resultado.motivo === 'revogado') {
    return (
      <div className="mt-8 flex w-full max-w-md items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
          <X className="h-5 w-5" />
        </div>
        <div>
          <strong className="block text-base font-semibold text-red-900">Certificado revogado</strong>
          <span className="mt-1 block text-sm text-red-700">
            O código {resultado.codigo} existe, mas este certificado não é mais válido.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 flex w-full max-w-md items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-white">
        <X className="h-5 w-5" />
      </div>
      <div>
        <strong className="block text-base font-semibold text-foreground">Código não encontrado</strong>
        <span className="mt-1 block text-sm text-muted-foreground">
          Confira o código informado e tente novamente.
        </span>
      </div>
    </div>
  )
}