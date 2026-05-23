"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { obterResultado } from "@/lib/scoring";
import { Formula } from "@/lib/types";
import jsPDF from "jspdf";
import { LOGO_BASE64 } from "@/lib/logo-b64";

const WHATSAPP_FARMACIA = "5511987366682";
const URL_FARMACIA = "https://osteopatiaalphaville.com.br";

function gerarDocPDF(nome: string, cpf: string, formula: Formula, pontos: number) {
  const resultado = obterResultado(formula, pontos);
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const dataFormatada = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const corFormula =
    formula === "A" ? [245, 158, 11] as [number,number,number]
    : formula === "B" ? [37, 99, 235] as [number,number,number]
    : [139, 92, 246] as [number,number,number];

  // Fundo branco
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  // ── CABEÇALHO ──────────────────────────────────────────────
  // Logo (proporção original 448×304 → ~45×30 mm)
  doc.addImage(LOGO_BASE64, "PNG", 14, 8, 45, 30);

  // Texto à direita do cabeçalho
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Alameda Cauaxi, 293 — Ed. AlphaGreen, conj. 2103/2104", 210 - 14, 14, { align: "right" });
  doc.text("Barueri – SP  |  CEP: 06454-020", 210 - 14, 19, { align: "right" });
  doc.text("Tel.: (11) 4382-1790  |  Cel.: (11) 98736-6682", 210 - 14, 24, { align: "right" });

  // Linha divisória abaixo do cabeçalho
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, 42, 196, 42);

  // ── DADOS DO PACIENTE ──────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(nome, 14, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`CPF: ${cpf}`, 14, 62);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Emitido em ${dataFormatada}`, 14, 68);

  // ── FÓRMULA INDICADA ────────────────────────────────────────
  // Linha colorida
  doc.setFillColor(...corFormula);
  doc.rect(14, 76, 182, 0.8, "F");

  // Badge fórmula
  doc.setFillColor(...corFormula);
  doc.roundedRect(14, 82, 40, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("FÓRMULA INDICADA", 34, 86.8, { align: "center" });

  // Nome da fórmula
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(resultado.nome, 14, 102);

  // Subtítulo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...corFormula);
  doc.text(resultado.subtitulo, 14, 111);

  // Descrição
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const linhas = doc.splitTextToSize(resultado.descricao, 182);
  doc.text(linhas, 14, 122);

  // Pontuação
  const yAposDes = 122 + linhas.length * 5 + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("PONTUAÇÃO OBTIDA", 14, yAposDes);

  doc.setFontSize(18);
  doc.setTextColor(...corFormula);
  doc.text(`${pontos}`, 14, yAposDes + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("/ 90 pontos", 14 + doc.getTextWidth(`${pontos}`) + 2, yAposDes + 9);

  // Barra de progresso
  const yBarra = yAposDes + 13;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, yBarra, 182, 3, 1.5, 1.5, "F");
  const larguraBarra = Math.min((pontos / 90) * 182, 182);
  doc.setFillColor(...corFormula);
  doc.roundedRect(14, yBarra, larguraBarra, 3, 1.5, 1.5, "F");

  // ── ORIENTAÇÕES ─────────────────────────────────────────────
  const yOrient = yBarra + 14;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, yOrient, 196, yOrient);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ORIENTAÇÕES", 14, yOrient + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const orientacao = doc.splitTextToSize(
    "Esta prescrição é baseada em avaliação de perfil clínico integrativo. Para aquisição da fórmula, procure nossa farmácia parceira de manipulação. Em caso de dúvidas sobre o uso, consulte um profissional de saúde habilitado.",
    182
  );
  doc.text(orientacao, 14, yOrient + 15);

  // ── ASSINATURA ──────────────────────────────────────────────
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, 255, 196, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Thiago Possemozer Senra", 105, 265, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Osteopatia / CRO: 396277", 105, 271, { align: "center" });

  // Linha da assinatura
  doc.setDrawColor(200, 210, 220);
  doc.setLineWidth(0.3);
  doc.line(72, 262, 138, 262);

  // ── RODAPÉ ──────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 280, 210, 17, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Osteopatia Alphaville  •  Alameda Cauaxi, 293, Ed. AlphaGreen, conj. 2103/2104, Barueri – SP",
    105, 286, { align: "center" }
  );
  doc.text("Tel.: (11) 4382-1790  |  Cel.: (11) 98736-6682", 105, 291, { align: "center" });

  return doc;
}

function ResultadoContent() {
  const params = useSearchParams();
  const formula = (params.get("formula") || "A") as Formula;
  const pontos = Number(params.get("pontos") || 0);
  const nome = params.get("nome") || "";
  const cpf = params.get("cpf") || "";

  const resultado = obterResultado(formula, pontos);
  const [visivel, setVisivel] = useState(false);
  const [enviandoWpp, setEnviandoWpp] = useState(false);
  const [msgWpp, setMsgWpp] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setVisivel(true), 100);
    return () => clearTimeout(t);
  }, []);

  const baixarPDF = () => {
    const doc = gerarDocPDF(nome, cpf, formula, pontos);
    doc.save(`prescricao-${formula}-${nome.replace(/\s/g, "_").toLowerCase()}.pdf`);
  };

  const enviarWhatsApp = async () => {
    setEnviandoWpp(true);
    setMsgWpp("");

    const doc = gerarDocPDF(nome, cpf, formula, pontos);
    const nomeArquivo = `prescricao-${formula}-${nome.replace(/\s/g, "_").toLowerCase()}.pdf`;

    const texto =
      `Olá! Acabei de realizar a avaliação no sistema Mental ABC.\n\n` +
      `*Resultado:* ${resultado.nome} — ${resultado.subtitulo}\n` +
      `*Paciente:* ${nome}\n` +
      `*CPF:* ${cpf}\n` +
      `*Pontuação:* ${pontos} pontos\n\n` +
      `Segue em anexo a prescrição em PDF. Gostaria de adquirir a formulação indicada.`;

    // Tenta compartilhar com arquivo (funciona no celular via Web Share API)
    try {
      const blob = doc.output("blob");
      const arquivo = new File([blob], nomeArquivo, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], title: "Prescrição Mental ABC", text: texto });
        setMsgWpp("");
        setEnviandoWpp(false);
        return;
      }
    } catch {
      // Fallback abaixo
    }

    // Fallback desktop: baixa o PDF e abre o WhatsApp com texto
    doc.save(nomeArquivo);
    const url = `https://wa.me/${WHATSAPP_FARMACIA}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
    setMsgWpp("PDF baixado! Anexe o arquivo na conversa do WhatsApp que abrirá agora.");
    setEnviandoWpp(false);
  };

  const irParaFarmacia = () => window.open(URL_FARMACIA, "_blank");

  const corBorda = formula === "A" ? "border-amber-200" : formula === "B" ? "border-blue-200" : "border-purple-200";
  const corTexto = formula === "A" ? "text-amber-700" : formula === "B" ? "text-blue-700" : "text-purple-700";
  const corBg    = formula === "A" ? "bg-amber-50"   : formula === "B" ? "bg-blue-50"   : "bg-purple-50";
  const gradiente = formula === "A" ? "from-amber-500 to-orange-500" : formula === "B" ? "from-blue-600 to-cyan-500" : "from-purple-500 to-violet-600";

  return (
    <div className={`transition-all duration-700 ${visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
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
          Baixar Prescrição em PDF
        </button>

        <button
          onClick={enviarWhatsApp}
          disabled={enviandoWpp}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-semibold text-white bg-[#25D366] hover:bg-[#20c05a] disabled:opacity-60 transition-all duration-200 shadow-md"
        >
          {enviandoWpp ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
          Enviar Prescrição pelo WhatsApp
        </button>

        {msgWpp && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-amber-600 mt-0.5">📎</span>
            <p className="text-sm text-amber-800">{msgWpp}</p>
          </div>
        )}

        <button
          onClick={irParaFarmacia}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Ir para a Farmácia Parceira
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
