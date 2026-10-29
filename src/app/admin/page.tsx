import { cookies } from "next/headers";
import type { Metadata } from "next";
import { COOKIE_ADMIN, validarToken } from "@/lib/auth";
import AdminLogin from "@/app/components/AdminLogin";
import AdminPanel from "@/app/components/AdminPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Painel do dono — Fast Burger",
  description: "CMS do Fast Burger: cardápio, preços, disponibilidade e contatos.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const store = await cookies();
  const autenticado = validarToken(store.get(COOKIE_ADMIN)?.value);

  if (!autenticado) return <AdminLogin />;
  return <AdminPanel />;
}
