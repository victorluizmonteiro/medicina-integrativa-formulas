import { Formula, ResultadoFormula } from "./types";

/** Mapeia o perfil do banco (1,2,3) para a letra de apresentação (A,B,C). */
export const PERFIL_PARA_FORMULA: Record<number, Formula> = {
  1: "A",
  2: "B",
  3: "C",
};

/** Inverso: letra (A,B,C) → perfil do banco (1,2,3). */
export const FORMULA_PARA_PERFIL: Record<Formula, number> = {
  A: 1,
  B: 2,
  C: 3,
};

/** Metadados de pergunta necessários para pontuar. */
export interface PerguntaScoring {
  id: number;
  perfil_id: number;
  peso_sentinela: number; // 0 = não sentinela
}

export interface PontuacaoPerfil {
  perfilId: number;
  formula: Formula;
  bruto: number; // pontos absolutos (com bônus de sentinela)
  teto: number; // máximo possível do perfil
  base100: number; // bruto normalizado para 0–100
}

export interface ResultadoCalculo {
  formula: Formula; // perfil vencedor (letra)
  perfilId: number; // perfil vencedor (id)
  pontos: number; // base-100 do vencedor (0–100, arredondado)
  detalhes: PontuacaoPerfil[];
}

/**
 * Calcula a pontuação de cada perfil e retorna o vencedor.
 *
 * Regras:
 *  - cada resposta vale de 0 a 3;
 *  - perguntas sentinela somam `peso_sentinela` a mais, mas SÓ quando a
 *    resposta for > 0;
 *  - cada perfil é normalizado para uma base comum de 100 pontos
 *    (bruto ÷ teto × 100), para os três competirem em pé de igualdade
 *    independentemente da quantidade de perguntas e dos pesos;
 *  - vence o perfil com maior valor na base 100.
 */
export function calcularResultado(
  perguntas: PerguntaScoring[],
  respostas: Record<string | number, number>
): ResultadoCalculo {
  const porPerfil = new Map<number, { bruto: number; teto: number }>();

  for (const p of perguntas) {
    const valor = Number(respostas[p.id] ?? respostas[String(p.id)] ?? 0);
    const bonus = valor > 0 ? p.peso_sentinela : 0;
    const tetoPergunta = 3 + p.peso_sentinela; // valor máx (3) já ativa o bônus

    const acc = porPerfil.get(p.perfil_id) ?? { bruto: 0, teto: 0 };
    acc.bruto += valor + bonus;
    acc.teto += tetoPergunta;
    porPerfil.set(p.perfil_id, acc);
  }

  const detalhes: PontuacaoPerfil[] = [...porPerfil.entries()].map(
    ([perfilId, { bruto, teto }]) => ({
      perfilId,
      formula: PERFIL_PARA_FORMULA[perfilId],
      bruto,
      teto,
      base100: teto > 0 ? (bruto / teto) * 100 : 0,
    })
  );

  const vencedor = detalhes.reduce((melhor, atual) =>
    atual.base100 > melhor.base100 ? atual : melhor
  );

  return {
    formula: vencedor.formula,
    perfilId: vencedor.perfilId,
    pontos: Math.round(vencedor.base100),
    detalhes,
  };
}

export function obterResultado(formula: Formula, pontuacao: number): ResultadoFormula {
  const resultados: Record<Formula, ResultadoFormula> = {
    A: {
      formula: "A",
      nome: "CALM·A",
      subtitulo: "Mente em paz. Alerta sob controle.",
      descricao:
        "Sua mente está em overdrive — pensa demais, tensa-se sem motivo e não consegue desligar mesmo quando está exausta. Isso não é frescura: é hiperexcitação fisiológica real. A Fórmula CALM·A atua nos circuitos excitatórios do sistema nervoso, reduzindo o estado de alerta crônico e devolvendo calma genuína — sem sedação, sem perda de foco.",
      cor: "#C46060",
      corGradient: "from-[#C46060] to-[#d4857f]",
      icone: "⚡",
      pontuacao: pontuacao,
    },
    B: {
      formula: "B",
      nome: "VITAL·B",
      subtitulo: "Energia de volta. Prazer restaurado.",
      descricao:
        "Corpo pesado, motivação zero — você levanta sem querer, precisa de café para funcionar e o prazer pelas coisas simples sumiu. Isso é colapso energético real, não preguiça. A Fórmula VITAL·B restaura o eixo energético e a dopamina funcional, devolvendo disposição real, clareza mental e o prazer de viver o dia a dia.",
      cor: "#C8763A",
      corGradient: "from-[#C8763A] to-[#d4955e]",
      icone: "🌑",
      pontuacao: pontuacao,
    },
    C: {
      formula: "C",
      nome: "EQUIL·C",
      subtitulo: "Estabilidade emocional. Clareza mental.",
      descricao:
        "Um dia bem, outro destruído — humor que sobe e cai, sono sem padrão, emoções que não têm freio. Essa oscilação constante é sinal de um sistema nervoso sem base estável. A Fórmula EQUIL·C estabiliza sua resposta ao estresse, ancora o humor e o sono em um equilíbrio sustentável — para você parar de depender do acaso para ter um bom dia.",
      cor: "#4A7C59",
      corGradient: "from-[#4A7C59] to-[#6B9E7A]",
      icone: "🌊",
      pontuacao: pontuacao,
    },
  };

  return resultados[formula];
}
