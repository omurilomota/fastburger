import Link from "next/link";
import { LogoMark } from "./Logo";
import type { Unidade } from "@/lib/tipos";

export default function Footer({ unidades }: { unidades: Unidade[] }) {
  return (
    <footer id="contato" className="bg-ink text-cream border-t-[3px] border-ink">
      <div className="bg-tomato border-b-[3px] border-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="font-display uppercase text-2xl md:text-3xl tracking-wide">
            Bateu a fome? Pede no zap.
          </p>
          <p className="font-hand text-2xl text-cream/90">sem taxa, sem app, sem enrolação</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid md:grid-cols-[1.3fr_1fr_1fr] gap-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-12 h-12 bg-cream border-[3px] border-ink rounded-full">
              <LogoMark className="w-8 h-8" />
            </span>
            <span className="font-display uppercase text-3xl leading-none">
              Fast<span className="text-tomato"> Burger</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-cream/60 leading-relaxed">
            Hamburgueria artesanal com duas unidades no oeste paulista. Cardápio próprio, pedido direto no
            WhatsApp e nenhum app cobrando comissão no meio.
          </p>
          <p className="mt-6 font-hand text-2xl text-mustard -rotate-1">feito na chapa, não no link 🔥</p>
        </div>

        <div>
          <h3 className="font-display uppercase text-sm tracking-[0.22em] text-mustard mb-4">Unidades</h3>
          <ul className="space-y-5">
            {unidades.map((u) => (
              <li key={u.id}>
                <p className="font-display uppercase text-lg leading-none">{u.nome}</p>
                <p className="mt-1.5 text-sm text-cream/60">{u.endereco}</p>
                <p className="text-sm text-cream/60">{u.cidade}</p>
                <p className="mt-1.5 text-sm text-cream/80">{u.telefone}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display uppercase text-sm tracking-[0.22em] text-mustard mb-4">Horários</h3>
          <p className="text-cream/80 text-sm leading-relaxed">
            Segunda a domingo
            <br />
            <span className="font-display text-2xl text-cream">18h00 às 23h30</span>
          </p>
          <p className="mt-5 text-cream/60 text-sm leading-relaxed">
            Entrega e retirada nas duas unidades.
            <br />
            PIX, cartão ou dinheiro.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-block border-[3px] border-cream/40 px-3 py-2 font-display text-[11px] uppercase tracking-[0.16em] text-cream/70 hover:bg-cream hover:text-ink transition-colors"
          >
            Área do dono
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col md:flex-row justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-cream/40">
          <p>© {new Date().getFullYear()} Fast Burger · Dracena &amp; Junqueirópolis</p>
          <p>Site como produto mensal</p>
        </div>
      </div>
    </footer>
  );
}
