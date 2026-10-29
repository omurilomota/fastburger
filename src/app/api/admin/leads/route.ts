import { cookies } from "next/headers";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";
import { COOKIE_ADMIN, validarToken } from "@/lib/auth";

export async function GET() {
  const store = await cookies();
  if (!validarToken(store.get(COOKIE_ADMIN)?.value)) {
    return Response.json({ erro: "não autorizado" }, { status: 401 });
  }
  const lista = await db.select().from(leads).orderBy(desc(leads.criado_em)).limit(50);
  return Response.json({ leads: lista });
}
