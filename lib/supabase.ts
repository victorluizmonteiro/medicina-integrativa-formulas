import { createClient } from "@supabase/supabase-js";

// Client de SERVIDOR — usa a service role key.
// NUNCA importe este módulo em código que roda no cliente (browser):
// a service role key ignora RLS e concede acesso total ao banco.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Variáveis do Supabase ausentes: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
