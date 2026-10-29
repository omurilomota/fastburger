import Image from "next/image";
import AbreFechaBadge, { type StatusLoja } from "./AbreFechaBadge";

function Stat({ valor, label }: { valor: string; label: string }) {
  return (
    <div className="border-[3px] border-ink bg-paper-2 px-3 py-2 shadow-hard-sm">
      <p className="font-display text-xl leading-none">{valor}</p>
      <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft mt-1">{label}</p>
    </div>
  );
}

export default function Hero({ waLink, status }: { waLink: string; status?: StatusLoja }) {
  return (
    <section id="top" className="relative overflow-hidden border-b-[3px] border-ink">
      <div className="absolute inset-0 halftone opacity-[0.07]" />
      <div className="absolute right-[-8%] top-[-12%] w-[420px] h-[420px] bg-mustard rounded-full opacity-25" />
      <div className="absolute left-[-6%] bottom-[-18%] w-[300px] h-[300px] bg-tomato rounded-full opacity-15" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-ink text-cream px-3 py-1 font-display text-[11px] uppercase tracking-[0.18em]">
              Hamburgueria
            </span>
            <AbreFechaBadge initial={status} />
          </div>

          <p className="mt-6 font-hand text-3xl text-tomato -rotate-1 inline-block">
            desde 2025 em Dracena &amp; Junqueirópolis
          </p>

          <h1 className="mt-3 font-display uppercase text-[clamp(2.6rem,7.6vw,5.2rem)] leading-[1.04] tracking-[0.005em]">
            Fome de
            <br />
            meia-noite?
            <br />
            <span className="marker marker-red">a gente tá aberto</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg text-ink-soft leading-relaxed">
            Cardápio digital com foto, preço certinho e adicional na medida. Você monta, a gente faz e o
            pedido chega direto no WhatsApp da unidade. <strong className="text-ink">Sem app. Sem taxa. Sem fila.</strong>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#cardapio"
              className="bg-mustard border-[3px] border-ink shadow-hard px-6 py-3.5 font-display text-lg uppercase tracking-wide hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
            >
              Ver o cardápio
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener"
              className="bg-paper-2 border-[3px] border-ink px-6 py-3.5 font-display text-lg uppercase tracking-wide hover:bg-ink hover:text-cream transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
            <Stat valor="18h–23h30" label="Todos os dias" />
            <Stat valor="2" label="Unidades" />
            <Stat valor="0%" label="Taxa por pedido" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-3 bg-mustard border-[3px] border-ink rotate-2" />
          <div className="relative border-[3px] border-ink bg-cream p-3 shadow-hard-lg">
            <div className="relative h-[360px] sm:h-[440px] overflow-hidden border-[3px] border-ink">
              <Image
                src="/images/burger-big-cheese.jpg"
                alt="Big Cheese — hambúrguer artesanal do Fast Burger"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-mustard/20 mix-blend-overlay" />
              <div className="absolute inset-0 halftone-light opacity-30 mix-blend-overlay" />
            </div>
            <div className="flex items-center justify-between gap-3 px-1 pt-3">
              <span className="font-display text-sm uppercase tracking-[0.12em]">Big Cheese</span>
              <span className="font-display text-lg text-tomato">R$ 32,90</span>
            </div>
          </div>

          <div className="absolute -top-7 -left-6 sm:-left-10 animate-floaty bg-tomato text-cream border-[3px] border-ink shadow-hard px-4 py-2 text-center">
            <span className="block font-display text-3xl leading-none">R$ 30</span>
            <span className="block text-[9px] uppercase tracking-[0.2em] mt-1">o burger da casa</span>
          </div>

          <div className="absolute -bottom-9 -right-3 sm:-right-7 bg-paper-2 border-[3px] border-ink shadow-hard px-5 py-2.5 rotate-[3deg]">
            <span className="font-hand text-2xl leading-none">burger novo toda semana!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
