"use client";

import { useEffect, useState } from "react";
import { obterResultado } from "@/lib/scoring";
import type { Formula } from "@/lib/types";
import BrandLogo from "@/components/BrandLogo";

/* ── Chave do sessionStorage ── */
const SESSION_KEY = "vivea_resultado";

/* ── Tipagem do payload armazenado ── */
interface Sessao {
  formula: Formula;
  pontos: number;
  avaliacaoId: string;
  precoCentavos: number;
  emailOk: boolean | null;
}

/** Formata centavos em reais (R$ 149,90). */
function formatarReais(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ResultadoPage() {
  const [sessao, setSessao]         = useState<Sessao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [visivel, setVisivel]       = useState(false);
  const [pagando, setPagando]       = useState(false);
  const [erroPagamento, setErroPagamento] = useState("");

  /* Lê os dados da sessão ao montar */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        setSessao(JSON.parse(raw));
      }
    } catch {
      // JSON malformado — trata como sessão não encontrada
    }
    setCarregando(false);
    setTimeout(() => setVisivel(true), 80);
  }, []);

  /* ── Sessão expirada / não encontrada ── */
  if (!carregando && !sessao) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--vivea-cream)", display: "flex", flexDirection: "column" }}>
        <header style={{ background: "rgba(247,243,238,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(74,124,89,0.12)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BrandLogo width={130} />
        </header>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🍃</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", fontWeight: 900, color: "var(--vivea-dark)", marginBottom: 10 }}>
            Sessão não encontrada
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#777", fontFamily: "var(--font-dm-sans)", fontWeight: 300, maxWidth: 340, lineHeight: 1.6, marginBottom: 28 }}>
            Os dados da avaliação ficam armazenados apenas durante esta sessão do navegador.
            Por favor, refaça a avaliação para obter seu resultado.
          </p>
          <a
            href="/"
            style={{ background: "var(--vivea-dark)", color: "#fff", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontFamily: "var(--font-dm-sans)", fontSize: "0.95rem", fontWeight: 500 }}
          >
            Refazer avaliação →
          </a>
        </div>
      </main>
    );
  }

  /* ── Loading inicial ── */
  if (carregando || !sessao) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--vivea-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#aaa", fontFamily: "var(--font-dm-sans)" }}>
          <div style={{ width: 32, height: 32, border: "2px solid #0E8C8C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Carregando resultado...
        </div>
      </main>
    );
  }

  const { formula, pontos, avaliacaoId, precoCentavos } = sessao;
  const resultado = obterResultado(formula, pontos);

  /* Cores por fórmula */
  const cor      = formula === "A" ? "#158C93"  : formula === "B" ? "#6FA82E"  : "#2E9E88";
  const corPale  = formula === "A" ? "#E2F1F1"  : formula === "B" ? "#EEF6E0"  : "#E4F3EE";
  const corLight = formula === "A" ? "#43C0C0"  : formula === "B" ? "#9FD154"  : "#5FC6AD";

  const iniciarPagamento = async () => {
    setPagando(true);
    setErroPagamento("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avaliacaoId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.erro || "Não foi possível iniciar o pagamento");
      window.location.href = data.url; // redireciona ao checkout do Stripe
    } catch (e: unknown) {
      setErroPagamento(e instanceof Error ? e.message : "Erro ao iniciar o pagamento");
      setPagando(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--vivea-cream)" }} className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-25" style={{ background: corPale }} />
        <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full blur-3xl opacity-25" style={{ background: corPale }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        <div className="flex-1 flex flex-col items-center justify-start px-4 py-10">

          {/* Título da seção */}
          <div className="text-center mb-8 max-w-lg">
            <p style={{ fontSize: "0.68rem", fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--vivea-sage)", marginBottom: 8, fontFamily: "var(--font-dm-sans)" }}>
              Avaliação Concluída
            </p>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 900, color: "var(--vivea-dark)", lineHeight: 1.2 }}>
              Sua prescrição está pronta
            </h1>
          </div>

          <div
            className="w-full max-w-lg"
            style={{ transition: "opacity 0.7s, transform 0.7s", opacity: visivel ? 1 : 0, transform: visivel ? "translateY(0)" : "translateY(24px)" }}
          >

            {/* Card principal */}
            <div
              style={{
                background: "#fff",
                border: `1.5px solid ${cor}28`,
                borderRadius: 24,
                padding: "28px 24px",
                marginBottom: 16,
                boxShadow: "0 4px 32px rgba(26,46,34,0.07)",
              }}
            >
              {/* Badge perfil */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: corPale,
                  border: `1px solid ${cor}30`,
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: cor,
                  marginBottom: 20,
                  fontFamily: "var(--font-dm-sans)",
                  letterSpacing: "0.5px",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{resultado.icone}</span>
                Perfil Identificado
              </div>

              {/* Nome da fórmula */}
              <h2
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2.2rem, 8vw, 3rem)",
                  fontWeight: 900,
                  lineHeight: 1,
                  background: `linear-gradient(135deg, ${cor}, ${corLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 6,
                }}
              >
                {resultado.nome}
              </h2>
              <h3
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: "var(--vivea-dark)",
                  marginBottom: 20,
                }}
              >
                {resultado.subtitulo}
              </h3>


              {/* Descrição do perfil */}
              {resultado.perfilTexto ? (
                <div style={{ marginBottom: 20 }}>
                  {resultado.perfilTexto.map((bloco, i) => {
                    if (bloco.tipo === "citacao") {
                      return (
                        <p key={i} style={{ margin: "0 0 16px", paddingLeft: 16, borderLeft: `3px solid ${cor}`, fontFamily: "var(--font-playfair)", fontSize: "1.35rem", fontStyle: "italic", fontWeight: 700, lineHeight: 1.3, color: "var(--vivea-dark)" }}>
                          {bloco.texto}
                        </p>
                      );
                    }
                    if (bloco.tipo === "lista") {
                      return (
                        <ul key={i} style={{ margin: "0 0 14px", padding: 0, listStyle: "none" }}>
                          {bloco.itens.map((item, j) => (
                            <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.9rem", lineHeight: 1.6, color: "#475569", fontFamily: "var(--font-dm-sans)", marginBottom: 6 }}>
                              <span style={{ color: cor, fontWeight: 700, lineHeight: 1.5 }}>›</span>
                              <span style={{ fontStyle: "italic" }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (bloco.tipo === "resumo") {
                      return (
                        <div key={i} style={{ background: corPale, border: `1px solid ${cor}30`, borderRadius: 12, padding: "14px 18px", marginTop: 4 }}>
                          <p style={{ margin: "0 0 4px", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: cor, fontFamily: "var(--font-dm-sans)" }}>
                            Em resumo
                          </p>
                          <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 500, color: "var(--vivea-dark)", fontFamily: "var(--font-dm-sans)" }}>
                            {bloco.texto}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p key={i} style={{ margin: "0 0 12px", fontSize: "0.9rem", lineHeight: 1.7, color: "#475569", fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}>
                        {bloco.texto}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#555", fontFamily: "var(--font-dm-sans)", fontWeight: 300, marginBottom: 20 }}>
                  {resultado.descricao}
                </p>
              )}

            </div>

            {/* Aviso da farmácia + ações */}
            <div style={{ display: "grid", gap: 12 }}>

              {/* Mensagem principal — prescrição enviada à farmácia */}
              <div
                style={{
                  background: "var(--vivea-dark)",
                  borderRadius: 18,
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      width: 40, height: 40,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    💊
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        color: "#fff",
                        marginBottom: 4,
                        lineHeight: 1.4,
                      }}
                    >
                      Finalize seu pedido
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 300,
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.6,
                      }}
                    >
                      Pague sua fórmula{" "}
                      <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                        {resultado.nome}
                      </strong>{" "}
                      com cartão de crédito. Assim que o pagamento for confirmado, a
                      farmácia de manipulação parceira dará andamento e entregará no
                      endereço informado.
                    </p>
                  </div>
                </div>

                {/* Valor da fórmula — destaque */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    padding: "16px 20px",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-dm-sans)" }}>
                      Valor da fórmula
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans)" }}>
                      Pagamento único
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "clamp(1.7rem, 6vw, 2.1rem)",
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {precoCentavos > 0 ? formatarReais(precoCentavos) : "—"}
                    </span>
                  </div>
                </div>

                {/* Botão de pagamento (Stripe) */}
                <button
                  onClick={iniciarPagamento}
                  disabled={pagando}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    width: "100%",
                    padding: "15px 24px",
                    borderRadius: 12,
                    border: "none",
                    cursor: pagando ? "wait" : "pointer",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#fff",
                    background: cor,
                    opacity: pagando ? 0.7 : 1,
                    transition: "opacity 0.2s",
                    boxShadow: `0 4px 16px ${cor}55`,
                  }}
                >
                  {pagando ? "Redirecionando…" : `Pagar ${precoCentavos > 0 ? formatarReais(precoCentavos) : "agora"} com cartão`}
                </button>

                {erroPagamento && (
                  <p style={{ color: "#fca5a5", fontSize: "0.8rem", fontFamily: "var(--font-dm-sans)", textAlign: "center", margin: 0 }}>
                    {erroPagamento}
                  </p>
                )}

                {/* Textos legais */}
                <p style={{ margin: 0, fontSize: "0.68rem", lineHeight: 1.6, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-sans)", textAlign: "center" }}>
                  🔒 Pagamento processado com segurança pela Stripe. Não
                  armazenamos os dados do seu cartão.
                </p>
                <p style={{ margin: 0, fontSize: "0.62rem", lineHeight: 1.6, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-dm-sans)", textAlign: "center" }}>
                  Ao concluir o pagamento, você concorda com os{" "}
                  <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
                    termos de uso
                  </a>{" "}
                  e a{" "}
                  <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
                    política de privacidade
                  </a>
                  . A prescrição resulta de avaliação de perfil e não substitui
                  consulta com profissional de saúde habilitado. Valor referente à
                  formulação indicada; prazo e frete de entrega combinados com a
                  farmácia parceira.
                </p>
              </div>

              <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  padding: "12px",
                  borderRadius: 16,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  color: "#aaa",
                  fontFamily: "var(--font-dm-sans)",
                  transition: "color 0.2s",
                }}
              >
                ← Realizar nova avaliação
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
