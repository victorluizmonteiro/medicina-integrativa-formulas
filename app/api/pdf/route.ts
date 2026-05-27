import { NextRequest, NextResponse } from "next/server";
import { gerarPDFBuffer } from "@/lib/generate-pdf";
import type { Formula } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, cpf, formula, pontos } = body as {
      nome: string;
      cpf: string;
      formula: Formula;
      pontos: number;
    };

    // Validação mínima dos parâmetros
    if (!nome || !cpf || !formula || pontos === undefined) {
      return NextResponse.json(
        { erro: "Parâmetros insuficientes para gerar o PDF." },
        { status: 400 }
      );
    }

    if (!["A", "B", "C"].includes(formula)) {
      return NextResponse.json(
        { erro: "Fórmula inválida." },
        { status: 400 }
      );
    }

    const pdfBuffer = gerarPDFBuffer(nome, cpf, formula, pontos);
    // NextResponse aceita Uint8Array (não Buffer diretamente)
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="prescricao-vivea-${formula}.pdf"`,
        "Content-Length": String(pdfBytes.byteLength),
        // Impede cache do PDF no navegador/CDN
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    return NextResponse.json(
      { erro: "Erro interno ao gerar o PDF." },
      { status: 500 }
    );
  }
}
