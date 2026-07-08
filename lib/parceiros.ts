import { supabaseAdmin } from "./supabase";

export interface Parceiro {
  id: number;
  slug: string;
  nome: string;
  whatsapp: string | null;
  logo_url: string | null;
  comissao_pct: number;
  stripe_account_id: string | null;
  is_default: boolean;
}

const CAMPOS =
  "id, slug, nome, whatsapp, logo_url, comissao_pct, stripe_account_id, is_default";

/**
 * Extrai o slug do parceiro a partir do host da requisição.
 * Só reconhece subdomínios do domínio-base (NEXT_PUBLIC_BASE_DOMAIN);
 * hosts fora dele (localhost, *.vercel.app) retornam null → parceiro default.
 * Ex.: barbozao.vitalyxhealth.com.br → 'barbozao'
 */
export function slugDoHost(host: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_BASE_DOMAIN;
  if (!host || !base) return null;
  const hostname = host.split(":")[0].toLowerCase();
  if (!hostname.endsWith(`.${base}`)) return null;
  const sub = hostname.slice(0, -(base.length + 1));
  if (!sub || sub === "www") return null;
  return sub;
}

/**
 * Resolve o parceiro pelo slug (ativo); sem slug ou slug desconhecido,
 * cai no parceiro default. Uso exclusivo em servidor.
 */
export async function getParceiro(slug: string | null): Promise<Parceiro | null> {
  if (slug) {
    const { data } = await supabaseAdmin
      .from("parceiros")
      .select(CAMPOS)
      .eq("slug", slug)
      .eq("ativo", true)
      .maybeSingle();
    if (data) return data as Parceiro;
  }

  const { data: def } = await supabaseAdmin
    .from("parceiros")
    .select(CAMPOS)
    .eq("is_default", true)
    .eq("ativo", true)
    .maybeSingle();

  return (def as Parceiro) ?? null;
}
