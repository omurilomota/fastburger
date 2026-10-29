import "dotenv/config";
import { db, pool } from "../src/db";
import {
  adicionais,
  categorias,
  produtoUnidade,
  produtos,
  unidades,
} from "../src/db/schema";
import { sql } from "drizzle-orm";

const CATEGORIES = [
  { nome: "Burgers", ordem: 1 },
  { nome: "Combos", ordem: 2 },
  { nome: "Porções", ordem: 3 },
  { nome: "Bebidas", ordem: 4 },
];

const UNITS = [
  {
    nome: "Fast Burger Dracena",
    endereco: "Av. Brasil, 1200 — Centro",
    telefone: "(18) 99999-0001",
    whatsapp: "5518999990001",
    cidade: "Dracena",
    bairro: "Centro",
    horario_abertura: "18:00",
    horario_fechamento: "23:30",
  },
  {
    nome: "Fast Burger Junqueirópolis",
    endereco: "Rua Belo Horizonte, 850 — Centro",
    telefone: "(18) 99999-0002",
    whatsapp: "5518999990002",
    cidade: "Junqueirópolis",
    bairro: "Centro",
    horario_abertura: "18:00",
    horario_fechamento: "23:30",
  },
];

const ITEMS = [
  {
    categoria: "Burgers",
    nome: "Big Cheese",
    descricao: "Blend 180 g, cheddar duplo, picles, cebola caramelizada e molho da casa.",
    preco: "32.90",
    imagem: "/images/burger-big-cheese.jpg",
    destaque: true,
    burger_do_mes: true,
  },
  {
    categoria: "Burgers",
    nome: "Duplo Bacon",
    descricao: "Dois blends de 120 g, bacon crocante, cheddar e maionese defumada.",
    preco: "39.90",
    imagem: "/images/burger-big-cheese.jpg",
    destaque: true,
  },
  {
    categoria: "Burgers",
    nome: "Cheddar Melt",
    descricao: "Blend 150 g, cheddar cremoso, cebola crispy e pão brioche.",
    preco: "34.90",
    imagem: "/images/burger-big-cheese.jpg",
  },
  {
    categoria: "Burgers",
    nome: "Veggie",
    descricao: "Hambúrguer de grão-de-bico, queijo coalho, rúcula e tomate confit.",
    preco: "29.90",
    imagem: "/images/burger-big-cheese.jpg",
  },
  {
    categoria: "Combos",
    nome: "Combo Big Cheese",
    descricao: "Big Cheese + batata frita + refrigerante lata.",
    preco: "42.90",
    imagem: "/images/burger-combo.jpg",
    destaque: true,
  },
  {
    categoria: "Combos",
    nome: "Combo Duplo Bacon",
    descricao: "Duplo Bacon + batata com cheddar + refrigerante lata.",
    preco: "49.90",
    imagem: "/images/burger-combo.jpg",
  },
  {
    categoria: "Porções",
    nome: "Batata Frita",
    descricao: "Porção crocante com sal e páprica. Serve 2 pessoas.",
    preco: "18.90",
    imagem: "/images/burger-combo.jpg",
  },
  {
    categoria: "Porções",
    nome: "Batata Cheddar Bacon",
    descricao: "Batata frita coberta com cheddar cremoso e bacon.",
    preco: "28.90",
    imagem: "/images/burger-combo.jpg",
  },
  {
    categoria: "Bebidas",
    nome: "Refrigerante Lata",
    descricao: "Coca-Cola, Guaraná ou Fanta, 350 ml.",
    preco: "6.00",
    imagem: "",
  },
  {
    categoria: "Bebidas",
    nome: "Suco de Laranja",
    descricao: "Suco natural de laranja, 400 ml.",
    preco: "9.00",
    imagem: "",
  },
];

const ADDONS = [
  { nome: "Bacon extra", preco: "6.00" },
  { nome: "Cheddar extra", preco: "4.00" },
  { nome: "Ovo", preco: "3.00" },
  { nome: "Carne extra", preco: "10.00" },
];

async function main() {
  const force = process.argv.includes("--force");
  const [existing] = await db.select({ n: sql<number>`count(*)::int` }).from(produtos);
  if ((existing?.n ?? 0) > 0 && !force) {
    console.log("Cardápio já existe — seed ignorado (use --force).");
    return;
  }

  if (force) {
    await db.delete(produtoUnidade);
    await db.delete(produtos);
    await db.delete(categorias);
    await db.delete(unidades);
    await db.delete(adicionais);
  }

  const unitRows = await db.insert(unidades).values(UNITS).returning();
  const catRows = await db.insert(categorias).values(CATEGORIES).returning();
  const catId = (nome: string) => catRows.find((row) => row.nome === nome)!.id;

  const productRows = await db
    .insert(produtos)
    .values(
      ITEMS.map((item) => ({
        categoria_id: catId(item.categoria),
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        imagem: item.imagem,
        destaque: item.destaque ?? false,
        burger_do_mes: item.burger_do_mes ?? false,
      })),
    )
    .returning();

  await db.insert(adicionais).values(ADDONS);

  await db.insert(produtoUnidade).values(
    productRows.flatMap((product) =>
      unitRows.map((unit) => ({
        produto_id: product.id,
        unidade_id: unit.id,
        disponivel: true,
      })),
    ),
  );

  console.log(`Seed concluído: ${unitRows.length} unidades, ${productRows.length} produtos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
