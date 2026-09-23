import 'server-only'
import { randomInt } from 'crypto'
import { supabase } from './supabase'
import { ALFABETO, TAMANHO_CODIGO } from './codigo'

export function gerarCodigoAleatorio(): string {
  let codigo = ''
  for (let i = 0; i < TAMANHO_CODIGO; i++) codigo += ALFABETO[randomInt(ALFABETO.length)]
  return codigo
}

/** Gera e reserva (insere em "codigos") um codigo unico. */
export async function reservarNovoCodigo(): Promise<string> {
  for (let tentativa = 0; tentativa < 8; tentativa++) {
    const codigo = gerarCodigoAleatorio()
    const { error } = await supabase.from('codigos').insert({ codigo })
    if (!error) return codigo
    if (error.code !== '23505') throw new Error(error.message) // 23505 = ja existe
  }
  throw new Error('Não foi possível gerar um código único')
}
