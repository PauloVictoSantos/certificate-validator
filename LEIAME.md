# Verifica — instalação

1. Copie `src/`, `supabase/`, `.github/` e `.env.example` para o projeto Next.js 15 (alias `@/` -> `src/`).
2. `npm i @supabase/supabase-js jose lucide-react`
3. Rode `supabase/schema.sql` no SQL Editor do Supabase.
4. Copie `.env.example` para `.env.local` e preencha.
5. Mantenha seu CSS atual em `src/app/globals.css` (as classes foram preservadas).
6. Secrets do GitHub: `SUPABASE_URL` e `SUPABASE_ANON_KEY`.

## Estrutura
- `src/lib/` — tipos, normalização/validação de código, cliente Supabase (service role), sessão (JWT em cookie httpOnly), helpers de API
- `src/app/api/` — rotas REST (auth, certificados, gerar-codigo, validação pública)
- `src/middleware.ts` — protege `/admin/*`, redireciona para `/admin/login?expirou=1`
- `src/components/` — um componente por responsabilidade (antes tudo em um arquivo só)
- `src/app/validar`, `src/app/admin` — páginas públicas e protegidas
