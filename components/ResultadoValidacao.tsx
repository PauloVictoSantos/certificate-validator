import { BadgeCheck, X } from 'lucide-react'
import { formatarData } from '@/lib/formato'
import type { ResultadoValidacao as Resultado } from '@/lib/tipos'

export function ResultadoValidacao({ resultado }: { resultado: Resultado }) {
  if (resultado.valido) {
    const c = resultado.certificado
    return (
      <div className="validation-result valid">
        <div className="result-icon"><BadgeCheck /></div>
        <div>
          <strong>Certificado autêntico</strong>
          <span>{c.nome_aluno} · {c.curso} · {c.carga_horaria} horas</span>
          <span>Concluído em {formatarData(c.data_conclusao)} · Código {c.codigo}</span>
        </div>
      </div>
    )
  }

  if (resultado.motivo === 'revogado') {
    return (
      <div className="validation-result invalid">
        <div className="result-icon"><X /></div>
        <div>
          <strong>Certificado revogado</strong>
          <span>O código {resultado.codigo} existe, mas este certificado não é mais válido.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="validation-result missing">
      <div className="result-icon"><X /></div>
      <div>
        <strong>Código não encontrado</strong>
        <span>Confira o código informado e tente novamente.</span>
      </div>
    </div>
  )
}
