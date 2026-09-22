#!/usr/bin/env bash
# Roda uma vez, quando o Codespace/Dev Container é criado. Espelha o
# scripts/setup.sh usado em dev local, mas sem exigir Docker Desktop na
# máquina do aluno — aqui o Postgres já é outro serviço do compose.
set -uo pipefail

echo "==> Instalando dependências (npm install)"
npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "==> .env.local criado a partir de .env.example"
  echo "    Preencha as chaves de Firebase/Supabase/Gemini antes de testar"
  echo "    login, banco real ou busca por IA — veja docs/onboarding/."
else
  echo "==> .env.local já existe; mantendo configuração atual."
fi

echo "==> Aguardando o Postgres local (pgvector) ficar pronto..."
for _ in $(seq 1 20); do
  if pg_isready -h postgres -p 5432 -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if pg_isready -h postgres -p 5432 -U postgres >/dev/null 2>&1; then
  echo "==> Aplicando migrations no Postgres local (dados de exemplo, não é o Supabase real)"
  for f in packages/database/migrations/*.sql; do
    echo "    - $f"
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f" || echo "    (aviso: falhou, pode já ter sido aplicada)"
  done
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f packages/database/seeds/jobs.sql \
    || echo "    (aviso: seed falhou, talvez já tenha rodado antes)"
else
  echo "==> Postgres local não respondeu a tempo. Depois, rode manualmente:"
  echo "    psql \"\$DATABASE_URL\" -f packages/database/migrations/001_create_jobs_table.sql"
  echo "    psql \"\$DATABASE_URL\" -f packages/database/migrations/002_create_core_tables.sql"
fi

cat <<'EOF'

==============================================================
 Ambiente do Codespace pronto!
   1. Preencha .env.local com as chaves do workshop (Firebase/Supabase/Gemini)
   2. npm run dev
   3. Porta 3000 abre automaticamente em uma aba do navegador
==============================================================
EOF
