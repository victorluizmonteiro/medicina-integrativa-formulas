import { NextRequest, NextResponse } from "next/server";
import { senhaValida, tokenAdmin, ADMIN_COOKIE } from "@/lib/admin-auth";
import { limiterCheckout, dentroDoLimite, getIp } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  // Reaproveita o limiter (10/10min por IP) contra força bruta
  if (!(await dentroDoLimite(limiterCheckout, getIp(req)))) {
    return NextResponse.json({ erro: "Muitas tentativas. Aguarde." }, { status: 429 });
  }

  const { senha } = (await req.json().catch(() => ({}))) as { senha?: string };

  if (!senha || !senhaValida(senha)) {
    return NextResponse.json({ erro: "Senha incorreta" }, { status: 401 });
  }

  const token = tokenAdmin();
  if (!token) {
    return NextResponse.json({ erro: "ADMIN_PASSWORD não configurada" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  });
  return res;
}
