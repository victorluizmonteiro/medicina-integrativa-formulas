export type TomGuia = "neutro" | "positivo" | "negativo" | "dica";

export interface GuiaItem {
  texto: string;
  detalhe?: string;
}

export interface GuiaBloco {
  titulo?: string;
  tom?: TomGuia;
  itens: GuiaItem[];
}

export interface GuiaSecao {
  titulo: string;
  icone?: string;
  objetivo?: string;
  texto?: string;
  blocos?: GuiaBloco[];
}

export interface GuiaConteudo {
  titulo?: string;
  subtitulo?: string;
  secoes: GuiaSecao[];
}
