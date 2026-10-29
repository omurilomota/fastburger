export const soDigitos = (v: string) => v.replace(/\D/g, "");

/** Máscara progressiva: (18) 99999-0103 */
export function mascararTelefone(v: string) {
  const d = soDigitos(v).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Celular BR válido: DDD 11–99 + 9 dígitos começando com 9. */
export function telefoneValido(v: string) {
  const d = soDigitos(v);
  if (d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  return ddd >= 11 && ddd <= 99 && d[2] === "9";
}

export function erroTelefone(v: string): string | null {
  const d = soDigitos(v);
  if (d.length === 0) return null;
  if (d.length < 11) {
    const falta = 11 - d.length;
    return `Falta${falta > 1 ? "m" : ""} ${falta} dígito${falta > 1 ? "s" : ""} (DDD + 9 números).`;
  }
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return "DDD inválido. Use o DDD da sua cidade, ex.: 18.";
  if (d[2] !== "9") return "Celular precisa começar com 9 depois do DDD.";
  return null;
}
