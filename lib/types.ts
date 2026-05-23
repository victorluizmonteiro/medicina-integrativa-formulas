export type Resposta = 0 | 1 | 2 | 3;

export interface Pergunta {
  id: number;
  texto: string;
  secao: "A" | "B" | "C";
}

export interface DadosCliente {
  nome: string;
  cpf: string;
  idade: string;
  telefone: string;
  email: string;
}

export interface RespostaFormulario {
  cliente: DadosCliente;
  respostas: Record<number, Resposta>;
  pontuacaoTotal: number;
  formula: "A" | "B" | "C";
  dataHora: string;
}

export type Formula = "A" | "B" | "C";

export interface ResultadoFormula {
  formula: Formula;
  nome: string;
  descricao: string;
  subtitulo: string;
  cor: string;
  corGradient: string;
  icone: string;
  pontuacao: number;
}
