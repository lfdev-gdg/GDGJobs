# Package de Banco de Dados

Este módulo centraliza o schema, migrations e seeds do projeto (Supabase/PostgreSQL).

## Conteúdo

- `migrations/`: histórico incremental, aplicado em ordem numérica
  - `001_create_jobs_table.sql` — tabela `jobs` (já em produção no Supabase)
  - `002_create_core_tables.sql` — `users`, `companies`, `applications`, extensão `vector` (pgvector) e colunas novas em `jobs`
- `schema.sql`: referência que aplica as migrations em ordem, para montar um banco novo do zero
- `seeds/jobs.sql`: vagas de exemplo para desenvolvimento local

## Modelo relacional (V1)

- **companies** — empresas parceiras (leitura pública, escrita só via service role)
- **users** — espelha o usuário autenticado via Firebase (Google OAuth), chave `firebase_uid`
- **jobs** — vagas (já existia; ganhou `company_id` opcional e `embedding vector(384)` para a V3)
- **applications** — candidatura de um `user` a uma `job` (`UNIQUE (job_id, user_id)`)

RLS está habilitado em todas. Como a autenticação é Firebase (não Supabase Auth), não há
policy baseada em `auth.uid()`: toda escrita passa por rotas server-side (`app/api/**`) que
validam o cookie de sessão do Firebase e então usam a `SUPABASE_SERVICE_ROLE_KEY` (que ignora
RLS). As policies existentes cobrem apenas leitura pública (`jobs` ativas, `companies`).

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
