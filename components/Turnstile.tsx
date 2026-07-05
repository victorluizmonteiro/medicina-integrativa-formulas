"use client";

import { useEffect, useRef } from "react";

// Tipagem mínima da API global do Turnstile
interface TurnstileAPI {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    }
  ) => string;
}
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Renderiza o widget do Cloudflare Turnstile e devolve o token via onToken.
 * Se NEXT_PUBLIC_TURNSTILE_SITE_KEY não estiver definido, não renderiza nada
 * (fail-open em dev).
 */
export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;

    const renderizar = () => {
      if (window.turnstile && ref.current && !ref.current.hasChildNodes()) {
        window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: (token) => onToken(token),
          "error-callback": () => onToken(""),
          "expired-callback": () => onToken(""),
        });
      }
    };

    if (window.turnstile) {
      renderizar();
      return;
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = renderizar;
      document.head.appendChild(s);
    } else {
      const intervalo = setInterval(() => {
        if (window.turnstile) {
          clearInterval(intervalo);
          renderizar();
        }
      }, 200);
      return () => clearInterval(intervalo);
    }
  }, [siteKey, onToken]);

  if (!siteKey) return null;
  return <div ref={ref} className="my-2" />;
}
