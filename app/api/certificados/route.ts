import { NextResponse, type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { erro, naoAutorizado, sessaoAtiva } from '@/lib/http'
import { COLUNAS_CERTIFICADO, paraCertificado } from '@/lib/certificados'
import { codigoTemFormatoValido, normalizarCodigo } from '@/lib/codigo'
import { reservarNovoCodigo } from '@/lib/codigo-servidor'
import { dataValida } from '@/lib/validacao'

const POR_PAGINA = 10

// GET /api/certificados            -> cursos (publico)
// GET /api/certificados?lista=1    -> certificados + resumo (protegido)
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  if (params.get('lista') !== '1') {
    const { data, error } = await supabase
      .from('cursos')
      .select('id,nome,carga_horaria')
      .order('nome')
    if (error) return erro('Erro ao listar cursos', 500)
    return NextResponse.json({ cursos: data })
  }

  if (!(await sessaoAtiva())) return naoAutorizado()

  const pagina = Math.max(1, parseInt(params.get('pagina') ?? '1', 10) || 1)
  const status = params.get('status')
  const cursoId = Number(params.get('curso_id'))
  const busca = (params.get('busca') ?? '').replace(/[,()%*\\]/g, ' ').trim()
  const de = (pagina - 1) * POR_PAGINA

  let consulta = supabase
    .from('certificados')
    .select(COLUNAS_CERTIFICADO, { count: 'exact' })
    .order('emitido_em', { ascending: false })
    .range(de, de + POR_PAGINA - 1)

  if (status === 'valido' || status === 'revogado') consulta = consulta.eq('status', status)
  if (Number.isInteger(cursoId) && cursoId > 0) consulta = consulta.eq('curso_id', cursoId)
  if (busca) consulta = consulta.or(`nome_aluno.ilike.%${busca}%,codigo.ilike.%${busca}%`)

  // Inicio do mes atual no fuso de Manaus (UTC-4)
  const agora = new Date(Date.now() - 4 * 3600 * 1000)
  const inicioMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1, 4)).toISOString()
  const contar = () => supabase.from('certificados').select('codigo', { count: 'exact', head: true })

  const [lista, total, revogados, noMes] = await Promise.all([
    consulta,
    contar(),
    contar().eq('status', 'revogado'),
    contar().gte('emitido_em', inicioMes),
  ])
  if (lista.error) return erro('Erro ao listar certificados', 500)

  return NextResponse.json({
    certificados: (lista.data ?? []).map(paraCertificado),
    total: lista.count ?? 0,
    resumo: { total: total.count ?? 0, revogados: revogados.count ?? 0, no_mes: noMes.count ?? 0 },
  })
}

// POST /api/certificados (protegido)
export async function POST(req: NextRequest) {
  if (!(await sessaoAtiva())) return naoAutorizado()

  const corpo = await req.json().catch(() => null)
  if (!corpo || typeof corpo !== 'object') return erro('Corpo da requisição inválido', 400)

  const nome = typeof corpo.nome_aluno === 'string' ? corpo.nome_aluno.trim().replace(/\s+/g, ' ') : ''
  const cursoId = Number(corpo.curso_id)
  const data = corpo.data_conclusao

  if (nome.length < 2 || nome.length > 120) return erro('Informe o nome do aluno (2 a 120 caracteres)', 400)
  if (!Number.isInteger(cursoId) || cursoId <= 0) return erro('Curso inválido', 400)
  if (typeof data !== 'string' || !dataValida(data)) return erro('Data de conclusão inválida', 400)

  let codigo: string
  if (corpo.codigo !== undefined && corpo.codigo !== null && corpo.codigo !== '') {
    codigo = normalizarCodigo(String(corpo.codigo))
    if (!codigoTemFormatoValido(codigo)) return erro('Código em formato inválido', 400)
    const { data: reservado } = await supabase.from('codigos').select('codigo').eq('codigo', codigo).maybeSingle()
    if (!reservado) return erro('Este código não foi reservado. Gere um novo código.', 400)
  } else {
    try {
      codigo = await reservarNovoCodigo()
    } catch {
      return erro('Não foi possível gerar o código', 500)
    }
  }

  const { error } = await supabase
    .from('certificados')
    .insert({ codigo, nome_aluno: nome, curso_id: cursoId, data_conclusao: data })

  if (error) {
    if (error.code === '23505') return erro('Este código já foi usado em outro certificado', 409)
    if (error.code === '23503') return erro('Curso inválido', 400)
    return erro('Erro ao emitir o certificado', 500)
  }
  return NextResponse.json({ codigo }, { status: 201 })
}
