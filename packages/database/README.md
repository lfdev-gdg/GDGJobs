# Package de Banco de Dados

Este módulo centraliza o schema, migrations e seeds do projeto (Supabase/PostgreSQL).

## Conteúdo

- `migrations/`: histórico incremental, aplicado em ordem numérica
  - `001_create_jobs_table.sql` — tabela `jobs` (já em produção no Supabase)
  - `002_create_core_tables.sql` — `users`, `companies`, `applications`, extensão `vector` (pgvector) e colunas novas em `jobs`
  - `003_profiles_and_application_status.sql` — tabela `profiles` (perfil do candidato) e status de `applications` em MAIÚSCULAS (`APPLIED`/`REVIEWING`/`ACCEPTED`/`REJECTED`)
  - `004_grants_service_role.sql` — GRANTs em `users`/`companies`/`profiles`/`applications`/`jobs` pros roles `anon`/`authenticated`/`service_role` (ver seção **RLS não basta** abaixo)
- `schema.sql`: referência que aplica as migrations em ordem, para montar um banco novo do zero
- `seeds/jobs.sql`: vagas de exemplo para desenvolvimento local

## Modelo relacional (V1 + V2)

- **companies** — empresas parceiras (leitura pública, escrita só via service role)
- **users** — espelha o usuário autenticado via Firebase (Google OAuth), chave `firebase_uid`
- **jobs** — vagas (já existia; ganhou `company_id` opcional e `embedding vector(384)` para a V3)
- **profiles** — perfil público do candidato (`bio`, `github_url`, `linkedin_url`, `portfolio_url`,
  `skills`, `seniority`), 1:1 com `users` via `id`
- **applications** — candidatura de um `user` a uma `job` (`UNIQUE (job_id, user_id)`), status em
  `APPLIED` / `REVIEWING` / `ACCEPTED` / `REJECTED`

RLS está habilitado em todas. Como a autenticação é Firebase (não Supabase Auth), não há
policy baseada em `auth.uid()` que funcione de fato hoje: toda escrita passa por rotas
server-side (`app/api/**`, via `lib/auth-server.ts` + `lib/supabase-admin.ts`) que validam o
cookie de sessão do Firebase e então usam a `SUPABASE_SERVICE_ROLE_KEY` (que ignora RLS). As
policies de leitura pública (`jobs` ativas, `companies`, `profiles`) são as únicas realmente
ativas pro client anônimo.

**Exceção documentada**: `profiles` também tem policies de `INSERT`/`UPDATE` escritas como
`auth.uid() = id`, exatamente como pede um cenário de Supabase Auth. Elas ficam **inertes** hoje
(auth.uid() é sempre NULL sem uma sessão do Supabase Auth) — o que é seguro, equivale a "sem
policy" — mas passam a funcionar automaticamente se o projeto for configurado com Firebase como
[Third-Party Auth](https://supabase.com/docs/guides/auth/third-party/firebase-auth) no dashboard
do Supabase (ação manual, fora do alcance de uma migration). Até lá, a edição real do perfil
acontece via `POST /api/profile`.

## RLS não basta: GRANT é a camada de baixo

Erro real que apareceu em produção depois de aplicar `002`+`003` no Supabase:

```
permission denied for table users (42501)
hint: Grant the required privileges to the current role with:
      GRANT SELECT, INSERT, UPDATE ON public.users TO service_role;
```

RLS e GRANT são **duas camadas independentes**: RLS decide quais LINHAS um role vê, mas só
depois que o Postgres já libera acesso à TABELA em si pra esse role — a `service_role` key
ignora RLS (via o atributo `BYPASSRLS`), mas isso não dispensa o GRANT. Tabela criada pela Table
Editor (UI) do Supabase ganha esses grants automaticamente; tabela criada via SQL puro (SQL
Editor, ou uma migration como `002`/`003`) **não ganha** — precisa de GRANT explícito, que é
exatamente o que `004_grants_service_role.sql` faz.

Isso não apareceu na primeira validação local porque o Postgres genérico do `docker-compose.yml`
roda tudo como superusuário (`postgres`), que ignora GRANT igual ignora RLS — o bug só existe com
os roles reais do Supabase. `scripts/db-migrate-local.sh` (por trás de `npm run db:migrate:local`)
já recria `anon`/`authenticated`/`service_role` (com `service_role` `BYPASSRLS`, igual no Supabase
real) antes de aplicar as migrations, então dá pra reproduzir e confirmar o fix com `SET ROLE`:

```sql
-- antes de existir o GRANT de 004, isso dava "permission denied for table users":
SET ROLE service_role;
SELECT * FROM public.users;

-- com 004 aplicada, o mesmo SELECT (e INSERT/UPDATE) funciona.
```

### Testando `003` localmente sem Supabase

A imagem `pgvector/pgvector:pg16` usada no `docker-compose.yml` é um Postgres genérico — não tem
o schema `auth` que o Supabase provê de fábrica. Pra validar `003` fora do Supabase, crie um stub
antes de aplicá-la:

```sql
CREATE SCHEMA IF NOT EXISTS auth;
CREATE FUNCTION auth.uid() RETURNS uuid AS $$ SELECT NULL::uuid $$ LANGUAGE sql STABLE;
```

No Supabase real, `auth.uid()` já existe — não faça isso lá.

## Como aplicar

### Localmente (Docker, para validar uma migration nova)

```bash
npm run db:migrate:local   # sobe o postgres, cria o stub de auth.uid() + roles anon/authenticated/
                           # service_role, e aplica 001→004 em ordem (ver scripts/db-migrate-local.sh)
npm run db:seed            # opcional, popula packages/database/seeds/jobs.sql
docker compose down
```

As migrations em si ainda rodam como superusuário (`postgres`) — os roles existem só pra você
alternar com `SET ROLE anon;` / `SET ROLE service_role;` num `psql` manual depois, e confirmar que
GRANT/RLS estão do jeito esperado (ver seção **RLS não basta** acima).

A imagem usada (`pgvector/pgvector:pg16`) já vem com a extensão `vector` disponível.

### No projeto Supabase real

Não há Supabase CLI linkado neste ambiente nem connection string direta no `.env.local`.
Para aplicar no projeto real, use uma das opções:

1. **SQL Editor do Supabase Dashboard** (mais simples): abra o projeto → SQL Editor → cole o
   conteúdo de cada migration pendente, em ordem, e execute.
2. **Supabase CLI**, se preferir automatizar:
   ```bash
   supabase link --project-ref <seu-project-ref>
   supabase db push
   ```
   (requer `supabase login` e a senha do banco do projeto)

`npm run db:migrate` imprime esse caminho como lembrete — ele não toca no Supabase remoto
automaticamente, para nunca rodar DDL em produção sem revisão manual.
