const PASSOS = [
  { n: '01', titulo: 'Digite o código', texto: 'Encontre o código no certificado.' },
  { n: '02', titulo: 'Validamos os dados', texto: 'Consultamos nossa base segura.' },
  { n: '03', titulo: 'Veja o resultado', texto: 'Confirme a autenticidade na hora.' },
]

export function PassosComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 border-t border-border px-6 py-12 sm:grid-cols-3"
    >
      {PASSOS.map(p => (
        <div key={p.n}>
          <span className="text-sm font-bold text-red-500">{p.n}</span>
          <strong className="mt-1 block text-base font-semibold text-foreground">
            {p.titulo}
          </strong>
          <p className="mt-1 text-sm text-muted-foreground">{p.texto}</p>
        </div>
      ))}
    </section>
  )
}