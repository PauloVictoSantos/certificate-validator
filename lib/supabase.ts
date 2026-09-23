import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Usa a service role: so roda no servidor. Nunca importar em componentes client.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)
