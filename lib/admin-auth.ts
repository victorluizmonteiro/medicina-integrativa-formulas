import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "vx_admin";

/**
 * Token de sessão do admin: HMAC derivado da ADMIN_PASSWORD.
 * Trocar a senha invalida todas as sessões automaticamente.
 */
export function tokenAdmin(): string | null {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha) return null;
  return createHmac("sha256", senha).update("vitalyx-admin-v1").digest("hex");
}

export function senhaValida(tentativa: string): boolean {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha || !tentativa) return false;
  const a = Buffer.from(tentativa);
  const b = Buffer.from(senha);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessaoValida(cookieValue: string | undefined): boolean {
  const esperado = tokenAdmin();
  if (!esperado || !cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}
