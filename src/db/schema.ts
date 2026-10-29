import {
  pgTable,
  serial,
  text,
  varchar,
  decimal,
  boolean,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const unidades = pgTable("unidades", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  endereco: text("endereco").notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  bairro: varchar("bairro", { length: 100 }),
  ativo: boolean("ativo").default(true).notNull(),
  horario_abertura: varchar("horario_abertura", { length: 10 }).default("18:00").notNull(),
  horario_fechamento: varchar("horario_fechamento", { length: 10 }).default("23:30").notNull(),
  dias_funcionamento: varchar("dias_funcionamento", { length: 20 }).default("seg-dom").notNull(),
  criado_em: timestamp("criado_em").defaultNow().notNull(),
});

export const categorias = pgTable("categorias", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  ordem: integer("ordem").default(0).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
});

export const produtos = pgTable("produtos", {
  id: serial("id").primaryKey(),
  categoria_id: integer("categoria_id")
    .references(() => categorias.id)
    .notNull(),
  nome: varchar("nome", { length: 200 }).notNull(),
  descricao: text("descricao")
    .notNull()
    .default(""),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  imagem: text("imagem")
    .notNull()
    .default(""),
  destaque: boolean("destaque").default(false).notNull(),
  esgotado: boolean("esgotado").default(false).notNull(),
  burger_do_mes: boolean("burger_do_mes").default(false).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  criado_em: timestamp("criado_em").defaultNow().notNull(),
});

export const produtoUnidade = pgTable(
  "produto_unidade",
  {
    id: serial("id").primaryKey(),
    produto_id: integer("produto_id")
      .references(() => produtos.id)
      .notNull(),
    unidade_id: integer("unidade_id")
      .references(() => unidades.id)
      .notNull(),
    disponivel: boolean("disponivel").default(true).notNull(),
  },
  (t) => [uniqueIndex("produto_unidade_unique").on(t.produto_id, t.unidade_id)],
);

export const adicionais = pgTable("adicionais", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
});

export const pedidos = pgTable("pedidos", {
  id: serial("id").primaryKey(),
  unidade_id: integer("unidade_id").references(() => unidades.id),
  cliente_nome: varchar("cliente_nome", { length: 100 }).default(""),
  cliente_telefone: varchar("cliente_telefone", { length: 20 }).default(""),
  itens_json: text("itens_json").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pendente").notNull(),
  criado_em: timestamp("criado_em").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).default(""),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  origem: varchar("origem", { length: 60 }).default("site").notNull(),
  consentimento: boolean("consentimento").default(true).notNull(),
  criado_em: timestamp("criado_em").defaultNow().notNull(),
});
