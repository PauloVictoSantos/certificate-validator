import { LayoutPublico } from '@/components/LayoutPublico'
import { FormularioBuscaCodigo } from '@/components/FormularioBuscaCodigo'
import { HeroVisual } from '@/components/HeroVisual'
import { PassosComoFunciona } from '@/components/PassosComoFunciona'

export default function PaginaValidar() {
  return (
    <LayoutPublico>
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-red-500">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            VALIDAÇÃO OFICIAL DE CERTIFICADOS
          </div>

          <h1 className="mt-4 text-5xl font-bold leading-[1.1] text-foreground">
            Seu aprendizado
            <br />
            <em className="font-serif italic text-blue-600">merece ser reconhecido.</em>
          </h1>

          <p className="mt-5 max-w-md text-base text-muted-foreground">
            Confirme a autenticidade de um certificado de forma rápida, segura e transparente.
          </p>

          <FormularioBuscaCodigo />
        </div>

        <HeroVisual />
      </section>

      <PassosComoFunciona />
    </LayoutPublico>
  )
}