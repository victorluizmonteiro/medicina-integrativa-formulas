import { supabaseAdmin } from "./supabase";

/** Pergunta como usada pelo formulário e pela pontuação. */
export interface PerguntaDB {
  id: number;
  perfil_id: number;
  ordem: number;
  texto: string;
  peso_sentinela: number;
}

/**
 * Carrega todas as perguntas ativas, ordenadas por perfil e ordem.
 * Uso exclusivo em servidor (Server Components / Route Handlers).
 */
export async function getPerguntas(): Promise<PerguntaDB[]> {
  const { data, error } = await supabaseAdmin
    .from("perguntas")
    .select("id, perfil_id, ordem, texto, peso_sentinela")
    .eq("ativo", true)
    .order("perfil_id", { ascending: true })
    .order("ordem", { ascending: true });

  if (error) throw new Error(`Erro ao carregar perguntas: ${error.message}`);
  return data ?? [];
}
