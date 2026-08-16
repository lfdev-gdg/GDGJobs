#!/usr/bin/env bash
set -euo pipefail

echo "Configurando ambiente GDG Jobs..."

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo ".env.local criado a partir de .env.example"
else
  echo ".env.local já existe; mantendo configuração atual."
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker não foi encontrado no PATH. Instale o Docker para subir o banco local."
else
  echo "Subindo Postgres local com pgvector..."
  docker compose up -d postgres
fi

echo "Ambiente preparado. Execute: npm install && npm run dev"

# TODO: incluir passos de seed e validação de saúde do projeto.
