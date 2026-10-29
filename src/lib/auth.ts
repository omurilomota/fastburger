import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_ADMIN = "fb_admin";
const SECRET = process.env.ADMIN_SECRET || "fast-burger-demo-secret";
export const SENHA_PADRAO = process.env.ADMIN_SENHA || "fastburger";

function assinar(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function gerarToken() {
  const exp = String(Date.now() + 7 * 24 * 3600 * 1000);
  return `${exp}.${assinar(exp)}`;
}

export function validarToken(token?: string | null) {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return false;
  const esperado = assinar(expStr);
  const a = Buffer.from(sig);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function senhaValida(senha: string) {
  return senha === SENHA_PADRAO;
}
