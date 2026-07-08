import { NextRequest, NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase";

/** POST /api/admin/parceiros — cria um parceiro. */
export async function POST(req: NextRequest) {
  const bloqueio = exigirAdmin(req);
  if (bloqueio) return bloqueio;

  const body = (await req.json().catch(() => ({}))) as {
    slug?: string;
    nome?: string;
    email?: string;
    whatsapp?: string;
    comissao_pct?: number;
  };

  const slug = body.slug?.trim().toLowerCase() ?? "";
  if (!/^[a-z0-9-]{2,50}$/.test(slug)) {
    return NextResponse.json(
      { erro: "Slug inválido (use letras minúsculas, números e hífen)" },
      { status: 400 }
    );
  }
  if (!body.nome?.trim()) {
    return NextResponse.json({ erro: "Nome é obrigatório" }, { status: 400 });
  }
  const comissao = Number(body.comissao_pct ?? 0);
  if (Number.isNaN(comissao) || comissao < 0 || comissao > 100) {
    return NextResponse.json({ erro: "Comissão deve estar entre 0 e 100" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("parceiros").insert({
    slug,
    nome: body.nome.trim(),
    email: body.email?.trim() || null,
    whatsapp: body.whatsapp?.trim() || null,
    comissao_pct: comissao,
  });

  if (error) {
    const msg = error.code === "23505" ? "Já existe um parceiro com esse slug" : error.message;
    return NextResponse.json({ erro: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
