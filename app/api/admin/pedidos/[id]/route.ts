import { NextRequest, NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase";

const STATUS_VALIDOS = ["novo", "em_producao", "enviado", "entregue", "cancelado"];

/** PATCH /api/admin/pedidos/[id] — atualiza o status de produção. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const bloqueio = exigirAdmin(req);
  if (bloqueio) return bloqueio;

  const { id } = await params;
  const { status_pedido } = (await req.json().catch(() => ({}))) as {
    status_pedido?: string;
  };

  if (!status_pedido || !STATUS_VALIDOS.includes(status_pedido)) {
    return NextResponse.json({ erro: "Status inválido" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("avaliacoes")
    .update({ status_pedido })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
