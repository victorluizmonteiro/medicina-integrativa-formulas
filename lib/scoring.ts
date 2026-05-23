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
      nome: "Fórmula A",
      subtitulo: "Mente Acelerada",
      descricao:
        "Seu perfil indica hiperexcitação do sistema nervoso — mente em estado de alerta constante, dificuldade de desligar e tensão acumulada. A Fórmula A atua na modulação dos neurotransmissores excitatórios, promovendo calma sem sedação.",
      cor: "#f59e0b",
      corGradient: "from-amber-500 to-orange-500",
      icone: "⚡",
      pontuacao: pontuacao,
    },
    B: {
      formula: "B",
      nome: "Fórmula B",
      subtitulo: "Sem Energia",
      descricao:
        "Seu perfil indica colapso energético com baixa dopamina funcional — fadiga que não melhora com descanso, falta de motivação e corpo pesado. A Fórmula B atua na restauração do eixo HPA e reequilíbrio da dopamina.",
      cor: "#3b82f6",
      corGradient: "from-blue-500 to-cyan-500",
      icone: "🔋",
      pontuacao: pontuacao,
    },
    C: {
      formula: "C",
      nome: "Fórmula C",
      subtitulo: "Instável",
      descricao:
        "Seu perfil indica instabilidade emocional e cognitiva — alternância entre dias bons e ruins, humor oscilante e sono irregular. A Fórmula C atua na estabilização dos sistemas de resposta ao estresse e regulação do ciclo circadiano.",
      cor: "#a855f7",
      corGradient: "from-purple-500 to-violet-600",
      icone: "🌊",
      pontuacao: pontuacao,
    },
  };

  return resultados[formula];
}
