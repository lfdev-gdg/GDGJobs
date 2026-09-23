#!/usr/bin/env bash
# Sobe o Postgres local (pgvector) e aplica todas as migrations em ordem,
# recriando antes o que o Supabase real já provê de fábrica e que o
# Postgres genérico do docker-compose.yml não tem:
#   - schema/função auth.uid() (usada pelas policies de 003)
#   - roles anon/authenticated/service_role (usados pelos GRANTs de 004,
#     service_role com BYPASSRLS — é assim que a service role key
#     "ignora RLS" de verdade, não é automático)
#
# Sem isso, cada migration nova que depender de RLS ou GRANT continua
# parecendo funcionar aqui e falhando só no Supabase real (foi exatamente
# o que aconteceu com 004 — ver packages/database/README.md, seção
# "RLS não basta").
set -euo pipefail

docker compose up -d postgres --wait

PSQL="docker exec -i gdg-jobs-postgres psql -U postgres -d postgres -v ON_ERROR_STOP=1"

$PSQL -c "
CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS \$\$ SELECT NULL::uuid \$\$ LANGUAGE sql STABLE;

DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
  END IF;
END \$\$;
"

for f in packages/database/migrations/*.sql; do
  echo "-- applying $f"
  $PSQL < "$f"
done
