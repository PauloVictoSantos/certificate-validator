import type { Metadata } from 'next'
import { PainelAdmin } from '@/components/PainelAdmin'

export const metadata: Metadata = { title: 'Painel — Verifica', robots: { index: false } }

// Protegida pelo middleware (src/middleware.ts).
export default function PaginaAdmin() {
  return <PainelAdmin />
}
