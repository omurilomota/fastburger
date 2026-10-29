"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "./Logo";
import { brl } from "@/lib/loja";
import type { Adicional, Categoria, Disponibilidade, Produto, Unidade } from "@/lib/tipos";

type Lead = { id: number; telefone: string; criado_em: string };

function Switch({
  ativo,
  onChange,
  label,
  cor = "mustard",
}: {
  ativo: boolean;
  onChange: (v: boolean) => void;
  label: string;
  cor?: "mustard" | "tomato";
}) {
  return (
    <button
      onClick={() => onChange(!ativo)}
      className={`inline-flex items-center gap-2 border-[3px] border-ink px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${
        ativo ? (cor === "tomato" ? "bg-tomato text-cream" : "bg-mustard") : "bg-paper-2 text-ink-soft"
      }`}
    >
      <span className={`w-3 h-3 border-[3px] border-ink ${ativo ? "bg-ink" : "bg-transparent"}`} />
      {label}
    </button>
  );
}

export default function AdminPanel() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editados, setEditados] = useState<Record<number, Partial<Produto>>>({});
  const [salvo, setSalvo] = useState<number | null>(null);
  const [novo, setNovo] = useState({ nome: "", preco: "", descricao: "", categoria_id: 1 });
  const [mostrarNovo, setMostrarNovo] = useState(false);

  const carregar = useCallback(async () => {
    const r = await fetch("/api/admin/produtos");
    if (!r.ok) return;
    const data = await r.json();
    setProdutos(data.produtos);
    setCategorias(data.categorias);
    setDisponibilidade(data.disponibilidade);
    const un = await fetch("/api/cardapio").then((x) => x.json());
    setUnidades(un.unidades || []);
    const l = await fetch("/api/admin/leads").then((x) => x.json()).catch(() => ({ leads: [] }));
    setLeads(l.leads || []);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function editar(id: number, campo: keyof Produto, valor: unknown) {
    setEditados((prev) => ({ ...prev, [id]: { ...prev[id], [campo]: valor } }));
  }

  async function salvar(id: number) {
    const campos = editados[id];
    if (!campos) return;
    const r = await fetch("/api/admin/produtos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...campos }),
    });
    if (r.ok) {
      const data = await r.json();
      setProdutos((prev) => prev.map((p) => (p.id === id ? data.produto : p)));
      setEditados((prev) => {
        const { [id]: _, ...resto } = prev;
        return resto;
      });
      setSalvo(id);
      setTimeout(() => setSalvo(null), 1800);
    }
  }

  async function alternarUnidade(produtoId: number, unidadeId: number, disponivel: boolean) {
    const r = await fetch("/api/admin/produtos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: produtoId, unidade_id: unidadeId, disponivel }),
    });
    if (r.ok) {
      setDisponibilidade((prev) => {
        const existe = prev.find(
          (d) => d.produto_id === produtoId && d.unidade_id === unidadeId,
        );
        if (existe) {
          return prev.map((d) =>
            d.produto_id === produtoId && d.unidade_id === unidadeId ? { ...d, disponivel } : d,
          );
        }
        return [...prev, { produto_id: produtoId, unidade_id: unidadeId, disponivel }];
      });
    }
  }

  async function criar() {
    if (!novo.nome) return;
    const r = await fetch("/api/admin/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });
    if (r.ok) {
      setNovo({ nome: "", preco: "", descricao: "", categoria_id: 1 });
      setMostrarNovo(false);
      carregar();
    }
  }

  async function sair() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  }

  const valor = (p: Produto, campo: keyof Produto) => {
    const e = editados[p.id];
    return (e?.[campo] ?? p[campo]) as never;
  };

  const indisponivel = (produtoId: number, unidadeId: number) => {
    const d = disponibilidade.find((x) => x.produto_id === produtoId && x.unidade_id === unidadeId);
    return d ? d.disponivel : true;
  };

  const ativos = produtos.filter((p) => p.ativo).length;
  const esgotados = produtos.filter((p) => p.esgotado).length;

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-ink text-cream border-b-[3px] border-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-10 h-10 bg-cream border-[3px] border-ink rounded-full">
              <LogoMark className="w-7 h-7" />
            </span>
            <span>
              <span className="block font-display uppercase text-xl leading-none">Painel do dono</span>
              <span className="block text-[9.5px] uppercase tracking-[0.24em] text-mustard mt-0.5">
                cardápio, preços e disponibilidade
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="border-[3px] border-cream/50 px-3 py-2 font-display text-[11px] uppercase tracking-[0.14em] hover:bg-cream hover:text-ink transition-colors"
            >
              Ver site
            </Link>
            <button
              onClick={sair}
              className="bg-tomato border-[3px] border-ink px-3 py-2 font-display text-[11px] uppercase tracking-[0.14em] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { v: String(ativos), l: "itens no cardápio" },
            { v: String(esgotados), l: "esgotados agora" },
            { v: String(unidades.length), l: "unidades" },
            { v: String(leads.length), l: "contatos do clube" },
          ].map((s) => (
            <div key={s.l} className="border-[3px] border-ink bg-paper-2 shadow-hard-sm px-4 py-3">
              <p className="font-display text-4xl leading-none">{s.v}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft mt-1.5">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="font-display uppercase text-3xl leading-none">
            Itens do <span className="marker">cardápio</span>
          </h2>
          <button
            onClick={() => setMostrarNovo((v) => !v)}
            className="bg-mustard border-[3px] border-ink shadow-hard-sm px-4 py-2 font-display text-sm uppercase tracking-[0.1em] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            {mostrarNovo ? "Fechar" : "+ Novo item"}
          </button>
        </div>

        {mostrarNovo && (
          <div className="border-[3px] border-ink bg-paper-2 shadow-hard p-5 mb-8 grid md:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-1">
                Nome
              </label>
              <input
                value={novo.nome}
                onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
                placeholder="Ex.: X-Burger da Casa"
                className="w-full bg-paper border-[3px] border-ink px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-1">
                Preço
              </label>
              <input
                value={novo.preco}
                onChange={(e) => setNovo({ ...novo, preco: e.target.value })}
                placeholder="29,90"
                className="w-full bg-paper border-[3px] border-ink px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-1">
                Categoria
              </label>
              <select
                value={novo.categoria_id}
                onChange={(e) => setNovo({ ...novo, categoria_id: Number(e.target.value) })}
                className="w-full bg-paper border-[3px] border-ink px-3 py-2 text-sm focus:outline-none"
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={criar}
              className="bg-tomato text-cream border-[3px] border-ink shadow-hard-sm px-5 py-2.5 font-display text-sm uppercase tracking-[0.1em] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Publicar
            </button>
          </div>
        )}

        <div className="space-y-5">
          {produtos.map((p) => {
            const temEdicao = Boolean(editados[p.id]);
            return (
              <div key={p.id} className="border-[3px] border-ink bg-paper-2 shadow-hard">
                <div className="flex flex-col md:flex-row gap-5 p-4">
                  <div className="flex gap-4 md:w-[46%]">
                    <div className="relative w-24 h-24 border-[3px] border-ink shrink-0 overflow-hidden">
                      <Image
                        src={p.imagem || "/images/burger-big-cheese.jpg"}
                        alt={p.nome}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display uppercase text-xl leading-tight">{p.nome}</p>
                      <p className="text-xs text-ink-soft mt-1 line-clamp-2">{p.descricao}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                        {categorias.find((c) => c.id === p.categoria_id)?.nome}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 grid sm:grid-cols-[130px_1fr] gap-4 items-start">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-1">
                        Preço
                      </label>
                      <div className="flex items-center border-[3px] border-ink bg-paper focus-within:bg-mustard/20">
                        <span className="px-2 text-xs font-bold text-ink-soft">R$</span>
                        <input
                          value={String(valor(p, "preco")).replace(".", ",")}
                          onChange={(e) =>
                            editar(p.id, "preco", Number(e.target.value.replace(",", ".")) || 0)
                          }
                          className="w-full bg-transparent px-1 py-2 text-sm font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Switch
                        ativo={Boolean(valor(p, "esgotado"))}
                        onChange={(v) => editar(p.id, "esgotado", v)}
                        label="Esgotado"
                        cor="tomato"
                      />
                      <Switch
                        ativo={Boolean(valor(p, "burger_do_mes"))}
                        onChange={(v) => editar(p.id, "burger_do_mes", v)}
                        label="Burger do mês"
                      />
                      <Switch
                        ativo={Boolean(valor(p, "destaque"))}
                        onChange={(v) => editar(p.id, "destaque", v)}
                        label="Destaque"
                      />
                      <Switch
                        ativo={Boolean(valor(p, "ativo"))}
                        onChange={(v) => editar(p.id, "ativo", v)}
                        label="Publicado"
                      />
                    </div>
                  </div>

                  <div className="md:w-[220px]">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2">
                      Disponível em
                    </p>
                    <div className="space-y-1.5">
                      {unidades.map((u) => (
                        <button
                          key={u.id}
                          onClick={() =>
                            alternarUnidade(
                              p.id,
                              u.id,
                              !indisponivel(p.id, u.id),
                            )
                          }
                          className={`w-full flex items-center justify-between gap-2 border-[3px] border-ink px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-all ${
                            indisponivel(p.id, u.id) ? "bg-pickle text-cream" : "bg-paper-2 text-ink-soft"
                          }`}
                        >
                          {u.nome}
                          <span>{indisponivel(p.id, u.id) ? "✓" : "—"}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t-[3px] border-ink bg-paper px-4 py-2.5">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    Preço atual: R$ {brl(Number(valor(p, "preco")))}
                  </span>
                  <div className="flex items-center gap-3">
                    {salvo === p.id && (
                      <span className="font-display text-[11px] uppercase tracking-[0.14em] text-pickle">
                        Salvo ✓
                      </span>
                    )}
                    <button
                      onClick={() => salvar(p.id)}
                      disabled={!temEdicao}
                      className="bg-ink text-cream border-[3px] border-ink px-4 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-tomato transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 border-[3px] border-ink bg-paper-2 shadow-hard">
          <div className="bg-ink text-cream px-4 py-2.5">
            <h3 className="font-display uppercase text-sm tracking-[0.18em]">
              Clube do Sela — contatos captados
            </h3>
          </div>
          {leads.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-soft">
              Nenhum contato ainda. O formulário do site salva aqui com consentimento (LGPD).
            </p>
          ) : (
            <ul className="divide-y-[3px] divide-dashed divide-ink/15">
              {leads.map((l) => (
                <li key={l.id} className="px-4 py-2.5 flex items-center justify-between text-sm">
                  <span className="font-semibold">{l.telefone}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    {new Date(l.criado_em).toLocaleDateString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
