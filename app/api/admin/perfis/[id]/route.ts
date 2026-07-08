import { NextRequest, NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase";

/** PATCH /api/admin/perfis/[id] — atualiza o preço da fórmula (em centavos). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const bloqueio = exigirAdmin(req);
  if (bloqueio) return bloqueio;

  const { id } = await params;
  const { preco_centavos } = (await req.json().catch(() => ({}))) as {
    preco_centavos?: number;
  };

  const preco = Number(preco_centavos);
  if (!Number.isInteger(preco) || preco < 0 || preco > 10_000_000) {
    return NextResponse.json({ erro: "Preço inválido" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("perfis")
    .update({ preco_centavos: preco })
    .eq("id", Number(id));

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
