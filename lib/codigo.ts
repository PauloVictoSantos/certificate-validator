// Seguro para cliente e servidor (sem crypto).
export const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ' // sem 0, O, 1, I, L
export const TAMANHO_CODIGO = 8

export function normalizarCodigo(valor: string): string {
  return valor.toUpperCase().replace(/[\s-]/g, '')
}

const FORMATO = new RegExp(`^[${ALFABETO}]{${TAMANHO_CODIGO}}$`)

export function codigoTemFormatoValido(codigo: string): boolean {
  return FORMATO.test(codigo)
}
