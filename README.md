# Fast Burger

Cardápio e pedidos para hamburgueria com duas unidades.

> **Demonstração pública.** Telefones, WhatsApp, e-mail, endereço, CNPJ, redes sociais e dados de clientes são fictícios. Nenhum pedido, mensagem ou formulário é enviado a um canal real.

[**Ver demonstração**](https://fastburger-muriloinc.vercel.app) · Next.js 16 (App Router) · React 19 · TypeScript · PostgreSQL + Drizzle ORM · Tailwind CSS 4

## O que tem

- Cardápio por unidade com disponibilidade
- Carrinho e checkout com retirada ou entrega
- Programa de fidelidade por telefone
- Painel administrativo de produtos e leads
- Status de aberto/fechado calculado pelo horário

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- PostgreSQL + Drizzle ORM
- Tailwind CSS 4

## Rodando localmente

```bash
npm ci
cp .env.example .env.local
# edite .env.local com a sua connection string
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Connection string PostgreSQL/Neon |
| `ADMIN_SENHA` | Sim | Senha do painel |
| `ADMIN_SECRET` | Sim | Segredo de assinatura da sessão |

## Banco de dados

PostgreSQL no Neon (banco `fastburger`). O schema fica em `src/db/schema.ts` e é aplicado com `npx drizzle-kit push`. Em produção, use uma connection string Neon com `sslmode=require`.

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Cardápio e checkout |
| `/admin` | Painel administrativo |

## Testes e qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deploy

O deploy é feito na Vercel. Configure as variáveis acima no painel do projeto, conecte o repositório e use `npm run build`.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/app/` | Rotas, componentes e API |
| `src/db/` | Schema Drizzle |
| `src/lib/` | Regras de loja, telefone e tipos |
| `scripts/seed.ts` | Seed de unidades e cardápio |

## Licença

MIT — veja [LICENSE](LICENSE).
