import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * PATCH /api/admin/perguntas/[id] — edita texto, sentinela/peso, ordem, ativo.
 * (Perguntas não são apagadas — respostas antigas referenciam a linha;
 *  use ativo=false para retirá-las do questionário.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const bloqueio = exigirAdmin(req);
  if (bloqueio) return bloqueio;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    texto?: string;
    is_sentinela?: boolean;
    peso_sentinela?: number;
    ordem?: number;
    ativo?: boolean;
  };

  const patch: Record<string, unknown> = {};

  if (body.texto !== undefined) {
    if (!body.texto.trim() || body.texto.trim().length < 5) {
      return NextResponse.json({ erro: "Texto inválido" }, { status: 400 });
    }
    patch.texto = body.texto.trim();
  }
  if (body.is_sentinela !== undefined) {
    const sentinela = !!body.is_sentinela;
    patch.is_sentinela = sentinela;
    // mantém a coerência do CHECK: sentinela ⇒ peso ≥ 1; não sentinela ⇒ 0
    patch.peso_sentinela = sentinela ? Math.max(1, Number(body.peso_sentinela) || 1) : 0;
  } else if (body.peso_sentinela !== undefined) {
    patch.peso_sentinela = Math.max(1, Number(body.peso_sentinela) || 1);
    patch.is_sentinela = true;
  }
  if (body.ordem !== undefined) {
    const o = Number(body.ordem);
    if (!Number.isInteger(o) || o < 1) {
      return NextResponse.json({ erro: "Ordem inválida" }, { status: 400 });
    }
    patch.ordem = o;
  }
  if (body.ativo !== undefined) patch.ativo = !!body.ativo;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ erro: "Nada para atualizar" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("perguntas")
    .update(patch)
    .eq("id", Number(id));

  if (error) {
    const msg =
      error.code === "23505"
        ? "Já existe uma pergunta com essa ordem neste perfil"
        : error.message;
    return NextResponse.json({ erro: msg }, { status: 400 });
  }

  revalidatePath("/avaliacao"); // limpa o cache ISR do questionário
  return NextResponse.json({ ok: true });
}
