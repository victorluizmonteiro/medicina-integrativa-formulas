import { Pergunta } from "./types";

export const PERGUNTAS: Pergunta[] = [
  // QUESTIONÁRIO A — Mente Acelerada
  { id: 1, secao: "A", texto: "Mesmo cansado(a), minha mente continua acelerada" },
  { id: 2, secao: "A", texto: "Tenho pensamentos repetitivos ou 'em looping'" },
  { id: 3, secao: "A", texto: "Cafeína ou estimulantes pioram minha ansiedade ou irritação" },
  { id: 4, secao: "A", texto: "Tenho emoções intensas que demoram a cessar" },
  { id: 5, secao: "A", texto: "Tenho sensibilidade aumentada a luz, sons ou ambientes cheios" },
  { id: 6, secao: "A", texto: "Sinto irritabilidade associada à fadiga" },
  { id: 7, secao: "A", texto: "Sinto tensão interna com dificuldade de concentração (brain fog)" },
  { id: 8, secao: "A", texto: "Acordo já em estado de alerta ou 'ligado(a)'" },
  { id: 9, secao: "A", texto: "Tenho tensão muscular persistente (pescoço, mandíbula ou costas)" },
  { id: 10, secao: "A", texto: "Tenho insônia por hiperatividade mental (não por preocupações externas)" },

  // QUESTIONÁRIO B — Sem Energia
  { id: 11, secao: "B", texto: "Falta motivação mesmo para tarefas simples" },
  { id: 12, secao: "B", texto: "Sinto sensação de vazio mental ou emocional" },
  { id: 13, secao: "B", texto: "Tenho cansaço constante que não melhora com descanso" },
  { id: 14, secao: "B", texto: "Tenho sonolência diurna frequente" },
  { id: 15, secao: "B", texto: "Tenho dificuldade real de sair da cama pela manhã" },
  { id: 16, secao: "B", texto: "Sinto emoções fracas ou embotadas" },
  { id: 17, secao: "B", texto: "Tenho lentificação cognitiva ('mente pesada')" },
  { id: 18, secao: "B", texto: "Preciso de estimulantes para funcionar durante o dia" },
  { id: 19, secao: "B", texto: "Tenho baixa tolerância ao estresse" },
  { id: 20, secao: "B", texto: "Minha energia melhora parcialmente somente à noite" },

  // QUESTIONÁRIO C — Instável
  { id: 21, secao: "C", texto: "Tenho oscilações frequentes de humor" },
  { id: 22, secao: "C", texto: "Alterno dias bons com dias de exaustão total" },
  { id: 23, secao: "C", texto: "Sinto ansiedade alternando com apatia" },
  { id: 24, secao: "C", texto: "Minhas emoções sobem rápido e demoram a cair" },
  { id: 25, secao: "C", texto: "Tenho dificuldade de foco sustentado" },
  { id: 26, secao: "C", texto: "Meu sono é irregular, sem padrão fixo" },
  { id: 27, secao: "C", texto: "Tenho reação exagerada a pequenos estressores" },
  { id: 28, secao: "C", texto: "Sinto instabilidade mental ao longo do dia" },
  { id: 29, secao: "C", texto: "Tenho fadiga intermitente sem padrão claro" },
  { id: 30, secao: "C", texto: "Pioro globalmente em períodos de estresse prolongado" },
];

export const SECOES = {
  A: {
    titulo: "Perfil Hiperexcitatório",
    descricao: "Questões sobre estado de alerta, ansiedade e mente acelerada",
    cor: "amber",
  },
  B: {
    titulo: "Perfil Energético",
    descricao: "Questões sobre energia, motivação e disposição",
    cor: "blue",
  },
  C: {
    titulo: "Perfil de Estabilidade",
    descricao: "Questões sobre humor, foco e regularidade",
    cor: "purple",
  },
};

export const ESCALA = [
  { valor: 0, rotulo: "Nunca" },
  { valor: 1, rotulo: "Raro" },
  { valor: 2, rotulo: "Frequente" },
  { valor: 3, rotulo: "Quase sempre" },
];
