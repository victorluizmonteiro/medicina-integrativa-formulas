import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase";

/** POST /api/admin/perguntas — cria uma pergunta em um perfil. */
export async function POST(req: NextRequest) {
  const bloqueio = exigirAdmin(req);
  if (bloqueio) return bloqueio;

  const body = (await req.json().catch(() => ({}))) as {
    perfil_id?: number;
    texto?: string;
    is_sentinela?: boolean;
    peso_sentinela?: number;
  };

  const perfilId = Number(body.perfil_id);
  if (![1, 2, 3].includes(perfilId)) {
    return NextResponse.json({ erro: "Perfil inválido" }, { status: 400 });
  }
  if (!body.texto?.trim() || body.texto.trim().length < 5) {
    return NextResponse.json({ erro: "Texto da pergunta é obrigatório" }, { status: 400 });
  }

  // Coerência sentinela × peso (mesma regra do CHECK do banco)
  const sentinela = !!body.is_sentinela;
  const peso = sentinela ? Math.max(1, Number(body.peso_sentinela) || 1) : 0;

  // Próxima ordem dentro do perfil
  const { data: ultima } = await supabaseAdmin
    .from("perguntas")
    .select("ordem")
    .eq("perfil_id", perfilId)
    .order("ordem", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabaseAdmin.from("perguntas").insert({
    perfil_id: perfilId,
    ordem: (ultima?.ordem ?? 0) + 1,
    texto: body.texto.trim(),
    is_sentinela: sentinela,
    peso_sentinela: peso,
  });

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });

  revalidatePath("/avaliacao"); // limpa o cache ISR do questionário
  return NextResponse.json({ ok: true });
}
