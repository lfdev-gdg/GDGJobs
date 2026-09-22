# Package de Banco de Dados

Este módulo centraliza o schema, migrations e seeds do projeto (Supabase/PostgreSQL).

## Conteúdo

- `migrations/`: histórico incremental, aplicado em ordem numérica
  - `001_create_jobs_table.sql` — tabela `jobs` (já em produção no Supabase)
  - `002_create_core_tables.sql` — `users`, `companies`, `applications`, extensão `vector` (pgvector) e colunas novas em `jobs`
  - `003_profiles_and_application_status.sql` — tabela `profiles` (perfil do candidato) e status de `applications` em MAIÚSCULAS (`APPLIED`/`REVIEWING`/`ACCEPTED`/`REJECTED`)
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
docker compose up -d postgres
docker exec -i gdg-jobs-postgres psql -U postgres -d postgres -v ON_ERROR_STOP=1 \
  < packages/database/migrations/001_create_jobs_table.sql
docker exec -i gdg-jobs-postgres psql -U postgres -d postgres -v ON_ERROR_STOP=1 \
  < packages/database/migrations/002_create_core_tables.sql
docker exec -i gdg-jobs-postgres psql -U postgres -d postgres -v ON_ERROR_STOP=1 \
  < packages/database/seeds/jobs.sql   # opcional, dados de exemplo
docker compose down
```

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
