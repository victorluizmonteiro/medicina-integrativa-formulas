import { NextRequest, NextResponse } from "next/server";
import { sessaoValida, ADMIN_COOKIE } from "./admin-auth";

/**
 * Barreira das rotas /api/admin/*: retorna uma resposta 401 se a
 * sessão do painel for inválida, ou null se estiver autorizado.
 */
export function exigirAdmin(req: NextRequest): NextResponse | null {
  if (!sessaoValida(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }
  return null;
}
