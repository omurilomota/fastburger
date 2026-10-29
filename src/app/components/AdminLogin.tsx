"use client";
import { useState } from "react";
import { LogoMark } from "./Logo";

export default function AdminLogin() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(false);
    const r = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });
    if (r.ok) {
      window.location.reload();
      return;
    }
    setErro(true);
    setCarregando(false);
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm border-[3px] border-ink bg-paper-2 shadow-hard-lg p-8">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-12 h-12 bg-cream border-[3px] border-ink rounded-full">
            <LogoMark className="w-8 h-8" />
          </span>
          <span>
            <span className="block font-display uppercase text-2xl leading-none">Área do dono</span>
            <span className="block text-[10px] uppercase tracking-[0.24em] text-ink-soft mt-1">
              Fast Burger CMS
            </span>
          </span>
        </div>

        <form onSubmit={entrar} className="mt-8 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-paper border-[3px] border-ink px-3 py-2.5 text-sm focus:outline-none focus:bg-mustard/25"
            />
          </div>

          {erro && (
            <p className="border-[3px] border-tomato bg-tomato/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-tomato">
              senha incorreta
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-tomato text-cream border-[3px] border-ink shadow-hard px-5 py-3 font-display uppercase tracking-[0.1em] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-60 transition-all"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-[11px] text-ink-soft leading-relaxed">
          Demo: senha padrão <code className="bg-ink text-cream px-1.5 py-0.5 font-mono">fastburger</code>. Em
          produção é trocada por variável de ambiente.
        </p>
      </div>
    </div>
  );
}
