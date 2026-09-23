import 'server-only'
import { supabase } from './supabase'
import { codigoTemFormatoValido, normalizarCodigo } from './codigo'
import type { Certificado, ResultadoValidacao } from './tipos'

export const COLUNAS_CERTIFICADO =
  'codigo,nome_aluno,data_conclusao,emitido_em,status,cursos(nome,carga_horaria)'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paraCertificado(linha: any): Certificado {
  const curso = Array.isArray(linha.cursos) ? linha.cursos[0] : linha.cursos
  return {
    codigo: linha.codigo,
    nome_aluno: linha.nome_aluno,
    curso: curso?.nome ?? '',
    carga_horaria: curso?.carga_horaria ?? 0,
    data_conclusao: linha.data_conclusao,
    emitido_em: linha.emitido_em,
    status: linha.status,
  }
}

/** Usada pela API publica e pela pagina /validar/[codigo]. */
export async function buscarCertificado(bruto: string): Promise<ResultadoValidacao> {
  const codigo = normalizarCodigo(bruto)
  if (!codigoTemFormatoValido(codigo)) return { valido: false, motivo: 'nao_encontrado' }

  const { data, error } = await supabase
    .from('certificados')
    .select(COLUNAS_CERTIFICADO)
    .eq('codigo', codigo)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return { valido: false, motivo: 'nao_encontrado' }

  const certificado = paraCertificado(data)
  if (certificado.status === 'revogado') return { valido: false, motivo: 'revogado', codigo }
  return { valido: true, certificado }
}
