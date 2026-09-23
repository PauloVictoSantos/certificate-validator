import { NextResponse } from 'next/server'
import { erro, naoAutorizado, sessaoAtiva } from '@/lib/http'
import { reservarNovoCodigo } from '@/lib/codigo-servidor'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await sessaoAtiva())) return naoAutorizado()
  try {
    return NextResponse.json({ codigo: await reservarNovoCodigo() })
  } catch {
    return erro('Não foi possível gerar o código', 500)
  }
}
