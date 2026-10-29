"use client";
import type { Unidade } from "@/lib/tipos";

export default function UnidadesSelector({
  unidades,
  selecionadaId,
  onSelect,
}: {
  unidades: Unidade[];
  selecionadaId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <section id="unidades" className="relative border-b-[3px] border-ink bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-tomato">01 — Unidades</p>
            <h2 className="mt-3 font-display uppercase text-[clamp(2rem,5vw,3.4rem)] leading-[1.05]">
              Onde você <span className="marker">pega o pedido</span>
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">
            Escolha a unidade e o pedido cai direto no WhatsApp dela. Endereço, telefone e horário de cada
            uma já no cardápio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {unidades.map((u, i) => {
            const selecionada = u.id === selecionadaId;
            return (
              <button
                key={u.id}
                onClick={() => onSelect(u.id)}
                className={`text-left relative border-[3px] border-ink transition-all duration-200 ${
                  selecionada
                    ? "bg-mustard shadow-hard-lg"
                    : "bg-paper shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                }`}
              >
                <div className="perf h-2.5 opacity-25" />
                <div className="px-6 pb-6 pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-display text-4xl leading-none opacity-25">0{i + 1}</span>
                      <h3 className="font-display uppercase text-3xl leading-[1.05] mt-2">{u.nome}</h3>
                    </div>
                    {selecionada ? (
                      <span className="animate-stamp bg-tomato text-cream border-[3px] border-ink px-3 py-1 font-display text-[11px] uppercase tracking-[0.16em] -rotate-6 shrink-0">
                        Você está aqui
                      </span>
                    ) : (
                      <span className="font-hand text-xl text-ink-soft shrink-0 -rotate-2">escolher →</span>
                    )}
                  </div>

                  <div className="mt-5 space-y-2 text-sm">
                    <p className="flex items-start gap-2.5">
                      <span className="mt-[2px] grid place-items-center w-5 h-5 shrink-0 bg-ink text-cream text-[10px] font-bold rounded-full">
                        1
                      </span>
                      <span>
                        {u.endereco}
                        {u.bairro ? ` — ${u.bairro}` : ""} · {u.cidade}
                      </span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <span className="mt-[2px] grid place-items-center w-5 h-5 shrink-0 bg-ink text-cream text-[10px] font-bold rounded-full">
                        2
                      </span>
                      <span>{u.telefone}</span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <span className="mt-[2px] grid place-items-center w-5 h-5 shrink-0 bg-ink text-cream text-[10px] font-bold rounded-full">
                        3
                      </span>
                      <span className="uppercase tracking-wide font-semibold">
                        {u.dias_funcionamento} · {u.horario_abertura} às {u.horario_fechamento}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`mt-6 inline-flex items-center gap-2 border-[3px] border-ink px-4 py-2 font-display text-sm uppercase tracking-[0.1em] ${
                      selecionada ? "bg-tomato text-cream" : "bg-ink text-cream"
                    }`}
                  >
                    {selecionada ? "Pedido vai pra cá" : "Pedir nesta unidade"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
