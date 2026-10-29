export const TZ = "America/Sao_Paulo";

export const ABERTURA = "18:00";
export const FECHAMENTO = "23:30";

function partes(d: Date) {
  const s = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  const [h, m] = s.split(":").map(Number);
  return { h, m, total: h * 60 + m, hora: s };
}

export function statusLoja(d: Date = new Date()) {
  const { total, hora } = partes(d);
  const abertura = 18 * 60;
  const fechamento = 23 * 60 + 30;
  const aberto = total >= abertura && total <= fechamento;
  let proxima: string;
  if (total < abertura) proxima = `abre às ${ABERTURA}`;
  else if (total > fechamento) proxima = `abre amanhã às ${ABERTURA}`;
  else proxima = `fecha às ${FECHAMENTO}`;
  return { aberto, hora, proxima };
}

export const brl = (v: number) => v.toFixed(2).replace(".", ",");
export const brlFull = (v: number) => `R$ ${brl(v)}`;

export type ItemPedido = {
  nome: string;
  qtd: number;
  precoUnitario: number;
  extras: string[];
};

export type DadosPedido = {
  unidade: { nome: string; whatsapp: string };
  itens: ItemPedido[];
  total: number;
  tipo: "entrega" | "retirada";
  nome: string;
  telefone: string;
  endereco: string;
  pagamento: string;
  observacoes: string;
};

export function montarMensagem(d: DadosPedido) {
  const linhas = d.itens.map(
    (i) =>
      `• ${i.qtd}x ${i.nome}${i.extras.length ? ` (+ ${i.extras.join(", ")})` : ""} — ${brlFull(i.precoUnitario * i.qtd)}`,
  );

  const texto = [
    `Olá! Pedido pelo site do Fast Burger — ${d.unidade.nome}`,
    "",
    "*ITENS*",
    ...linhas,
    "",
    `*Total: ${brlFull(d.total)}*`,
    "",
    "*ENTREGA*",
    `Tipo: ${d.tipo === "entrega" ? "Entrega" : "Retirada no balcão"}`,
    d.nome ? `Nome: ${d.nome}` : "",
    d.telefone ? `Telefone: ${d.telefone}` : "",
    d.tipo === "entrega" ? `Endereço: ${d.endereco || "(informar)"}` : "",
    `Pagamento: ${d.pagamento}`,
    d.observacoes ? `Obs: ${d.observacoes}` : "",
    "",
    "Pode confirmar? 🙏",
  ]
    .filter((l) => l !== "")
    .join("\n");

  return `https://wa.me/${d.unidade.whatsapp}?text=${encodeURIComponent(texto)}`;
}
