"use client";

import { useEffect, useState } from "react";
import { obterResultado } from "@/lib/scoring";
import type { Formula } from "@/lib/types";

/* ── Logo VÍVEA — inline SVG ── */
function ViveaLogo() {
  return (
    <svg width="130" height="32" viewBox="0 0 180 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vívea" role="img">
      <path d="M4 6 L17 36" stroke="#1A2E22" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M30 6 L17 36" stroke="#1A2E22" strokeWidth="3.2" strokeLinecap="round" />
      <ellipse cx="5" cy="4" rx="4.5" ry="8" fill="#4A7C59" transform="rotate(-18 5 4)" />
      <line x1="5" y1="8" x2="8" y2="-3" stroke="#E8F0EA" strokeWidth="0.9" strokeLinecap="round" />
      <text x="42" y="30" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", fontWeight: 700, fill: "#1A2E22", letterSpacing: "1.5px" }}>VÍVEA</text>
      <line x1="144" y1="10" x2="144" y2="36" stroke="#4A7C59" strokeWidth="0.7" opacity="0.5" />
      <text x="152" y="21" style={{ fontFamily: "Georgia, serif", fontSize: "8px", fill: "#4A7C59", letterSpacing: "2px" }}>SAÚDE</text>
      <text x="152" y="32" style={{ fontFamily: "Georgia, serif", fontSize: "8px", fill: "#4A7C59", letterSpacing: "2px" }}>NATURAL</text>
    </svg>
  );
}

/* ── Chave do sessionStorage ── */
const SESSION_KEY = "vivea_resultado";

/* ── Tipagem do payload armazenado ── */
interface Sessao {
  formula: Formula;
  pontos: number;
  nome: string;
  cpf: string;
  emailOk: boolean | null;
}

const WHATSAPP_FARMACIA = "5519996557376";

export default function ResultadoPage() {
  const [sessao, setSessao]         = useState<Sessao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [visivel, setVisivel]       = useState(false);

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
          <ViveaLogo />
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
          <div style={{ width: 32, height: 32, border: "2px solid #4A7C59", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Carregando resultado...
        </div>
      </main>
    );
  }

  const { formula, pontos, nome, cpf } = sessao;
  const resultado = obterResultado(formula, pontos);

  /* Cores por fórmula */
  const cor      = formula === "A" ? "#C46060"  : formula === "B" ? "#C8763A"  : "#4A7C59";
  const corPale  = formula === "A" ? "#FDF0F0"  : formula === "B" ? "#FDF5EE"  : "#E8F0EA";
  const corLight = formula === "A" ? "#d4857f"  : formula === "B" ? "#d4955e"  : "#6B9E7A";

  const contatarFarmacia = () => {
    const texto = encodeURIComponent(
      `Olá! Realizei a avaliação VÍVEA.\n\n` +
      `*Resultado:* ${resultado.nome} — ${resultado.subtitulo}\n` +
      `*Paciente:* ${nome}\n\n` +
      `Gostaria de obter mais informações sobre a formulação indicada.`
    );
    window.open(`https://wa.me/${WHATSAPP_FARMACIA}?text=${texto}`, "_blank");
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--vivea-cream)" }} className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-25" style={{ background: corPale }} />
        <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full blur-3xl opacity-25" style={{ background: corPale }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Header */}
        <header
          style={{
            background: "rgba(247,243,238,0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(74,124,89,0.12)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ViveaLogo />
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 500,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "#4A7C59",
              background: "#E8F0EA",
              padding: "5px 12px",
              borderRadius: "20px",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Resultado da Avaliação
          </span>
        </header>

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

              {/* Pontuação */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: corPale,
                    border: `1px solid ${cor}30`,
                    borderRadius: 999,
                    padding: "4px 12px",
                  }}
                >
                  <span style={{ fontWeight: 700, color: cor, fontSize: "0.9rem", fontFamily: "var(--font-dm-sans)" }}>{pontos} pts</span>
                  <span style={{ color: "#aaa", fontSize: "0.75rem", fontFamily: "var(--font-dm-sans)" }}>/ 90</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#aaa", fontFamily: "var(--font-dm-sans)" }}>
                  {pontos < 10 ? "Perfil de baixa intensidade" : pontos < 18 ? "Perfil moderado" : "Perfil dominante"}
                </span>
              </div>

              {/* Barra de progresso */}
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 20 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min((pontos / 90) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${cor}, ${corLight})`,
                    borderRadius: 999,
                    transition: "width 1s ease",
                  }}
                />
              </div>

              {/* Descrição */}
              <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#555", fontFamily: "var(--font-dm-sans)", fontWeight: 300, marginBottom: 20 }}>
                {resultado.descricao}
              </p>

              {/* Box paciente */}
              <div
                style={{
                  background: corPale,
                  border: `1px solid ${cor}25`,
                  borderRadius: 14,
                  padding: "14px 18px",
                }}
              >
                <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaa", marginBottom: 4, fontFamily: "var(--font-dm-sans)" }}>
                  Paciente
                </p>
                <p style={{ fontWeight: 600, color: "var(--vivea-dark)", fontFamily: "var(--font-dm-sans)" }}>{nome}</p>
                <p style={{ fontSize: "0.85rem", color: "#888", fontFamily: "var(--font-dm-sans)" }}>CPF: {cpf}</p>
              </div>
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
                      Prescrição enviada à farmácia parceira
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
                      Sua fórmula{" "}
                      <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                        {resultado.nome}
                      </strong>{" "}
                      foi encaminhada para a farmácia de manipulação parceira.
                      Entre em contato pelo WhatsApp abaixo para adquiri-la.
                    </p>
                  </div>
                </div>

                {/* Botão WhatsApp dentro do card escuro */}
                <button
                  onClick={contatarFarmacia}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    width: "100%",
                    padding: "15px 24px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#fff",
                    background: "#25D366",
                    transition: "opacity 0.2s",
                    boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Falar com a Farmácia Parceira
                </button>
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
