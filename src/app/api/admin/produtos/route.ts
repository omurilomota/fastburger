import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { produtos, produtoUnidade, categorias } from "@/db/schema";
import { COOKIE_ADMIN, validarToken } from "@/lib/auth";

async function autorizado() {
  const store = await cookies();
  return validarToken(store.get(COOKIE_ADMIN)?.value);
}

export async function GET() {
  if (!(await autorizado())) return Response.json({ erro: "não autorizado" }, { status: 401 });

  const [lista, cats, disp] = await Promise.all([
    db.select().from(produtos).orderBy(produtos.id),
    db.select().from(categorias),
    db.select().from(produtoUnidade),
  ]);

  return Response.json({
    produtos: lista.map((p) => ({ ...p, preco: Number(p.preco) })),
    categorias: cats,
    disponibilidade: disp,
  });
}

export async function PATCH(req: Request) {
  if (!(await autorizado())) return Response.json({ erro: "não autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = Number(body?.id);
  if (!id) return Response.json({ erro: "id obrigatório" }, { status: 400 });

  const campos: Partial<typeof produtos.$inferInsert> = {};
  if (typeof body?.nome === "string") campos.nome = body.nome;
  if (typeof body?.descricao === "string") campos.descricao = body.descricao;
  if (body?.preco !== undefined && body?.preco !== null && body?.preco !== "") {
    campos.preco = String(Number(body.preco)).slice(0, 10);
  }
  if (typeof body?.imagem === "string") campos.imagem = body.imagem;
  if (typeof body?.esgotado === "boolean") campos.esgotado = body.esgotado;
  if (typeof body?.destaque === "boolean") campos.destaque = body.destaque;
  if (typeof body?.burger_do_mes === "boolean") campos.burger_do_mes = body.burger_do_mes;
  if (typeof body?.ativo === "boolean") campos.ativo = body.ativo;
  if (body?.categoria_id !== undefined) campos.categoria_id = Number(body.categoria_id);

  if (Object.keys(campos).length > 0) {
    await db.update(produtos).set(campos).where(eq(produtos.id, id));
  }

  if (body?.unidade_id && typeof body?.disponivel === "boolean") {
    const unidadeId = Number(body.unidade_id);
    const existente = await db
      .select()
      .from(produtoUnidade)
      .where(and(eq(produtoUnidade.produto_id, id), eq(produtoUnidade.unidade_id, unidadeId)));

    if (existente.length > 0) {
      await db
        .update(produtoUnidade)
        .set({ disponivel: body.disponivel })
        .where(eq(produtoUnidade.id, existente[0].id));
    } else {
      await db.insert(produtoUnidade).values({
        produto_id: id,
        unidade_id: unidadeId,
        disponivel: body.disponivel,
      });
    }
  }

  const [atualizado] = await db.select().from(produtos).where(eq(produtos.id, id));
  return Response.json({ produto: { ...atualizado, preco: Number(atualizado.preco) } });
}

export async function POST(req: Request) {
  if (!(await autorizado())) return Response.json({ erro: "não autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.nome) return Response.json({ erro: "nome obrigatório" }, { status: 400 });

  const [criado] = await db
    .insert(produtos)
    .values({
      nome: String(body.nome),
      descricao: String(body.descricao || ""),
      preco: String(Number(body.preco || 0)),
      imagem: String(body.imagem || "/images/burger-big-cheese.jpg"),
      categoria_id: Number(body.categoria_id || 1),
      destaque: Boolean(body.destaque),
      burger_do_mes: Boolean(body.burger_do_mes),
      ativo: true,
    })
    .returning();

  return Response.json({ produto: { ...criado, preco: Number(criado.preco) } });
}
