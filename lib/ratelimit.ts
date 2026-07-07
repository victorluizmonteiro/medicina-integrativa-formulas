import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fail-open: sem as env vars do Upstash (ex.: em dev), o rate limiting
// é ignorado e o app funciona normalmente. A proteção só "liga" quando
// UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN estiverem definidas.
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

// Guarda de produção: fail-open é aceitável em dev, mas em produção
// rodar sem rate limiting é um risco silencioso — loga erro alto.
if (!redis && process.env.VERCEL_ENV === "production") {
  console.error(
    "[SEGURANÇA] UPSTASH_REDIS_REST_URL/TOKEN ausentes em produção — rate limiting DESATIVADO."
  );
}

function criarLimiter(limite: number, janela: `${number} m`, prefixo: string) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limite, janela),
    prefix: `rl:${prefixo}`,
    analytics: true,
  });
}

// Limites por IP (ajustáveis)
export const limiterSubmit = criarLimiter(5, "10 m", "submit");
export const limiterCheckout = criarLimiter(10, "10 m", "checkout");

/** Extrai o IP do cliente a partir dos headers (Vercel/proxy). */
export function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconhecido";
}

/**
 * Retorna true se a requisição está DENTRO do limite (ou se o rate limiting
 * está desativado). Retorna false se estourou.
 */
export async function dentroDoLimite(
  limiter: Ratelimit | null,
  ip: string
): Promise<boolean> {
  if (!limiter) return true; // fail-open: rate limiting desativado
  try {
    const { success } = await limiter.limit(ip);
    return success;
  } catch (err) {
    // Redis indisponível ou credencial inválida → não bloqueia o cliente
    console.warn("Rate limiting indisponível (fail-open):", err);
    return true;
  }
}
