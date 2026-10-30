"use client";
import { useEffect, useMemo, useState } from "react";
import Header, { Ticker } from "./Header";
import Hero from "./Hero";
import UnidadesSelector from "./UnidadesSelector";
import ComoFunciona from "./ComoFunciona";
import MenuSection from "./MenuSection";
import CartPanel, { type FormPedido } from "./CartPanel";
import Fidelidade from "./Fidelidade";
import Footer from "./Footer";
import { brl, montarMensagem } from "@/lib/loja";
import type {
  Adicional,
  Categoria,
  Disponibilidade,
  ItemCarrinho,
  Produto,
  Unidade,
} from "@/lib/tipos";
import type { StatusLoja } from "./AbreFechaBadge";

type CarrinhoState = Record<number, { qtd: number; extras: number[] }>;

const formInicial: FormPedido = {
  tipo: "entrega",
  nome: "",
  telefone: "",
  endereco: "",
  pagamento: "PIX",
  observacoes: "",
};

export default function HomePageClient({
  initialProdutos,
  initialCategorias,
  initialUnidades,
  initialAdicionais,
  initialDisponibilidade,
  status,
}: {
  initialProdutos: Produto[];
  initialCategorias: Categoria[];
  initialUnidades: Unidade[];
  initialAdicionais: Adicional[];
  initialDisponibilidade: Disponibilidade[];
  status?: StatusLoja;
}) {
  const [produtos] = useState(initialProdutos);
  const [categorias] = useState(initialCategorias);
  const [unidades] = useState(initialUnidades);
  const [adicionais] = useState(initialAdicionais);

  const [unidadeId, setUnidadeId] = useState(initialUnidades[0]?.id ?? 1);
  const [carrinho, setCarrinho] = useState<CarrinhoState>({});
  const [form, setForm] = useState<FormPedido>(formInicial);
  const [cartVisivel, setCartVisivel] = useState(false);

  useEffect(() => {
    const el = document.getElementById("pedido");
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setCartVisivel(entry.isIntersecting), {
      threshold: 0.12,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const salvo = window.localStorage.getItem("fb_unidade");
    if (salvo && unidades.some((u) => String(u.id) === salvo)) {
      setUnidadeId(Number(salvo));
    }
  }, [unidades]);

  useEffect(() => {
    window.localStorage.setItem("fb_unidade", String(unidadeId));
  }, [unidadeId]);

  const unidade = unidades.find((u) => u.id === unidadeId) ?? unidades[0];

  const indisponiveis = useMemo(() => {
    const set = new Set<number>();
    initialDisponibilidade.forEach((d) => {
      if (d.unidade_id === unidadeId && !d.disponivel) set.add(d.produto_id);
    });
    return set;
  }, [initialDisponibilidade, unidadeId]);

  function adicionar(p: Produto) {
    setCarrinho((prev) => ({
      ...prev,
      [p.id]: { qtd: (prev[p.id]?.qtd ?? 0) + 1, extras: prev[p.id]?.extras ?? [] },
    }));
  }

  function mudarQtd(id: number, delta: number) {
    setCarrinho((prev) => {
      const atual = prev[id];
      if (!atual) return prev;
      const nova = atual.qtd + delta;
      if (nova <= 0) {
        const { [id]: _, ...resto } = prev;
        return resto;
      }
      return { ...prev, [id]: { ...atual, qtd: nova } };
    });
  }

  function remover(id: number) {
    setCarrinho((prev) => {
      const { [id]: _, ...resto } = prev;
      return resto;
    });
  }

  function alternarExtra(itemId: number, adicionalId: number) {
    setCarrinho((prev) => {
      const atual = prev[itemId];
      if (!atual) return prev;
      const extras = atual.extras.includes(adicionalId)
        ? atual.extras.filter((e) => e !== adicionalId)
        : [...atual.extras, adicionalId];
      return { ...prev, [itemId]: { ...atual, extras } };
    });
  }

  const itens: ItemCarrinho[] = useMemo(() => {
    return Object.entries(carrinho)
      .map(([idStr, item]) => {
        const id = Number(idStr);
        const p = produtos.find((x) => x.id === id);
        if (!p) return null;
        const extras = item.extras
          .map((eid) => adicionais.find((a) => a.id === eid))
          .filter(Boolean)
          .map((a) => ({ id: a!.id, nome: a!.nome, preco: a!.preco }));
        const precoUnitario = p.preco + extras.reduce((s, e) => s + e.preco, 0);
        return {
          id: p.id,
          nome: p.nome,
          imagem: p.imagem,
          qtd: item.qtd,
          precoUnitario,
          extras,
        };
      })
      .filter(Boolean) as ItemCarrinho[];
  }, [carrinho, produtos, adicionais]);

  const total = useMemo(
    () => itens.reduce((s, i) => s + i.precoUnitario * i.qtd, 0),
    [itens],
  );

  const waLink = useMemo(
    () =>
      montarMensagem({
        unidade,
        itens: itens.map((i) => ({
          nome: i.nome,
          qtd: i.qtd,
          precoUnitario: i.precoUnitario,
          extras: i.extras.map((e) => e.nome),
        })),
        total,
        tipo: form.tipo,
        nome: form.nome,
        telefone: form.telefone,
        endereco: form.endereco,
        pagamento: form.pagamento,
        observacoes: form.observacoes,
      }),
    [unidade, itens, total, form],
  );

  const waLinkSimples = `https://wa.me/${unidade.whatsapp}?text=${encodeURIComponent(
    `Olá! Vim pelo site do Fast Burger (${unidade.nome}).`,
  )}`;

  return (
    <div className="min-h-screen bg-paper">
      <Ticker />
      <Header waLink={waLinkSimples} status={status} />

      <main>
        <Hero waLink={waLinkSimples} status={status} />
        <UnidadesSelector
          unidades={unidades}
          selecionadaId={unidadeId}
          onSelect={setUnidadeId}
        />
        <ComoFunciona />
        <section id="cardapio" className="bg-paper scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            <div className="lg:hidden col-span-full flex items-start gap-3 border-[3px] border-ink bg-mustard/35 px-4 py-3 shadow-hard-sm">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper-2 text-lg" aria-hidden>
                🛒
              </span>
              <div className="min-w-0">
                <p className="font-display uppercase text-sm tracking-[0.08em]">
                  Seu pedido fica na sacola, no fim do cardápio
                </p>
                <p className="mt-0.5 text-xs leading-snug text-ink-soft">
                  Toque em “Adicionar” nos itens e depois em “Abrir sacola” para revisar.{" "}
                  <a href="#pedido" className="font-bold text-tomato underline underline-offset-2">
                    Ir para a sacola →
                  </a>
                </p>
              </div>
            </div>
            <MenuSection
              produtos={produtos}
              categorias={categorias}
              indisponiveis={indisponiveis}
              onAdd={adicionar}
            />
            <CartPanel
              itens={itens}
              total={total}
              unidade={unidade}
              adicionais={adicionais}
              form={form}
              setForm={setForm}
              onQtd={mudarQtd}
              onRemove={remover}
              onToggleExtra={alternarExtra}
              waLink={waLink}
            />
          </div>
        </section>
        <Fidelidade />
      </main>

      <Footer unidades={unidades} />

      {itens.length > 0 && !cartVisivel && (
        <div className="fixed bottom-4 inset-x-4 z-40 lg:hidden">
          <a
            href="#pedido"
            className="flex items-center justify-between gap-3 bg-ink text-cream border-[3px] border-ink shadow-hard px-4 py-2.5"
          >
            <span className="min-w-0">
              <span className="block font-display text-[10px] uppercase tracking-[0.2em] text-mustard">
                Seu pedido está aqui
              </span>
              <span className="block font-display text-sm uppercase tracking-[0.1em]">
                {itens.reduce((s, i) => s + i.qtd, 0)}{" "}
                {itens.reduce((s, i) => s + i.qtd, 0) === 1 ? "item" : "itens"} · R$ {brl(total)}
              </span>
            </span>
            <span className="shrink-0 bg-mustard text-ink border-[3px] border-ink px-3 py-1.5 font-display text-sm uppercase tracking-[0.08em]">
              Abrir sacola →
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
