import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Atribuição de parceiro (multi-tenant por subdomínio).
// Detecta o parceiro pelo subdomínio (barbozao.vitalyxhealth.com.br)
// ou pelo atalho ?p=barbozao e grava um cookie de atribuição.
// First-touch: quem trouxe o cliente primeiro leva a venda — o cookie
// NÃO é sobrescrito por visitas posteriores dentro da janela.
// Sem DB aqui (roda na edge): a validação do slug acontece no /api/submit.

const COOKIE = "vx_parceiro";
const JANELA_DIAS = 30;

function slugDoHost(host: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_BASE_DOMAIN;
  if (!host || !base) return null;
  const hostname = host.split(":")[0].toLowerCase();
  if (!hostname.endsWith(`.${base}`)) return null;
  const sub = hostname.slice(0, -(base.length + 1));
  if (!sub || sub === "www") return null;
  return sub;
}

export function proxy(request: NextRequest) {
  const res = NextResponse.next();

  const jaAtribuido = request.cookies.get(COOKIE)?.value;
  if (jaAtribuido) return res; // first-touch: mantém a atribuição original

  const slug =
    slugDoHost(request.headers.get("host")) ??
    request.nextUrl.searchParams.get("p");

  if (slug && /^[a-z0-9-]{1,50}$/.test(slug)) {
    res.cookies.set(COOKIE, slug, {
      maxAge: JANELA_DIAS * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      // Compartilha o cookie entre o subdomínio e o domínio principal,
      // para a atribuição sobreviver se o cliente voltar pelo link "puro".
      ...(process.env.NEXT_PUBLIC_BASE_DOMAIN
        ? { domain: `.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` }
        : {}),
    });
  }

  return res;
}

export const config = {
  // Só páginas: ignora assets estáticos e as rotas de API
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
