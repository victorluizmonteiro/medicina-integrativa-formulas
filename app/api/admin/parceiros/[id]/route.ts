import { NextRequest, NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase";

/** PATCH /api/admin/parceiros/[id] — edita nome, e-mail, WhatsApp, comissão, ativo. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const bloqueio = exigirAdmin(req);
  if (bloqueio) return bloqueio;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    nome?: string;
    email?: string;
    whatsapp?: string;
    comissao_pct?: number;
    ativo?: boolean;
  };

  const patch: Record<string, unknown> = {};
  if (body.nome !== undefined) {
    if (!body.nome.trim()) return NextResponse.json({ erro: "Nome é obrigatório" }, { status: 400 });
    patch.nome = body.nome.trim();
  }
  if (body.email !== undefined) patch.email = body.email.trim() || null;
  if (body.whatsapp !== undefined) patch.whatsapp = body.whatsapp.trim() || null;
  if (body.comissao_pct !== undefined) {
    const c = Number(body.comissao_pct);
    if (Number.isNaN(c) || c < 0 || c > 100) {
      return NextResponse.json({ erro: "Comissão deve estar entre 0 e 100" }, { status: 400 });
    }
    patch.comissao_pct = c;
  }
  if (body.ativo !== undefined) patch.ativo = !!body.ativo;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ erro: "Nada para atualizar" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("parceiros").update(patch).eq("id", id);
  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
