import { NextRequest, NextResponse } from "next/server";
import { exigirAdmin } from "@/lib/admin-api";
import { enviarPrescricaoFarmacia } from "@/lib/prescricao";
import * as Sentry from "@sentry/nextjs";

/** POST /api/admin/pedidos/[id]/reenviar — (re)envia a prescrição à farmácia. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const bloqueio = exigirAdmin(req);
  if (bloqueio) return bloqueio;

  const { id } = await params;
  try {
    const resultado = await enviarPrescricaoFarmacia(id);
    if (!resultado.ok) {
      return NextResponse.json({ erro: resultado.motivo }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao reenviar prescrição:", err);
    Sentry.captureException(err);
    return NextResponse.json({ erro: "Falha ao enviar o e-mail" }, { status: 500 });
  }
}
