import QuestionnaireForm from "@/components/QuestionnaireForm";

/* ── Logo VÍVEA — SVG inline ── */
function ViveaLogo({ dark = false }: { dark?: boolean }) {
  const textColor = dark ? "#F7F3EE" : "#1A2E22";
  const leafColor = dark ? "#6B9E7A" : "#4A7C59";
  const leafVein  = dark ? "#1A2E22" : "#E8F0EA";
  const divider   = dark ? "#6B9E7A" : "#4A7C59";
  const tagColor  = dark ? "#9ABFA8" : "#4A7C59";

  return (
    <svg
      width="160" height="40"
      viewBox="0 0 180 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vívea — Saúde Natural"
      role="img"
    >
      <path d="M4 6 L17 36" stroke={textColor} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M30 6 L17 36" stroke={textColor} strokeWidth="3.2" strokeLinecap="round" />
      <ellipse cx="5" cy="4" rx="4.5" ry="8" fill={leafColor} transform="rotate(-18 5 4)" />
      <line x1="5" y1="8" x2="8" y2="-3" stroke={leafVein} strokeWidth="0.9" strokeLinecap="round" />
      <text x="42" y="30" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", fontWeight: 700, fill: textColor, letterSpacing: "1.5px" }}>
        VÍVEA
      </text>
      <line x1="144" y1="10" x2="144" y2="36" stroke={divider} strokeWidth="0.7" opacity="0.5" />
      <text x="152" y="21" style={{ fontFamily: "Georgia, serif", fontSize: "8px", fill: tagColor, letterSpacing: "2px" }}>SAÚDE</text>
      <text x="152" y="32" style={{ fontFamily: "Georgia, serif", fontSize: "8px", fill: tagColor, letterSpacing: "2px" }}>NATURAL</text>
    </svg>
  );
}

/* ── Cards das fórmulas ── */
const formulas = [
  {
    key: "calm",
    tag: "CALM·A",
    icon: "⚡",
    title: "Mente Acelerada",
    desc: "Vive em estado de alerta, pensamentos em loop, não consegue desligar mesmo exausto.",
    accent: "#C46060",
    pale: "#FDF0F0",
  },
  {
    key: "vital",
    tag: "VITAL·B",
    icon: "🌑",
    title: "Sem Energia",
    desc: "Perdeu a motivação, corpo pesado, sem prazer nas coisas simples do dia a dia.",
    accent: "#C8763A",
    pale: "#FDF5EE",
  },
  {
    key: "equil",
    tag: "EQUIL·C",
    icon: "🌊",
    title: "Instável",
    desc: "Dias bons que viram ruins do nada. Humor, sono e energia sempre oscilando.",
    accent: "#4A7C59",
    pale: "#E8F0EA",
  },
];

export default function Home() {
  return (
    <main style={{ background: "var(--vivea-cream)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(247,243,238,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(74,124,89,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <ViveaLogo />
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 500,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "var(--vivea-sage)",
              background: "var(--vivea-sage-pale)",
              padding: "5px 12px",
              borderRadius: "20px",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Fórmulas Naturais
          </span>
        </div>

        {/* Barra das 3 fórmulas */}
        <div
          style={{ background: "var(--vivea-dark)", display: "flex", overflow: "hidden" }}
          aria-hidden="true"
        >
          {[
            { label: "CALM·A",  color: "#C46060" },
            { label: "VITAL·B", color: "#C8763A" },
            { label: "EQUIL·C", color: "#6B9E7A" },
          ].map((f, i) => (
            <div
              key={f.label}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 4px",
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6, height: 6,
                  borderRadius: "50%",
                  background: f.color,
                  marginRight: 5,
                  verticalAlign: "middle",
                  marginBottom: 1,
                }}
              />
              {f.label}
            </div>
          ))}
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {/* Gradientes sutis de fundo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(74,124,89,0.06) 0%, transparent 60%), " +
              "radial-gradient(circle at 10% 80%, rgba(200,118,58,0.05) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 700,
            margin: "0 auto",
            padding: "40px 22px 0",
          }}
        >
          {/* Logo centrado no hero */}
          <div className="vh-fadeup-1" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <ViveaLogo />
          </div>

          {/* Eyebrow */}
          <p
            className="vh-fadeup-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: "0.68rem",
              fontWeight: 500,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--vivea-amber)",
              marginBottom: 18,
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            <span style={{ display: "block", width: 24, height: 1, background: "var(--vivea-amber)", opacity: 0.6 }} />
            Saúde que faz sentido para você
            <span style={{ display: "block", width: 24, height: 1, background: "var(--vivea-amber)", opacity: 0.6 }} />
          </p>

          {/* Título principal */}
          <h1
            className="vh-fadeup-2"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.9rem, 6.5vw, 2.8rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              color: "var(--vivea-dark)",
              textAlign: "center",
              marginBottom: 18,
            }}
          >
            Cada problema tem<br />
            uma causa{" "}
            <em style={{ fontStyle: "italic", color: "var(--vivea-sage)" }}>diferente.</em>
            <br />
            E uma solução diferente.
          </h1>

          {/* Subtítulo */}
          <p
            className="vh-fadeup-3"
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.75,
              color: "#666",
              fontWeight: 300,
              textAlign: "center",
              maxWidth: 480,
              margin: "0 auto 36px",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Ansiedade física, falta de energia ou instabilidade emocional —
            criamos{" "}
            <strong style={{ color: "var(--vivea-dark)", fontWeight: 500 }}>três fórmulas naturais</strong>{" "}
            para três perfis distintos.
            Responda nosso questionário e descubra qual foi feita para o seu momento.
          </p>

          {/* Cards das fórmulas */}
          <div
            className="vh-fadeup-4"
            style={{ marginBottom: 32 }}
          >
            <style>{`
              .vivea-cards { display: flex; flex-direction: column; gap: 12px; }
              .vivea-card  { background: #fff; border-radius: 16px; padding: 18px; display: flex; align-items: center; gap: 14px; transition: transform 0.15s ease, box-shadow 0.2s ease; }
              .vivea-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
              .vivea-card-arrow { font-size: 1.1rem; color: #ccc; flex-shrink: 0; }
              @media (min-width: 640px) {
                .vivea-cards { flex-direction: row; }
                .vivea-card  { flex-direction: column; align-items: flex-start; flex: 1; }
                .vivea-card-arrow { display: none; }
              }
            `}</style>
            <div className="vivea-cards">
              {formulas.map((f) => (
                <div
                  key={f.key}
                  className="vivea-card"
                  style={{ border: `1.5px solid ${f.accent}28` }}
                >
                  <div
                    style={{
                      width: 44, height: 44,
                      borderRadius: 12,
                      background: f.pale,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: f.accent,
                        marginBottom: 2,
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    >
                      {f.tag}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--vivea-dark)",
                        marginBottom: 3,
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#888",
                        lineHeight: 1.5,
                        fontWeight: 300,
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    >
                      {f.desc}
                    </div>
                  </div>
                  <div className="vivea-card-arrow">›</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="vh-fadeup-5" style={{ paddingBottom: 48 }}>
            <style>{`
              .vivea-cta { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; max-width: 360px; margin: 0 auto; background: var(--vivea-dark); color: #fff; border: none; border-radius: 14px; padding: 18px 24px; font-family: var(--font-dm-sans); font-size: 1rem; font-weight: 500; letter-spacing: 0.3px; text-align: center; text-decoration: none; transition: background 0.2s ease, transform 0.15s ease; box-shadow: 0 6px 24px rgba(26,46,34,0.25); }
              .vivea-cta:hover  { background: var(--vivea-sage); }
              .vivea-cta:active { transform: scale(0.98); }
            `}</style>
            <a href="#questionario" className="vivea-cta">
              Descobrir meu perfil →
            </a>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.7rem",
                color: "#bbb",
                marginTop: 10,
                letterSpacing: "0.3px",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Leva menos de 2 minutos · 100% gratuito
            </p>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────── */}
      <div style={{ background: "var(--vivea-dark)" }}>
        <style>{`
          .trust-strip-inner { display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto; width: 100%; padding: 28px 24px; }
          @media (min-width: 640px) { .trust-strip-inner { flex-direction: row; justify-content: center; gap: 40px; padding: 32px 40px; } }
        `}</style>
        <div className="trust-strip-inner">
          {[
            { icon: "🌿", title: "Base fisiológica real",  sub: "Não apenas alívio de sintomas" },
            { icon: "🎯", title: "Fórmula personalizada",  sub: "Direcionada para o seu perfil" },
            { icon: "📋", title: "Questionário clínico",   sub: "Critérios baseados em fisiologia" },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36, height: 36,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <strong style={{ display: "block", color: "#fff", fontWeight: 500, fontSize: "0.88rem", fontFamily: "var(--font-dm-sans)" }}>
                  {item.title}
                </strong>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 300, fontFamily: "var(--font-dm-sans)" }}>
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FORMULÁRIO ──────────────────────────────────────────── */}
      <section
        id="questionario"
        style={{ background: "var(--vivea-cream)", padding: "52px 16px 72px" }}
      >
        <div style={{ maxWidth: 672, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p
              style={{
                fontSize: "0.68rem",
                fontWeight: 500,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--vivea-sage)",
                marginBottom: 8,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Questionário Clínico
            </p>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                fontWeight: 900,
                color: "var(--vivea-dark)",
                lineHeight: 1.2,
              }}
            >
              Descubra o seu perfil
            </h2>
            <p
              style={{
                marginTop: 10,
                fontSize: "0.9rem",
                color: "#777",
                fontWeight: 300,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Responda as 30 questões abaixo com base nos últimos 3 a 6 meses.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "28px 24px",
              boxShadow: "0 4px 32px rgba(26,46,34,0.07)",
              border: "1px solid rgba(74,124,89,0.12)",
            }}
          >
            <QuestionnaireForm />
          </div>

          <p
            style={{
              marginTop: 20,
              fontSize: "0.72rem",
              color: "#aaa",
              textAlign: "center",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Suas respostas são confidenciais e utilizadas exclusivamente para indicação da formulação adequada.
          </p>
        </div>
      </section>

    </main>
  );
}
