import { db } from "@/db";
import { leads } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const telefone = String(body?.telefone || "").trim();
  if (!telefone) return Response.json({ erro: "telefone obrigatório" }, { status: 400 });

  await db.insert(leads).values({
    telefone,
    consentimento: body?.consentimento !== false,
    origem: "site",
  });

  return Response.json({ ok: true });
}
