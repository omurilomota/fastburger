import type { Metadata } from "next";
import { Anton, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Fast Burger — Cardápio Digital | Dracena & Junqueirópolis",
  description:
    "Hamburgueria artesanal em Dracena e Junqueirópolis. Cardápio digital com fotos, preços e pedido direto no WhatsApp. Sem taxa, sem app de terceiros.",
  openGraph: {
    title: "Fast Burger — Cardápio Digital",
    description: "Peça direto no WhatsApp. Sem taxa, sem fila, sem app.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${space.variable} ${caveat.variable}`}>
      <body className="bg-paper text-ink antialiased font-sans">{children}</body>
    </html>
  );
}