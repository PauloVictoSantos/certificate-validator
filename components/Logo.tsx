import { ShieldCheck } from 'lucide-react'

export function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
        <ShieldCheck className="h-4 w-4" />
      </div>
      {!compacto && (
        <span className="text-base font-semibold text-foreground">
          verifica<span className="text-blue-600">.</span>
        </span>
      )}
    </div>
  )
}