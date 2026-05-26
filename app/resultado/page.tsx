"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { obterResultado } from "@/lib/scoring";
import { Formula } from "@/lib/types";
import { gerarDocPDF } from "@/lib/generate-pdf";

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

  const corBorda = formula === "A" ? "border-amber-200" : formula === "B" ? "border-blue-200" : "border-purple-200";
  const corTexto = formula === "A" ? "text-amber-700" : formula === "B" ? "text-blue-700" : "text-purple-700";
  const corBg    = formula === "A" ? "bg-amber-50"   : formula === "B" ? "bg-blue-50"   : "bg-purple-50";
  const gradiente = formula === "A" ? "from-amber-500 to-orange-500" : formula === "B" ? "from-blue-600 to-cyan-500" : "from-purple-500 to-violet-600";

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
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm tracking-wide">Mental ABC</span>
          </div>
          <div className="text-xs text-slate-500 border border-slate-200 rounded-full px-3 py-1 bg-white">
            Resultado da Avaliação
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-start px-4 py-10">
          <div className="text-center mb-8 max-w-lg">
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-widest mb-2">
              Avaliação Concluída
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
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
