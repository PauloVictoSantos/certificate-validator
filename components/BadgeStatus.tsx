import type { StatusCertificado } from '@/lib/tipos'

// As classes .valid / .revoked vem do CSS existente.
const CONFIG = {
  valido: { classe: 'valid', rotulo: 'Válido' },
  revogado: { classe: 'revoked', rotulo: 'Revogado' },
} as const

export function BadgeStatus({ status }: { status: StatusCertificado }) {
  const { classe, rotulo } = CONFIG[status]
  return <span className={`status ${classe}`}><span />{rotulo}</span>
}
