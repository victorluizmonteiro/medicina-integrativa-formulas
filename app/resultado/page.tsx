"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { obterResultado } from "@/lib/scoring";
import { Formula } from "@/lib/types";
import { gerarDocPDF } from "@/lib/generate-pdf";

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

const WHATSAPP_FARMACIA = "5519996557376";

function ResultadoContent() {
  const params = useSearchParams();
  const formula = (params.get("formula") || "A") as Formula;
  const pontos = Number(params.get("pontos") || 0);
  const nome = params.get("nome") || "";
  const cpf = params.get("cpf") || "";

  const resultado = obterResultado(formula, pontos);
  const [visivel, setVisivel] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState<boolean | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisivel(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Lê o status de email enviado passado pela URL (opcional)
  useEffect(() => {
    const status = params.get("email");
    if (status === "ok") setEmailEnviado(true);
    else if (status === "erro") setEmailEnviado(false);
  }, [params]);

  const baixarPDF = () => {
    const doc = gerarDocPDF(nome, cpf, formula, pontos);
    doc.save(`prescricao-${formula}-${nome.replace(/\s/g, "_").toLowerCase()}.pdf`);
  };

  const contatarFarmacia = () => {
    const texto = encodeURIComponent(
      `Olá! Realizei a avaliação no sistema Mental ABC.\n\n` +
      `*Resultado:* ${resultado.nome} — ${resultado.subtitulo}\n` +
      `*Paciente:* ${nome}\n` +
      `*CPF:* ${cpf}\n\n` +
      `Gostaria de obter mais informações sobre a formulação indicada.`
    );
    window.open(`https://wa.me/${WHATSAPP_FARMACIA}?text=${texto}`, "_blank");
  };

  // CALM·A = vermelho  VITAL·B = âmbar  EQUIL·C = sage
  const cor      = formula === "A" ? "#C46060"  : formula === "B" ? "#C8763A"  : "#4A7C59";
  const corPale  = formula === "A" ? "#FDF0F0"  : formula === "B" ? "#FDF5EE"  : "#E8F0EA";
  const corBorda = formula === "A" ? "border-[#C46060]/30" : formula === "B" ? "border-[#C8763A]/30" : "border-[#4A7C59]/30";
  const corTexto = formula === "A" ? "text-[#C46060]"      : formula === "B" ? "text-[#C8763A]"      : "text-[#4A7C59]";
  const corBg    = formula === "A" ? "bg-[#FDF0F0]"        : formula === "B" ? "bg-[#FDF5EE]"        : "bg-[#E8F0EA]";
  const gradiente = formula === "A" ? "from-[#C46060] to-[#d4857f]" : formula === "B" ? "from-[#C8763A] to-[#d4955e]" : "from-[#4A7C59] to-[#6B9E7A]";
  void cor; void corPale;

  return (
    <div className={`transition-all duration-700 ${visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      {/* Aviso de e-mail */}
      {emailEnviado === true && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4 text-sm text-emerald-700">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Prescrição enviada para o seu e-mail!
        </div>
      )}
      {emailEnviado === false && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 text-sm text-amber-700">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
          Não foi possível enviar o e-mail. Baixe o PDF abaixo.
        </div>
      )}

      {/* Card principal */}
      <div className={`bg-white border ${corBorda} rounded-3xl p-6 sm:p-8 mb-4 shadow-sm`}>
        <div className={`inline-flex items-center gap-2 ${corBg} border ${corBorda} rounded-full px-3 py-1.5 text-xs font-semibold ${corTexto} mb-5`}>
          <span className="text-lg">{resultado.icone}</span>
          Perfil Identificado
        </div>

        <h2 className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${gradiente} bg-clip-text text-transparent mb-1`}>
          {resultado.nome}
        </h2>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">{resultado.subtitulo}</h3>

        <div className="flex items-center gap-3 mb-4">
          <div className={`flex items-center gap-1.5 ${corBg} border ${corBorda} rounded-full px-3 py-1`}>
            <span className={`text-sm font-bold ${corTexto}`}>{pontos} pts</span>
            <span className="text-xs text-slate-400">/ 90</span>
          </div>
          <div className="text-xs text-slate-400">
            {pontos < 10 ? "Perfil de baixa intensidade" : pontos < 18 ? "Perfil moderado" : "Perfil dominante"}
          </div>
        </div>

        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full bg-gradient-to-r ${gradiente} rounded-full transition-all duration-1000`}
            style={{ width: `${Math.min((pontos / 90) * 100, 100)}%` }}
          />
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">{resultado.descricao}</p>

        <div className={`${corBg} border ${corBorda} rounded-2xl p-4`}>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Paciente</p>
          <p className="text-slate-900 font-semibold">{nome}</p>
          <p className="text-slate-500 text-sm">CPF: {cpf}</p>
        </div>
      </div>

      {/* Ações */}
      <div className="grid gap-3">
        <button
          onClick={baixarPDF}
          className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r ${gradiente} hover:opacity-90 transition-all duration-200 shadow-md`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Baixar Formulação
        </button>

        <button
          onClick={contatarFarmacia}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-semibold text-white bg-[#25D366] hover:bg-[#20c05a] transition-all duration-200 shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Falar com a Farmácia Parceira
        </button>

        <a href="/" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm text-slate-400 hover:text-slate-600 transition">
          ← Realizar nova avaliação
        </a>
      </div>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--vivea-cream)" }} className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: "#E8F0EA" }} />
        <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30" style={{ background: "#FDF5EE" }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
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
          <div className="text-center mb-8 max-w-lg">
            <p style={{ fontSize: "0.68rem", fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--vivea-sage)", marginBottom: 8, fontFamily: "var(--font-dm-sans)" }}>
              Avaliação Concluída
            </p>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 900, color: "var(--vivea-dark)", lineHeight: 1.2 }}>
              Sua prescrição está pronta
            </h1>
          </div>

          <div className="w-full max-w-lg">
            <Suspense
              fallback={
                <div className="text-center text-slate-400 py-20">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Calculando resultado...
                </div>
              }
            >
              <ResultadoContent />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
