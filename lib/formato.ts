/** "2024-08-18" -> "18/08/2024" (sem conversao de fuso). */
export function formatarData(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${a}`
}

export function iniciais(nome: string): string {
  return nome.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
