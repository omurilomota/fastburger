import { db } from "@/db";
import { produtos, categorias, unidades, adicionais, produtoUnidade } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const [produtosList, categoriasList, unidadesList, adicionaisList, dispList] = await Promise.all([
    db.select().from(produtos).where(eq(produtos.ativo, true)).orderBy(produtos.id),
    db.select().from(categorias).where(eq(categorias.ativo, true)).orderBy(categorias.ordem),
    db.select().from(unidades).where(eq(unidades.ativo, true)),
    db.select().from(adicionais).where(eq(adicionais.ativo, true)),
    db.select().from(produtoUnidade),
  ]);

  return Response.json({
    produtos: produtosList.map((p) => ({ ...p, preco: Number(p.preco) })),
    categorias: categoriasList,
    unidades: unidadesList,
    adicionais: adicionaisList.map((a) => ({ ...a, preco: Number(a.preco) })),
    disponibilidade: dispList,
  });
}
