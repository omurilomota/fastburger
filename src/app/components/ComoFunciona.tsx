export default function ComoFunciona() {
  const passos = [
    {
      n: "01",
      titulo: "Monte o pedido",
      texto: "Escolha o burger, os adicionais e a forma de pagamento. O cardápio mostra o total na hora.",
    },
    {
      n: "02",
      titulo: "Mande no WhatsApp",
      texto: "A mensagem já vai montada: itens, adicionais, total, endereço e pagamento. Só tocar em enviar.",
    },
    {
      n: "03",
      titulo: "Receba ou retire",
      texto: "A unidade recebe o pedido, confirma o tempo e entrega. Sem comissão no meio do caminho.",
    },
  ];

  return (
    <section id="como-funciona" className="relative bg-ink text-cream border-b-[3px] border-ink overflow-hidden">
      <div className="absolute inset-0 halftone-light opacity-[0.07]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.3em] text-mustard">03 — Como funciona</p>
            <h2 className="mt-3 font-display uppercase text-[clamp(2rem,5vw,3.4rem)] leading-[1.08]">
              Três toques e o <span className="marker marker-red">burger tá a caminho</span>
            </h2>
          </div>
          <p className="max-w-sm text-cream/60">
            O mesmo fluxo que você já usa no app de delivery — só que sem taxa e com o dinheiro indo direto
            pra hamburgueria.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {passos.map((p, i) => (
            <div
              key={p.n}
              className="group relative border-[3px] border-cream/70 bg-ink p-6 hover:bg-cream hover:text-ink transition-colors duration-200"
            >
              <span className="font-display text-6xl leading-none text-mustard">{p.n}</span>
              <h3 className="mt-4 font-display uppercase text-2xl leading-none">{p.titulo}</h3>
              <p className="mt-3 text-sm text-cream/60 group-hover:text-ink-soft leading-relaxed">{p.texto}</p>
              {i < passos.length - 1 && (
                <span className="hidden md:block absolute -right-[13px] top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-mustard border-[3px] border-ink rotate-45" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
