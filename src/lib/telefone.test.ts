import { describe, expect, it } from "vitest";
import { erroTelefone, mascararTelefone, telefoneValido } from "./telefone";
import { brlFull, montarMensagem, statusLoja, type DadosPedido } from "./loja";

describe("mascararTelefone", () => {
  it("aplica máscara progressiva", () => {
    expect(mascararTelefone("")).toBe("");
    expect(mascararTelefone("18")).toBe("(18");
    expect(mascararTelefone("1899")).toBe("(18) 99");
    expect(mascararTelefone("189916")).toBe("(18) 9916");
    expect(mascararTelefone("1899999010")).toBe("(18) 9999-9010");
    expect(mascararTelefone("18999990103")).toBe("(18) 99999-0103");
  });

  it("ignora caracteres não numéricos e limita a 11 dígitos", () => {
    expect(mascararTelefone("(18) 99999-0103 999")).toBe("(18) 99999-0103");
  });
});

describe("telefoneValido", () => {
  it("aceita celular com DDD e nono dígito", () => {
    expect(telefoneValido("(18) 99999-0103")).toBe(true);
  });

  it("rejeita números curtos, DDD inválido e nono dígito ausente", () => {
    expect(telefoneValido("99999-0103")).toBe(false);
    expect(telefoneValido("(01) 99999-0103")).toBe(false);
    expect(telefoneValido("(18) 89999-0103")).toBe(false);
  });
});

describe("erroTelefone", () => {
  it("não reclama de campo vazio", () => {
    expect(erroTelefone("")).toBeNull();
  });

  it("orienta quando faltam dígitos", () => {
    expect(erroTelefone("(18) 9916")).toBe(
      "Faltam 5 dígitos (DDD + 9 números).",
    );
    expect(erroTelefone("(18) 99166-150")).toContain("Falta 1 dígito");
  });

  it("explica DDD e nono dígito inválidos", () => {
    expect(erroTelefone("(01) 99999-0103")).toContain("DDD inválido");
    expect(erroTelefone("(18) 89999-0103")).toContain("começar com 9");
  });

  it("retorna null para número válido", () => {
    expect(erroTelefone("(18) 99999-0103")).toBeNull();
  });
});

describe("statusLoja", () => {
  it("fecha antes das 18h e informa a próxima abertura", () => {
    const status = statusLoja(new Date("2026-06-15T20:00:00Z")); // 17h em São Paulo
    expect(status.aberto).toBe(false);
    expect(status.proxima).toBe("abre às 18:00");
  });

  it("abre às 18h e fecha às 23h30", () => {
    expect(statusLoja(new Date("2026-06-15T21:00:00Z")).aberto).toBe(true); // 18h
    expect(statusLoja(new Date("2026-06-16T02:30:00Z")).aberto).toBe(true); // 23h30
    expect(statusLoja(new Date("2026-06-16T02:31:00Z")).aberto).toBe(false);
  });

  it("informa fechamento quando está aberto", () => {
    expect(statusLoja(new Date("2026-06-15T22:00:00Z")).proxima).toBe(
      "fecha às 23:30",
    );
  });
});

describe("montarMensagem", () => {
  const pedido: DadosPedido = {
    unidade: { nome: "Centro", whatsapp: "5518999999999" },
    itens: [
      { nome: "X-Burger", qtd: 2, precoUnitario: 24.9, extras: ["Bacon"] },
      { nome: "Batata", qtd: 1, precoUnitario: 15, extras: [] },
    ],
    total: 64.8,
    tipo: "entrega",
    nome: "Maria",
    telefone: "(18) 99999-0103",
    endereco: "Rua A, 10",
    pagamento: "Pix",
    observacoes: "Sem cebola",
  };

  it("monta link do WhatsApp com itens, total e endereço", () => {
    const link = montarMensagem(pedido);
    expect(link.startsWith("https://wa.me/5518999999999?text=")).toBe(true);
    const texto = decodeURIComponent(link.split("text=")[1]);
    expect(texto).toContain("2x X-Burger (+ Bacon) — R$ 49,80");
    expect(texto).toContain("1x Batata — R$ 15,00");
    expect(texto).toContain("Total: R$ 64,80");
    expect(texto).toContain("Endereço: Rua A, 10");
    expect(texto).toContain("Obs: Sem cebola");
  });

  it("omite endereço na retirada e sinaliza quando não informado", () => {
    const texto = decodeURIComponent(
      montarMensagem({ ...pedido, tipo: "retirada", endereco: "" }).split("text=")[1],
    );
    expect(texto).toContain("Tipo: Retirada no balcão");
    expect(texto).not.toContain("Endereço:");
  });

  it("formata valores em reais", () => {
    expect(brlFull(9.5)).toBe("R$ 9,50");
    expect(brlFull(1234.5)).toBe("R$ 1234,50");
  });
});
