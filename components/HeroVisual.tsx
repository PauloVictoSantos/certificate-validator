import { BadgeCheck, ClipboardCheck, ShieldCheck } from 'lucide-react'

type Props = { nome?: string; curso?: string; data?: string }

export function HeroVisual({ nome = 'Nome do aluno', curso = 'Nome do curso', data = '' }: Props) {
  return (
    <div className="relative flex items-center justify-center py-12">
      <div className="absolute h-105 w-105 rounded-full border border-border/60" />
      <div className="absolute h-80 w-[320px] rounded-full border border-border/60" />

      <div className="relative z-10 w-[320px] rotate-3 rounded-2xl border border-border bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold tracking-widest text-muted-foreground">
            VERIFICA
          </span>
        </div>

        <div className="mt-4 h-0.5 w-10 bg-blue-600" />

        <div className="mt-4 text-lg leading-tight text-foreground">
          Certificado de
          <br />
          <strong className="font-semibold">conclusão</strong>
        </div>

        <div className="mt-5 text-[10px] font-medium tracking-widest text-muted-foreground">
          CERTIFICAMOS QUE
        </div>
        <div className="mt-1 text-xl font-semibold text-blue-700">{nome}</div>

        <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
          concluiu com êxito o curso de
          <br />
          <strong className="font-medium text-foreground">{curso}</strong>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{data}</span>
          <span className="text-sm text-blue-700">Verifica</span>
        </div>
      </div>

      <div className="absolute right-2 top-6 z-20 flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-md">
        <BadgeCheck className="h-4 w-4 text-blue-600" />
        <span className="flex flex-col leading-tight">
          <b className="text-xs font-semibold text-foreground">Autenticidade</b>
          <small className="text-[10px] text-muted-foreground">confirmada</small>
        </span>
      </div>

      <div className="absolute bottom-10 left-0 z-20 flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-md">
        <ClipboardCheck className="h-4 w-4 text-blue-600" />
        <span className="flex flex-col leading-tight">
          <b className="text-xs font-semibold text-foreground">Dados protegidos</b>
          <small className="text-[10px] text-muted-foreground">consulta segura</small>
        </span>
      </div>
    </div>
  )
}