import * as Sentry from "@sentry/nextjs";

// Sem SENTRY_DSN, o init é no-op (não envia nada) — seguro em dev.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
