import * as Sentry from "@sentry/nextjs";

// Sem NEXT_PUBLIC_SENTRY_DSN, o init é no-op — seguro em dev.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
