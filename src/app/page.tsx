import { db } from "@/db";
import { produtos, categorias, unidades, adicionais, produtoUnidade } from "@/db/schema";
import { eq } from "drizzle-orm";
import HomePageClient from "./components/HomePageClient";
import { statusLoja } from "@/lib/loja";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [produtosList, categoriasList, unidadesList, adicionaisList, dispList] = await Promise.all([
    db.select().from(produtos).where(eq(produtos.ativo, true)).orderBy(produtos.id),
    db.select().from(categorias).where(eq(categorias.ativo, true)).orderBy(categorias.ordem),
    db.select().from(unidades).where(eq(unidades.ativo, true)),
    db.select().from(adicionais).where(eq(adicionais.ativo, true)),
    db.select().from(produtoUnidade),
  ]);

  return (
    <HomePageClient
      initialProdutos={produtosList.map((p) => ({ ...p, preco: Number(p.preco) }))}
      initialCategorias={categoriasList}
      initialUnidades={unidadesList}
      initialAdicionais={adicionaisList.map((a) => ({ ...a, preco: Number(a.preco) }))}
      initialDisponibilidade={dispList}
      status={statusLoja()}
    />
  );
}
