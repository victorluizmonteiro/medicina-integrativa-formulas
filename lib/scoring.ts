import { Formula, ResultadoFormula } from "./types";

export function calcularFormula(pontuacaoTotal: number): Formula {
  if (pontuacaoTotal >= 18) return "B";
  if (pontuacaoTotal >= 10) return "C";
  return "A";
}

export function obterResultado(formula: Formula, pontuacao: number): ResultadoFormula {
  const resultados: Record<Formula, ResultadoFormula> = {
    A: {
      formula: "A",
      nome: "SERENA",
      subtitulo: "Mente em paz. Corpo relaxado.",
      descricao:
        "Sua mente está em overdrive — pensa demais, tensa-se sem motivo e não consegue desligar mesmo quando está exausta. Isso não é frescura: é hiperexcitação fisiológica real. A Fórmula SERENA atua nos circuitos excitatórios do sistema nervoso, reduzindo o estado de alerta crônico e devolvendo calma genuína — sem sedação, sem perda de foco.",
      cor: "#f59e0b",
      corGradient: "from-amber-500 to-orange-500",
      icone: "🌿",
      pontuacao: pontuacao,
    },
    B: {
      formula: "B",
      nome: "VIVA",
      subtitulo: "Energia de volta. Prazer restaurado.",
      descricao:
        "Corpo pesado, motivação zero — você levanta sem querer, precisa de café para funcionar e o prazer pelas coisas simples sumiu. Isso é colapso energético real, não preguiça. A Fórmula VIVA restaura o eixo energético e a dopamina funcional, devolvendo disposição real, clareza mental e o prazer de viver o dia a dia.",
      cor: "#2563eb",
      corGradient: "from-blue-600 to-cyan-500",
      icone: "✨",
      pontuacao: pontuacao,
    },
    C: {
      formula: "C",
      nome: "ÂNCORA",
      subtitulo: "Estabilidade emocional. Clareza mental.",
      descricao:
        "Um dia bem, outro destruído — humor que sobe e cai, sono sem padrão, emoções que não têm freio. Essa oscilação constante é sinal de um sistema nervoso sem base estável. A Fórmula ÂNCORA estabiliza sua resposta ao estresse, ancora o humor e o sono em um equilíbrio sustentável — para você parar de depender do acaso para ter um bom dia.",
      cor: "#9333ea",
      corGradient: "from-purple-600 to-violet-600",
      icone: "⚓",
      pontuacao: pontuacao,
    },
  };

  return resultados[formula];
}
