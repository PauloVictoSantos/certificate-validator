import type { ReactNode } from 'react'
import { CabecalhoPublico } from './CabecalhoPublico'
import { Logo } from './Logo'

export function LayoutPublico({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <CabecalhoPublico />
      {children}
      <footer className="mt-auto flex items-center justify-center gap-3 border-t border-border py-8 text-sm text-muted-foreground">
        <Logo compacto />
        <span>Validação simples para conquistas importantes.</span>
      </footer>
    </main>
  )
}