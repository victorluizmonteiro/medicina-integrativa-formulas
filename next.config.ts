import type { NextConfig } from "next";

// Content-Security-Policy — enviado em modo REPORT-ONLY por segurança:
// ele NÃO bloqueia nada ainda, apenas reporta violações no console do
// navegador. Depois de validar que a página funciona sem avisos, troque
// a chave abaixo de "Content-Security-Policy-Report-Only" para
// "Content-Security-Policy" para passar a aplicar de verdade.
const csp = [
  "default-src 'self'",
  // Turnstile (anti-bot) carrega script do Cloudflare
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
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
  // Report-Only por enquanto (ver comentário acima)
  { key: "Content-Security-Policy-Report-Only", value: csp },
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
