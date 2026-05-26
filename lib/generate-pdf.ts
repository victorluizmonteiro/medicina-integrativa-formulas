import jsPDF from "jspdf";
import { LOGO_BASE64 } from "./logo-b64";
import { obterResultado } from "./scoring";
import type { Formula } from "./types";

export function gerarDocPDF(
  nome: string,
  cpf: string,
  formula: Formula,
  pontos: number
): jsPDF {
  const resultado = obterResultado(formula, pontos);

  const dataFormatada = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // CALM·A = #C46060  VITAL·B = #C8763A  EQUIL·C = #4A7C59
  const corFormula: [number, number, number] =
    formula === "A"
      ? [196, 96, 96]
      : formula === "B"
      ? [200, 118, 58]
      : [74, 124, 89];

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Fundo branco
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  // ── CABEÇALHO ──────────────────────────────────────────────
  doc.addImage(LOGO_BASE64, "PNG", 14, 8, 45, 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Alameda Cauaxi, 293 — Ed. AlphaGreen, conj. 2103/2104",
    196,
    14,
    { align: "right" }
  );
  doc.text("Barueri – SP  |  CEP: 06454-020", 196, 19, { align: "right" });
  doc.text("Tel.: (11) 4382-1790  |  Cel.: (11) 98736-6682", 196, 24, {
    align: "right",
  });

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
  doc.setFillColor(...corFormula);
  doc.rect(14, 76, 182, 0.8, "F");

  doc.setFillColor(...corFormula);
  doc.roundedRect(14, 82, 42, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("FÓRMULA INDICADA", 35, 86.8, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(resultado.nome, 14, 102);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...corFormula);
  doc.text(resultado.subtitulo, 14, 111);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const linhas = doc.splitTextToSize(resultado.descricao, 182);
  doc.text(linhas, 14, 122);

  // ── PONTUAÇÃO ───────────────────────────────────────────────
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

  doc.setDrawColor(200, 210, 220);
  doc.line(72, 262, 138, 262);

  // ── RODAPÉ ──────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 280, 210, 17, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Osteopatia Alphaville  •  Alameda Cauaxi, 293, Ed. AlphaGreen, conj. 2103/2104, Barueri – SP",
    105,
    286,
    { align: "center" }
  );
  doc.text("Tel.: (11) 4382-1790  |  Cel.: (11) 98736-6682", 105, 291, {
    align: "center",
  });

  return doc;
}

/** Retorna o PDF como Buffer (para uso server-side, ex: anexo de e-mail) */
export function gerarPDFBuffer(
  nome: string,
  cpf: string,
  formula: Formula,
  pontos: number
): Buffer {
  const doc = gerarDocPDF(nome, cpf, formula, pontos);
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
