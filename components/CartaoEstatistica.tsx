import type { ReactNode } from 'react'

type Props = { rotulo: string; valor: number; icone: ReactNode }

export function CartaoEstatistica({ rotulo, valor, icone }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{rotulo}</span>
        <span className="text-muted-foreground">{icone}</span>
      </div>
      <strong className="mt-2 block text-2xl font-bold text-foreground">
        {valor.toLocaleString('pt-BR')}
      </strong>
    </div>
  )
} 