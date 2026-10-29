"use client";
import { useState } from "react";
import { erroTelefone, mascararTelefone, telefoneValido } from "@/lib/telefone";

export default function Fidelidade() {
  const [telefone, setTelefone] = useState("");
  const [consentimento, setConsentimento] = useState(true);
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");

  const telOk = telefoneValido(telefone);
  const telErro = erroTelefone(telefone);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!telOk) return;
    setEstado("enviando");
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, consentimento }),
      });
      setEstado(r.ok ? "ok" : "erro");
    } catch {
      setEstado("erro");
    }
  }

  return (
    <section className="relative bg-mustard border-b-[3px] border-ink overflow-hidden">
      <div className="absolute inset-0 halftone opacity-25" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-ink/70">Clube do Sela</p>
          <h2 className="mt-3 font-display uppercase text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[1.08]">
            Peça pelo site e ganhe <span className="marker marker-red">frete grátis</span>
          </h2>
          <p className="mt-4 max-w-lg text-ink/80 leading-relaxed">
            Deixa seu WhatsApp aqui e a gente manda o cupom, os burgers do mês e as promoções da semana.
            Você escolhe se quer receber — sem spam, sem compartilhamento.
          </p>
        </div>

        <div className="border-[3px] border-ink bg-paper-2 shadow-hard p-6">
          {estado === "ok" ? (
            <div className="text-center py-6">
              <p className="font-display uppercase text-2xl">Anotado! 🎉</p>
              <p className="mt-2 text-sm text-ink-soft">
                Seu cupom chega no WhatsApp {telefone} nos próximos minutos.
              </p>
              <button
                onClick={() => {
                  setEstado("idle");
                  setTelefone("");
                }}
                className="mt-5 border-[3px] border-ink bg-mustard px-4 py-2 font-display text-sm uppercase tracking-[0.1em] shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Cadastrar outro
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1.5">
                  Seu WhatsApp
                </label>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
                  placeholder="(18) 99999-0000"
                  inputMode="tel"
                  autoComplete="tel-national"
                  maxLength={16}
                  aria-invalid={Boolean(telErro)}
                  className={`w-full bg-paper border-[3px] px-3 py-2.5 text-sm focus:outline-none focus:bg-mustard/25 ${
                    telErro ? "border-tomato" : telOk ? "border-pickle" : "border-ink"
                  }`}
                />
                <p
                  className={`mt-1 text-[10.5px] font-bold uppercase tracking-[0.08em] ${
                    telErro ? "text-tomato" : telOk ? "text-pickle" : "text-ink-soft"
                  }`}
                >
                  {telErro ?? (telOk ? "Número válido ✓" : "DDD + 9 dígitos, começando com 9")}
                </p>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-ink-soft leading-snug">
                <input
                  type="checkbox"
                  checked={consentimento}
                  onChange={(e) => setConsentimento(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#e03b23]"
                />
                Autorizo o contato por WhatsApp para receber cupons e promoções do Fast Burger. Posso sair
                quando quiser.
              </label>

              <button
                type="submit"
                disabled={estado === "enviando" || !telOk}
                className="w-full bg-tomato text-cream border-[3px] border-ink shadow-hard px-5 py-3 font-display uppercase tracking-[0.1em] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none transition-all"
              >
                {estado === "enviando" ? "Enviando..." : estado === "erro" ? "Tentar de novo" : "Quero meu cupom"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
