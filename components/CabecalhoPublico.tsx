import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Logo } from './Logo'
import { AlternarTema } from './AlternarTema'

export function CabecalhoPublico() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
      <Logo />

      <nav className="flex items-center gap-6 text-sm font-medium text-foreground">
        <a href="/validar#como-funciona" className="text-muted-foreground hover:text-foreground">
          Como funciona
        </a>
        <Link
          href="/admin/login"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          Área administrativa <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>

      <AlternarTema />
    </header>
  )
}