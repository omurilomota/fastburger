"use client";
import { useState } from "react";
import type { Adicional, ItemCarrinho, Unidade } from "@/lib/tipos";
import { brl } from "@/lib/loja";
import { erroTelefone, mascararTelefone, telefoneValido } from "@/lib/telefone";

export type FormPedido = {
  tipo: "entrega" | "retirada";
  nome: string;
  telefone: string;
  endereco: string;
  pagamento: string;
  observacoes: string;
};

const campo =
  "w-full bg-paper border-[3px] border-ink px-3 py-2 text-sm placeholder:text-ink-soft/60 focus:outline-none focus:bg-mustard/25";

export default function CartPanel({
  itens,
  total,
  unidade,
  adicionais,
  form,
  setForm,
  onQtd,
  onRemove,
  onToggleExtra,
  waLink,
}: {
  itens: ItemCarrinho[];
  total: number;
  unidade: Unidade;
  adicionais: Adicional[];
  form: FormPedido;
  setForm: (f: FormPedido) => void;
  onQtd: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onToggleExtra: (itemId: number, adicionalId: number) => void;
  waLink: string;
}) {
  const [aberto, setAberto] = useState<number | null>(null);
  const vazio = itens.length === 0;
  const telOk = telefoneValido(form.telefone);
  const telErro = erroTelefone(form.telefone);
  const podeEnviar = !vazio && telOk;

  return (
    <aside id="pedido" className="min-w-0 lg:sticky lg:top-[92px] scroll-mt-[92px]">
      <div className="border-[3px] border-ink bg-paper-2 shadow-hard-lg">
        <div className="flex items-center justify-between gap-3 bg-ink text-cream px-5 py-3">
          <h3 className="font-display uppercase text-xl tracking-[0.06em]">Seu pedido</h3>
          <span className="text-[10px] uppercase tracking-[0.18em] text-mustard">{unidade.nome}</span>
        </div>

        <div className="p-5 space-y-4 max-h-[42vh] overflow-y-auto">
          {vazio ? (
            <div className="border-[3px] border-dashed border-ink/30 py-10 px-4 text-center">
              <p className="font-hand text-2xl text-ink-soft">Seu carrinho tá vazio...</p>
              <p className="mt-1 text-xs text-ink-soft uppercase tracking-[0.16em]">
                toque em “Adicionar” no cardápio
              </p>
            </div>
          ) : (
            itens.map((it) => {
              const extrasAbertos = aberto === it.id;
              return (
                <div key={it.id} className="border-b-[3px] border-dashed border-ink/20 pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-display uppercase text-base leading-tight">{it.nome}</p>
                      {it.extras.length > 0 && (
                        <p className="mt-1 text-[11px] text-tomato font-semibold">
                          + {it.extras.map((e) => e.nome).join(", ")}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-ink-soft">
                        R$ {brl(it.precoUnitario)} cada
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onQtd(it.id, -1)}
                        aria-label="Diminuir"
                        className="w-7 h-7 grid place-items-center border-[3px] border-ink bg-paper-2 font-display leading-none hover:bg-tomato hover:text-cream transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-display text-lg">{it.qtd}</span>
                      <button
                        onClick={() => onQtd(it.id, 1)}
                        aria-label="Aumentar"
                        className="w-7 h-7 grid place-items-center border-[3px] border-ink bg-paper-2 font-display leading-none hover:bg-mustard transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setAberto(extrasAbertos ? null : it.id)}
                      className="text-[11px] uppercase tracking-[0.14em] font-bold text-ink-soft hover:text-tomato transition-colors"
                    >
                      {extrasAbertos ? "− fechar adicionais" : "+ adicionar extras"}
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg">R$ {brl(it.precoUnitario * it.qtd)}</span>
                      <button
                        onClick={() => onRemove(it.id)}
                        className="text-[11px] uppercase tracking-[0.14em] font-bold text-tomato hover:text-tomato-dark"
                      >
                        remover
                      </button>
                    </div>
                  </div>

                  {extrasAbertos && (
                    <div className="mt-3 border-[3px] border-ink bg-paper p-3 flex flex-wrap gap-2">
                      {adicionais.map((a) => {
                        const marcado = it.extras.some((e) => e.id === a.id);
                        return (
                          <button
                            key={a.id}
                            onClick={() => onToggleExtra(it.id, a.id)}
                            className={`border-[3px] border-ink px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                              marcado ? "bg-pickle text-cream shadow-hard-sm" : "bg-paper-2 hover:bg-mustard"
                            }`}
                          >
                            + {a.nome}{" "}
                            <span className={marcado ? "text-cream/70" : "text-tomato"}>R$ {brl(a.preco)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="border-t-[3px] border-ink p-5 space-y-3 bg-paper">
          <div className="flex gap-2">
            {(["entrega", "retirada"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, tipo: t })}
                className={`flex-1 border-[3px] border-ink py-2 font-display text-xs uppercase tracking-[0.12em] transition-all ${
                  form.tipo === t ? "bg-ink text-cream shadow-hard-sm" : "bg-paper-2 hover:bg-mustard"
                }`}
              >
                {t === "entrega" ? "Entrega" : "Retirada"}
              </button>
            ))}
          </div>

          <input
            className={campo}
            placeholder="Seu nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <div>
            <input
              className={`${campo} ${telErro ? "border-tomato bg-tomato/10" : telOk ? "border-pickle" : ""}`}
              placeholder="WhatsApp: (18) 99999-0103"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={16}
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: mascararTelefone(e.target.value) })}
              aria-invalid={Boolean(telErro)}
            />
            <p
              className={`mt-1 text-[10.5px] font-bold uppercase tracking-[0.08em] ${
                telErro ? "text-tomato" : telOk ? "text-pickle" : "text-ink-soft"
              }`}
            >
              {telErro ?? (telOk ? "Número válido ✓" : "DDD + 9 dígitos, começando com 9")}
            </p>
          </div>
          {form.tipo === "entrega" && (
            <input
              className={campo}
              placeholder="Endereço completo (rua, número, bairro)"
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            />
          )}

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-1.5">Pagamento</p>
            <div className="grid grid-cols-3 gap-2">
              {["PIX", "Cartão", "Dinheiro"].map((p) => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, pagamento: p })}
                  className={`border-[3px] border-ink py-2 font-display text-[11px] uppercase tracking-[0.1em] transition-all ${
                    form.pagamento === p ? "bg-mustard shadow-hard-sm" : "bg-paper-2 hover:bg-mustard/60"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <input
            className={campo}
            placeholder="Observações (sem cebola, caprichar no molho...)"
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          />
        </div>

        <div className="border-t-[3px] border-ink p-5">
          <div className="flex items-end justify-between mb-4">
            <span className="font-display uppercase text-sm tracking-[0.14em]">Total</span>
            <span className="font-display text-3xl leading-none">R$ {brl(total)}</span>
          </div>

          <a
            href={podeEnviar ? waLink : undefined}
            target={podeEnviar ? "_blank" : undefined}
            rel="noopener"
            aria-disabled={!podeEnviar}
            onClick={(e) => {
              if (!podeEnviar) e.preventDefault();
            }}
            className={`block text-center border-[3px] border-ink px-5 py-3.5 font-display text-lg uppercase tracking-[0.08em] transition-all ${
              podeEnviar
                ? "bg-tomato text-cream shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                : "bg-paper-2 text-ink-soft cursor-not-allowed"
            }`}
          >
            {vazio ? "Monte seu pedido" : "Enviar no WhatsApp"}
          </a>

          <p className="mt-3 text-center text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
            {!vazio && !telOk
              ? "Informe um WhatsApp válido para liberar o envio"
              : "Zero taxa · sem intermediário · direto com a unidade"}
          </p>
        </div>
      </div>
    </aside>
  );
}
