import { supabaseAdmin } from "./supabase";
import type { GuiaConteudo } from "./guia";

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

/** Um composto de uma fórmula. */
export interface CompostoDB {
  composto: string;
  quantidade: number;
  unidade: string;
  observacao: string | null;
}

/** Uma fórmula do perfil, com seus compostos. */
export interface FormulaComComposicao {
  nome: string;
  forma_farmaceutica: string | null;
  posologia: string | null;
  composicoes: CompostoDB[];
}

interface CompostoRow {
  composto: string;
  quantidade: number | string;
  unidade: string;
  ordem: number;
  observacao: string | null;
  habilitado: boolean;
}

/**
 * Carrega as fórmulas (habilitadas) de um perfil com seus compostos,
 * ordenados. Uso exclusivo em servidor.
 */
export async function getFormulasComComposicao(
  perfilId: number
): Promise<FormulaComComposicao[]> {
  const { data, error } = await supabaseAdmin
    .from("formulas")
    .select(
      "nome, forma_farmaceutica, posologia, ordem, habilitado, composicoes ( composto, quantidade, unidade, ordem, observacao, habilitado )"
    )
    .eq("perfil_id", perfilId)
    .eq("habilitado", true)
    .order("ordem", { ascending: true });

  if (error) throw new Error(`Erro ao carregar fórmulas: ${error.message}`);

  return (data ?? []).map((f) => ({
    nome: f.nome,
    forma_farmaceutica: f.forma_farmaceutica,
    posologia: f.posologia,
    composicoes: ((f.composicoes ?? []) as CompostoRow[])
      .filter((c) => c.habilitado)
      .sort((a, b) => a.ordem - b.ordem)
      .map((c) => ({
        composto: c.composto,
        quantidade: Number(c.quantidade),
        unidade: c.unidade,
        observacao: c.observacao,
      })),
  }));
}

/**
 * Carrega o Guia do Perfil (conteúdo JSON). Retorna null se não houver
 * guia cadastrado para o perfil. Uso exclusivo em servidor.
 */
export async function getGuia(perfilId: number): Promise<GuiaConteudo | null> {
  const { data, error } = await supabaseAdmin
    .from("guias")
    .select("conteudo")
    .eq("perfil_id", perfilId)
    .maybeSingle();

  if (error) throw new Error(`Erro ao carregar guia: ${error.message}`);
  const conteudo = data?.conteudo as GuiaConteudo | undefined;
  if (!conteudo || !Array.isArray(conteudo.secoes) || conteudo.secoes.length === 0) {
    return null;
  }
  return conteudo;
}
