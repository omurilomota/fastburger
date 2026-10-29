import Link from "next/link";
import { Logo } from "./Logo";
import AbreFechaBadge, { type StatusLoja } from "./AbreFechaBadge";

const TICKER = [
  "Pedido direto no WhatsApp",
  "Zero taxa de app",
  "Aberto todas as noites",
  "18h às 23h30",
  "Burger do mês",
  "Dracena",
  "Junqueirópolis",
];

export function Ticker() {
  const linha = TICKER.join("   ★   ");
  return (
    <div className="bg-ink text-cream border-b-[3px] border-ink overflow-hidden py-2">
      <div className="flex w-max animate-marquee font-display text-[11px] uppercase tracking-[0.22em]">
        <span className="px-3 whitespace-nowrap">
          {linha} ★ {linha} ★ {linha} ★ {linha} ★
        </span>
      </div>
    </div>
  );
}

export default function Header({
  waLink,
  status,
}: {
  waLink: string;
  status?: StatusLoja;
}) {
  return (
    <header className="sticky top-0 z-40 bg-paper border-b-[3px] border-ink">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link href="#top" className="shrink-0 hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-display text-sm uppercase tracking-[0.12em]">
            <a href="#cardapio" className="hover:text-tomato transition-colors">
              Cardápio
            </a>
            <a href="#unidades" className="hover:text-tomato transition-colors">
              Unidades
            </a>
            <a href="#como-funciona" className="hover:text-tomato transition-colors">
              Como funciona
            </a>
            <a href="#contato" className="hover:text-tomato transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden xl:block">
              <AbreFechaBadge initial={status} />
            </span>
            <a
              href={waLink}
              target="_blank"
              rel="noopener"
              className="whitespace-nowrap bg-tomato text-cream border-[3px] border-ink shadow-hard-sm px-4 py-2.5 font-display text-sm uppercase tracking-[0.08em] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Pedir no Zap
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
