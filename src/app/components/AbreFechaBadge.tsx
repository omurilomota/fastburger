"use client";
import { useEffect, useState } from "react";
import { statusLoja } from "@/lib/loja";

export type StatusLoja = { aberto: boolean; hora: string; proxima: string };

export default function AbreFechaBadge({ initial }: { initial?: StatusLoja }) {
  const [s, setS] = useState<StatusLoja | null>(initial ?? null);

  useEffect(() => {
    const calc = () => setS(statusLoja());
    const t = setInterval(calc, 30000);
    return () => clearInterval(t);
  }, []);

  const aberto = s?.aberto ?? false;

  return (
    <span
      className={`inline-flex items-center gap-2.5 border-[3px] border-ink px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.16em] shadow-hard-sm -rotate-[1.5deg] ${
        aberto ? "bg-mustard text-ink" : "bg-paper-2 text-ink"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-70 ${
            aberto ? "bg-pickle animate-ping" : "bg-tomato"
          }`}
        />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${aberto ? "bg-pickle" : "bg-tomato"}`} />
      </span>
      {aberto ? "Aberto agora" : "Fechado agora"}
      <span className="opacity-60">{s?.hora ?? "--:--"}</span>
    </span>
  );
}
