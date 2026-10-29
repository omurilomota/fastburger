import { cookies } from "next/headers";
import { COOKIE_ADMIN, gerarToken, senhaValida, validarToken } from "@/lib/auth";

export async function GET() {
  const store = await cookies();
  return Response.json({ autenticado: validarToken(store.get(COOKIE_ADMIN)?.value) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!senhaValida(String(body?.senha || ""))) {
    return Response.json({ erro: "senha inválida" }, { status: 401 });
  }
  const store = await cookies();
  store.set(COOKIE_ADMIN, gerarToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE_ADMIN);
  return Response.json({ ok: true });
}
