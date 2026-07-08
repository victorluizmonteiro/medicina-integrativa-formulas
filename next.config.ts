import type { NextConfig } from "next";

// Content-Security-Policy — ATIVO (bloqueia recursos fora da lista).
// Se um recurso novo for adicionado (script/API externa), inclua o domínio
// na diretiva correspondente abaixo.
// Em desenvolvimento o React precisa de eval() (debug/callstacks);
// em produção ele nunca usa — mantemos a política rigorosa.
const scriptExtra =
  process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : "";

const csp = [
  "default-src 'self'",
  // Turnstile (anti-bot) carrega script do Cloudflare
  `script-src 'self' 'unsafe-inline'${scriptExtra} https://challenges.cloudflare.com`,
  // estilos inline usados na UI
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // ViaCEP (autopreenchimento) e Turnstile via fetch
  "connect-src 'self' https://viacep.com.br https://challenges.cloudflare.com",
  // iframe do Turnstile
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
