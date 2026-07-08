import Link from "next/link";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { getPerguntas } from "@/lib/data";
import BrandLogo from "@/components/BrandLogo";

export const metadata = {
  title: "Avaliação de Perfil — Vitalyx Health",
};

// ISR: perguntas mudam raramente; página servida via CDN (máx. 1h de cache)
export const revalidate = 3600;

export default async function Avaliacao() {
  const perguntas = await getPerguntas();

  return (
    <main style={{ background: "var(--vivea-cream)", minHeight: "100vh" }}>
      {/* Header enxuto */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(242,246,248,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(14,140,140,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <Link href="/" aria-label="Voltar à página inicial">
            <BrandLogo width={130} />
          </Link>
        </div>
      </header>

      <section style={{ padding: "40px 16px 72px" }}>
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
            <h1
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                fontWeight: 900,
                color: "var(--vivea-dark)",
                lineHeight: 1.2,
              }}
            >
              Descubra o seu perfil
            </h1>
            <p
              style={{
                marginTop: 10,
                fontSize: "0.9rem",
                color: "#777",
                fontWeight: 300,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Responda as {perguntas.length} questões abaixo com base nos últimos 3 a 6 meses.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "28px 24px",
              boxShadow: "0 4px 32px rgba(26,46,34,0.07)",
              border: "1px solid rgba(14,140,140,0.12)",
            }}
          >
            <QuestionnaireForm perguntas={perguntas} />
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
