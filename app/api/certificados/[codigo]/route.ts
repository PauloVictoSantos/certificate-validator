import { NextResponse, type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { erro, naoAutorizado, sessaoAtiva } from '@/lib/http'
import { buscarCertificado } from '@/lib/certificados'
import { codigoTemFormatoValido, normalizarCodigo } from '@/lib/codigo'

type Contexto = { params: Promise<{ codigo: string }> }

// Publico: revogado responde 200 com valido:false; so "nao encontrado" e 404.
export async function GET(_req: NextRequest, { params }: Contexto) {
  const { codigo } = await params
  try {
    const resultado = await buscarCertificado(codigo)
    const status = !resultado.valido && resultado.motivo === 'nao_encontrado' ? 404 : 200
    return NextResponse.json(resultado, { status })
  } catch {
    return erro('Erro ao validar o certificado', 500)
  }
}

// Protegido: revoga (nunca exclui).
export async function DELETE(_req: NextRequest, { params }: Contexto) {
  if (!(await sessaoAtiva())) return naoAutorizado()

  const codigo = normalizarCodigo((await params).codigo)
  if (!codigoTemFormatoValido(codigo)) return erro('Certificado não encontrado', 404)

  const { data, error } = await supabase
    .from('certificados')
    .update({ status: 'revogado', revogado_em: new Date().toISOString() })
    .eq('codigo', codigo)
    .select('codigo')

  if (error) return erro('Erro ao revogar o certificado', 500)
  if (!data || data.length === 0) return erro('Certificado não encontrado', 404)
  return NextResponse.json({ revogado: true })
}
