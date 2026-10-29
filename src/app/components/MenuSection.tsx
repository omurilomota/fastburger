"use client";
import Image from "next/image";
import { useState } from "react";
import type { Categoria, Produto } from "@/lib/tipos";
import { brl } from "@/lib/loja";

export default function MenuSection({
  produtos,
  categorias,
  indisponiveis,
  onAdd,
}: {
  produtos: Produto[];
  categorias: Categoria[];
  indisponiveis: Set<number>;
  onAdd: (p: Produto) => void;
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | "todas">("todas");

  const lista = categoriaAtiva === "todas" ? produtos : produtos.filter((p) => p.categoria_id === categoriaAtiva);
  const ordenadas = [...categorias].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="min-w-0">
      <div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-tomato">02 — Cardápio</p>
            <h2 className="mt-3 font-display uppercase text-[clamp(2rem,5vw,3.4rem)] leading-[1.08]">
              O que tem <span className="marker">na chapa hoje</span>
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">
            Preço de verdade, foto de verdade e disponibilidade atualizada pela cozinha. Item que acabou
            aparece como esgotado.
          </p>
        </div>

        <div className="sticky top-[72px] z-30 py-3 bg-paper/95 backdrop-blur-sm border-y-[3px] border-ink mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoriaAtiva("todas")}
              className={`shrink-0 border-[3px] border-ink px-4 py-2 font-display text-sm uppercase tracking-[0.1em] transition-all ${
                categoriaAtiva === "todas"
                  ? "bg-ink text-cream shadow-hard-sm"
                  : "bg-paper-2 hover:bg-mustard"
              }`}
            >
              Tudo
            </button>
            {ordenadas.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaAtiva(c.id)}
                className={`shrink-0 border-[3px] border-ink px-4 py-2 font-display text-sm uppercase tracking-[0.1em] transition-all ${
                  categoriaAtiva === c.id
                    ? "bg-ink text-cream shadow-hard-sm"
                    : "bg-paper-2 hover:bg-mustard"
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>
        </div>

        {lista.length === 0 ? (
          <p className="border-[3px] border-dashed border-ink/40 p-10 text-center text-ink-soft">
            Nada nesta categoria por enquanto.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {lista.map((p) => {
              const esgotado = p.esgotado || indisponiveis.has(p.id);
              return (
                <article
                  key={p.id}
                  className={`group relative flex flex-col border-[3px] border-ink bg-paper-2 shadow-hard transition-all duration-200 ${
                    esgotado
                      ? "opacity-75"
                      : "hover:-translate-y-1 hover:shadow-hard-lg"
                  }`}
                >
                  <div className="relative h-52 border-b-[3px] border-ink overflow-hidden">
                    <Image
                      src={p.imagem || "/images/burger-big-cheese.jpg"}
                      alt={p.nome}
                      fill
                      sizes="(max-width: 768px) 92vw, 34vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 halftone-light opacity-20 mix-blend-overlay" />

                    {p.burger_do_mes && (
                      <span className="absolute top-3 left-3 -rotate-6 bg-mustard border-[3px] border-ink px-3 py-1 font-display text-[11px] uppercase tracking-[0.14em] shadow-hard-sm">
                        Burger do mês
                      </span>
                    )}
                    {p.destaque && !p.burger_do_mes && (
                      <span className="absolute top-3 left-3 -rotate-6 bg-pickle text-cream border-[3px] border-ink px-3 py-1 font-display text-[11px] uppercase tracking-[0.14em] shadow-hard-sm">
                        Mais pedido
                      </span>
                    )}

                    {esgotado && (
                      <div className="absolute inset-0 grid place-items-center bg-ink/45">
                        <span className="rotate-[-8deg] bg-tomato text-cream border-[3px] border-ink px-4 py-2 font-display text-lg uppercase tracking-[0.14em] shadow-hard">
                          Esgotado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display uppercase text-2xl leading-[1.1]">{p.nome}</h3>
                    <p className="mt-2.5 text-sm text-ink-soft leading-snug flex-1">{p.descricao}</p>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <span className="block text-[9.5px] uppercase tracking-[0.2em] text-ink-soft">por</span>
                        <span className="font-display text-3xl leading-none">R$ {brl(p.preco)}</span>
                      </div>
                      <button
                        disabled={esgotado}
                        onClick={() => onAdd(p)}
                        className="bg-mustard border-[3px] border-ink shadow-hard-sm px-4 py-2 font-display text-sm uppercase tracking-[0.08em] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                      >
                        {esgotado ? "Indisponível" : "Adicionar"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
