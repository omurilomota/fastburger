export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  destaque: boolean;
  burger_do_mes: boolean;
  esgotado: boolean;
  ativo: boolean;
  categoria_id: number;
};

export type Categoria = {
  id: number;
  nome: string;
  ordem: number;
};

export type Unidade = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  cidade: string;
  bairro: string | null;
  ativo: boolean;
  horario_abertura: string;
  horario_fechamento: string;
  dias_funcionamento: string;
};

export type Adicional = {
  id: number;
  nome: string;
  preco: number;
  ativo: boolean;
};

export type Disponibilidade = {
  produto_id: number;
  unidade_id: number;
  disponivel: boolean;
};

export type ItemCarrinho = {
  id: number;
  nome: string;
  imagem: string;
  qtd: number;
  precoUnitario: number;
  extras: { id: number; nome: string; preco: number }[];
};
