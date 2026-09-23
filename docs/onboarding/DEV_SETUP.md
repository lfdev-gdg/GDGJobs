# Setup de Desenvolvimento

Este guia explica como configurar o ambiente local do GDG Jobs em menos de 5 minutos.

## 1) Clonar o repositório

```bash
git clone <url-do-repositorio>
cd gdg-jobs
```

## 2) Instalar dependências

```bash
npm install
```

## 3) Configurar variáveis de ambiente

Copie o arquivo de exemplo para o ambiente local:

```bash
cp .env.example .env.local
```

Preencha os valores com os dados reais da sua máquina ou contas de desenvolvimento:

- Supabase
- Firebase
- Gemini
- Resend
- Vercel

## 4) Subir banco local

O projeto inclui um ambiente PostgreSQL com pgvector via Docker:

```bash
docker compose up -d postgres
```

Se necessário, valide a conexão:

```bash
psql postgresql://postgres:postgres@localhost:5432/postgres
```

## 5) Rodar migrations e seeds

Sempre nessa ordem — o seed insere linhas na tabela `jobs`, que só existe depois que as
migrations rodarem:

```bash
npm run db:migrate:local   # sobe o Postgres local, cria os roles (anon/authenticated/service_role)
                            # e aplica packages/database/migrations/001→004 em ordem
npm run db:seed            # popula packages/database/seeds/jobs.sql (vagas de exemplo)
```

> `npm run db:migrate` (sem `:local`) não toca no Postgres local — ele só imprime um lembrete de
> como aplicar as migrations no Supabase real (SQL Editor do dashboard, ou `supabase db push`).
> Pra desenvolvimento local o comando é sempre `db:migrate:local`.

### Adicionando novas vagas ao seed

Pra incluir mais vagas de exemplo (ex: cobrir uma área de tecnologia que ainda não tem vaga
suficiente pra testar), edite `packages/database/seeds/jobs.sql` adicionando mais linhas num
`INSERT INTO public.jobs (...) VALUES (...)` — **não crie uma migration nova pra isso**, é só
dado de seed, o schema da tabela não muda.

`db:seed` não é idempotente (não tem `ON CONFLICT`): rodar duas vezes duplica as vagas que já
existiam. Se seu Postgres local já tinha sido semeado antes e você quer recomeçar do zero com o
seed atualizado, apague o volume primeiro:

```bash
docker compose down -v     # apaga o container e o volume do Postgres local
npm run db:migrate:local
npm run db:seed
```

## 6) Iniciar o app

```bash
npm run dev
```

A aplicação estará disponível em:

- http://localhost:3000

## 7) Configurar Firebase Auth no ambiente dev

1. Crie um projeto no Firebase Console.
2. Ative o serviço de Authentication.
3. Configure o provider desejado (e-mail, Google, etc.).
4. Copie as chaves para o arquivo `.env.local`.
5. Valide o domínio permitido no projeto.

> Essa parte é um ponto de integração de ambiente e não deve ser implementada como lógica de negócio neste scaffold.

## Troubleshooting comum

### `npm install` falha

- Verifique a versão do Node.js (recomendado 22+)
- Limpe o cache do npm

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### `docker compose up` falha

- Verifique se o Docker está rodando
- Confirme que a porta 5432 não está em uso
- Verifique se o arquivo `docker-compose.yml` está correto

### Variáveis vazias em runtime

- Confira se `.env.local` foi criado corretamente
- Reinicie o servidor após alterar o arquivo

### `next build` falha

- Execute `npm run type-check`
- Confirme que não existem imports quebrados
- Verifique a configuração do TypeScript e do Tailwind

## Próximos passos

- Revisar a estrutura em `features/`
- Definir o primeiro conjunto de componentes do design system
- Iniciar as migrations do banco
- Planejar a integração com Supabase e Firebase

## PS: problemas ao limpar cache

rm -rf .next
