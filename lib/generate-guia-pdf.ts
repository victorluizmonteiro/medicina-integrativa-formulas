import jsPDF from "jspdf";
import type { GuiaConteudo, GuiaBloco, TomGuia } from "./guia";

const MX = 16; // margem esquerda
const PW = 178; // largura útil (210 - 2*16)
const LIMY = 264; // limite antes de quebrar página
type RGB = [number, number, number];

// Cores por tom do bloco
const TOM: Record<TomGuia, { cor: RGB; bg: RGB }> = {
  positivo: { cor: [46, 158, 136], bg: [228, 243, 238] },
  negativo: { cor: [199, 122, 46], bg: [251, 240, 228] },
  dica: { cor: [14, 140, 140], bg: [225, 241, 240] },
  neutro: { cor: [71, 85, 105], bg: [242, 246, 248] },
};

/** Desenha o logo Vitalyx (vetorial) centrado, claro para fundo escuro. */
function logoClaro(doc: jsPDF, cx: number, y: number) {
  doc.setLineCap("round");
  doc.setLineJoin("round");
  doc.setLineWidth(2);
  doc.setDrawColor(22, 192, 201); // teal
  doc.line(cx - 20, y, cx - 12, y + 16);
  doc.setDrawColor(143, 214, 75); // lima
  doc.line(cx - 12, y + 16, cx - 4, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("vitalyx", cx - 1, y + 12);
}

export function gerarGuiaPDFBuffer(
  nomeCliente: string,
  perfilNome: string,
  perfilCor: RGB,
  guia: GuiaConteudo
): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ── CAPA ────────────────────────────────────────────────────
  doc.setFillColor(10, 29, 52); // navy
  doc.rect(0, 0, 210, 297, "F");
  logoClaro(doc, 105, 48);

  doc.setDrawColor(...perfilCor);
  doc.setLineWidth(0.8);
  doc.line(70, 96, 140, 96);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  const titulo = guia.titulo ?? `Guia do Perfil — ${perfilNome}`;
  const tLines = doc.splitTextToSize(titulo, 150);
  doc.text(tLines, 105, 128, { align: "center" });

  if (guia.subtitulo) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(154, 191, 168);
    const sLines = doc.splitTextToSize(guia.subtitulo, 150);
    doc.text(sLines, 105, 128 + tLines.length * 10 + 4, { align: "center" });
  }

  doc.setFontSize(10);
  doc.setTextColor(200, 210, 220);
  doc.text(`Preparado para ${nomeCliente.split(" ")[0]}`, 105, 250, { align: "center" });

  // ── CONTEÚDO ────────────────────────────────────────────────
  doc.addPage();
  let y = 22;

  const novaPagina = () => {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");
    y = 22;
  };
  const garantir = (h: number) => {
    if (y + h > LIMY) novaPagina();
  };

  for (const secao of guia.secoes) {
    garantir(24);

    // Cabeçalho da seção
    doc.setFillColor(...perfilCor);
    doc.rect(MX, y - 4, 3, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(secao.titulo, MX + 7, y + 1.5);
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(MX, y, MX + PW, y);
    y += 6;

    // Objetivo
    if (secao.objetivo) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const l = doc.splitTextToSize(secao.objetivo, PW);
      garantir(l.length * 4.5 + 3);
      doc.text(l, MX, y);
      y += l.length * 4.5 + 3;
    }

    // Texto simples da seção
    if (secao.texto) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const l = doc.splitTextToSize(secao.texto, PW);
      garantir(l.length * 4.8 + 3);
      doc.text(l, MX, y);
      y += l.length * 4.8 + 4;
    }

    // Blocos
    for (const bloco of secao.blocos ?? []) {
      renderBloco(doc, bloco, garantir, () => y, (nv) => { y = nv; });
    }

    y += 4; // espaço entre seções
  }

  // ── RODAPÉ + numeração (todas as páginas de conteúdo) ───────
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(MX, 285, MX + PW, 285);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Vitalyx Health — Guia do Perfil", MX, 290);
    doc.text(`${p - 1}`, MX + PW, 290, { align: "right" });
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

function renderBloco(
  doc: jsPDF,
  bloco: GuiaBloco,
  garantir: (h: number) => void,
  getY: () => number,
  setY: (v: number) => void
) {
  const tom = TOM[bloco.tom ?? "neutro"];
  let y = getY();

  // Rótulo do bloco (pílula colorida)
  if (bloco.titulo) {
    garantir(9);
    y = getY();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const w = Math.min(doc.getTextWidth(bloco.titulo) + 8, PW);
    doc.setFillColor(...tom.bg);
    doc.roundedRect(MX, y - 4, w, 6.5, 1.5, 1.5, "F");
    doc.setTextColor(...tom.cor);
    doc.text(bloco.titulo, MX + 4, y + 0.4);
    y += 8;
    setY(y);
  }

  // Itens
  for (const item of bloco.itens) {
    const detalheLines = item.detalhe
      ? doc.splitTextToSize(item.detalhe, PW - 10)
      : [];
    const alturaItem = 5.5 + detalheLines.length * 4;
    garantir(alturaItem);
    y = getY();

    // marcador (bolinha na cor do tom)
    doc.setFillColor(...tom.cor);
    doc.circle(MX + 2, y - 1, 1, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.8);
    doc.setTextColor(30, 41, 59);
    doc.text(item.texto, MX + 6, y);
    y += 4.6;

    if (detalheLines.length) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.3);
      doc.setTextColor(120, 133, 150);
      doc.text(detalheLines, MX + 6, y);
      y += detalheLines.length * 4 + 1;
    }
    setY(y);
  }

  setY(getY() + 3);
}
