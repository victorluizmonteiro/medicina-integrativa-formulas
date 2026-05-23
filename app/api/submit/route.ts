import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { calcularFormula } from "@/lib/scoring";
import { RespostaFormulario } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "responses.json");

async function lerRespostas(): Promise<RespostaFormulario[]> {
  try {
    const conteudo = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(conteudo);
  } catch {
    return [];
  }
}

async function salvarResposta(resposta: RespostaFormulario) {
  const respostas = await lerRespostas();
  respostas.push(resposta);
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(respostas, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cliente, respostas } = body;

    if (!cliente?.nome || !cliente?.cpf) {
      return NextResponse.json({ erro: "Nome e CPF são obrigatórios" }, { status: 400 });
    }

    if (!respostas || Object.keys(respostas).length !== 30) {
      return NextResponse.json({ erro: "Todas as 30 questões devem ser respondidas" }, { status: 400 });
    }

    const pontuacaoTotal = Object.values(respostas as Record<string, number>).reduce(
      (acc, val) => acc + val,
      0
    );

    const formula = calcularFormula(pontuacaoTotal);

    const registro: RespostaFormulario = {
      cliente,
      respostas,
      pontuacaoTotal,
      formula,
      dataHora: new Date().toISOString(),
    };

    await salvarResposta(registro);

    return NextResponse.json({ formula, pontuacaoTotal, cliente });
  } catch (err) {
    console.error("Erro ao processar formulário:", err);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}
