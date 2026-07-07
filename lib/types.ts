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
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
}

export interface RespostaFormulario {
  cliente: DadosCliente;
  respostas: Record<number, Resposta>;
  pontuacaoTotal: number;
  formula: "A" | "B" | "C";
  dataHora: string;
}

export type Formula = "A" | "B" | "C";

/** Bloco de texto rico para a descrição do perfil na tela de resultado. */
export type BlocoTexto =
  | { tipo: "citacao"; texto: string }
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "resumo"; texto: string };

export interface ResultadoFormula {
  formula: Formula;
  nome: string;
  descricao: string;             // versão curta (e-mail/PDF)
  subtitulo: string;
  cor: string;
  corGradient: string;
  icone: string;
  pontuacao: number;
  perfilTexto?: BlocoTexto[];     // versão rica (tela de resultado)
}
