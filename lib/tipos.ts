export type Curso = {
  id: number
  nome: string
  carga_horaria: number
}

export type StatusCertificado = 'valido' | 'revogado'

export type Certificado = {
  codigo: string
  nome_aluno: string
  curso: string
  carga_horaria: number
  data_conclusao: string // YYYY-MM-DD
  emitido_em: string // ISO
  status: StatusCertificado
}

export type ResultadoValidacao =
  | { valido: true; certificado: Certificado }
  | { valido: false; motivo: 'revogado'; codigo: string }
  | { valido: false; motivo: 'nao_encontrado' }

export type ResumoCertificados = {
  total: number
  revogados: number
  no_mes: number
}

export type RespostaLista = {
  certificados: Certificado[]
  total: number
  resumo: ResumoCertificados
}

export type FiltrosLista = {
  busca: string
  status: '' | StatusCertificado
  cursoId: string
}
