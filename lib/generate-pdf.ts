import jsPDF from "jspdf";
import { obterResultado } from "./scoring";
import type { Formula } from "./types";
import type { FormulaComComposicao } from "./data";

// Formata a quantidade sem zeros à toa (1000, 0.5, 144)
function formatarQtd(q: number): string {
  return Number.isInteger(q) ? String(q) : String(q).replace(".", ",");
}

const MARGEM_X = 14;
const LARGURA = 182; // 210 - 2*14
const LIMITE_Y = 258; // abaixo disso, quebra página

export function gerarDocPDF(
  nome: string,
  cpf: string,
  formula: Formula,
  pontos: number,
  formulas: FormulaComComposicao[] = []
): jsPDF {
  const resultado = obterResultado(formula, pontos);

  const dataFormatada = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const corFormula: [number, number, number] =
    formula === "A" ? [196, 96, 96] : formula === "B" ? [200, 118, 58] : [74, 124, 89];

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  // ── CABEÇALHO (logo vetorial Vitalyx) ──────────────────────
  doc.setLineCap("round");
  doc.setLineJoin("round");
  doc.setLineWidth(1.8);
  doc.setDrawColor(14, 140, 140); // teal — braço esquerdo do V
  doc.line(15, 11, 22, 25);
  doc.setDrawColor(143, 214, 75); // lima — braço direito do V
  doc.line(22, 25, 29, 11);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(10, 29, 52); // navy
  doc.text("vitalyx", 33, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(20, 140, 140);
  doc.text("HEALTH", 33.5, 25, { charSpace: 1.4 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Alameda Cauaxi, 293 — Ed. AlphaGreen, conj. 2103/2104", 196, 14, { align: "right" });
  doc.text("Barueri – SP  |  CEP: 06454-020", 196, 19, { align: "right" });
  doc.text("Tel.: (11) 4382-1790  |  Cel.: (11) 98736-6682", 196, 24, { align: "right" });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(MARGEM_X, 42, 196, 42);

  // ── DADOS DO PACIENTE ──────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(nome, MARGEM_X, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`CPF: ${cpf}`, MARGEM_X, 62);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Emitido em ${dataFormatada}`, MARGEM_X, 68);

  // ── PERFIL / FÓRMULA INDICADA ──────────────────────────────
  doc.setFillColor(...corFormula);
  doc.rect(MARGEM_X, 76, LARGURA, 0.8, "F");

  doc.setFillColor(...corFormula);
  doc.roundedRect(MARGEM_X, 82, 42, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("PERFIL INDICADO", 35, 86.8, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(resultado.nome, MARGEM_X, 101);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...corFormula);
  doc.text(resultado.subtitulo, MARGEM_X, 109);

  // Cursor vertical
  let y = 122;

  // Garante espaço; se não houver, cria nova página
  const garantirEspaco = (altura: number) => {
    if (y + altura > LIMITE_Y) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, "F");
      y = 20;
    }
  };

  // ── FÓRMULAS ────────────────────────────────────────────────
  if (formulas.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Composição não cadastrada para este perfil.", MARGEM_X, y);
    y += 8;
  }

  for (const f of formulas) {
    garantirEspaco(20);

    // Nome da fórmula + forma farmacêutica
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    const titulo = f.forma_farmaceutica ? `${f.nome} — ${f.forma_farmaceutica}` : f.nome;
    doc.text(titulo, MARGEM_X, y);
    y += 5;

    // Posologia
    if (f.posologia) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...corFormula);
      const linhasPos = doc.splitTextToSize(f.posologia, LARGURA);
      doc.text(linhasPos, MARGEM_X, y);
      y += linhasPos.length * 4.5 + 1;
    }

    // Linha divisória fina
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(MARGEM_X, y, 196, y);
    y += 5;

    // Compostos
    doc.setFontSize(9.5);
    for (const c of f.composicoes) {
      garantirEspaco(6);
      const qtd = `${formatarQtd(c.quantidade)} ${c.unidade}`;
      const nomeComposto = c.observacao ? `${c.composto} (${c.observacao})` : c.composto;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`•  ${nomeComposto}`, MARGEM_X + 1, y);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(qtd, 196, y, { align: "right" });
      y += 5.5;
    }

    y += 6; // espaço entre fórmulas
  }

  // ── ORIENTAÇÕES ─────────────────────────────────────────────
  garantirEspaco(28);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(MARGEM_X, y, 196, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ORIENTAÇÕES", MARGEM_X, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const orientacao = doc.splitTextToSize(
    "Esta prescrição é baseada em avaliação de perfil clínico integrativo. Para aquisição da fórmula, procure nossa farmácia parceira de manipulação. Em caso de dúvidas sobre o uso, consulte um profissional de saúde habilitado.",
    LARGURA
  );
  doc.text(orientacao, MARGEM_X, y);
  y += orientacao.length * 4.5 + 10;

  // ── ASSINATURA ──────────────────────────────────────────────
  garantirEspaco(20);
  doc.setDrawColor(200, 210, 220);
  doc.line(72, y, 138, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Thiago Possemozer Senra", 105, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Osteopatia / CRO: 396277", 105, y, { align: "center" });

  // ── RODAPÉ (na página atual) ────────────────────────────────
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
  doc.text("Tel.: (11) 4382-1790  |  Cel.: (11) 98736-6682", 105, 291, { align: "center" });

  return doc;
}

/** Retorna o PDF como Buffer (para uso server-side, ex: anexo de e-mail) */
export function gerarPDFBuffer(
  nome: string,
  cpf: string,
  formula: Formula,
  pontos: number,
  formulas: FormulaComComposicao[] = []
): Buffer {
  const doc = gerarDocPDF(nome, cpf, formula, pontos, formulas);
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
