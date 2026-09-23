import { Sparkles } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { FormularioLogin } from '@/components/FormularioLogin'

export default async function PaginaLogin({ searchParams }: { searchParams: Promise<{ expirou?: string }> }) {
  const { expirou } = await searchParams

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-16">
        <Logo />

        <div className="flex flex-col items-start">

          <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-foreground">
            Bem-vindo
            <br />
            <em className="font-serif italic text-blue-600">de volta.</em>
          </h1>

          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Entre para gerenciar certificados e códigos de validação.
          </p>

          <FormularioLogin expirou={expirou === '1'} />
        </div>

        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Verifica. Todos os direitos reservados.
        </span>
      </div>

      <div className="relative hidden overflow-hidden bg-neutral-950 lg:flex lg:items-center lg:justify-center">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 max-w-sm px-10 text-center text-white">
          <Sparkles className="mx-auto h-6 w-6 text-blue-400" />
          <p className="mt-4 font-serif text-xl italic leading-snug">
            "A confiança começa
            <br />
            com a transparência."
          </p>
          <span className="mt-3 block text-sm text-white/60">— Equipe Verifica</span>
        </div>
      </div>
    </main>
  )
}