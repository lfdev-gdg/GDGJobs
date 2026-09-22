# Imagem oficial de dev containers da Microsoft já traz Node 22, npm, git,
# zsh/oh-my-zsh e o usuário não-root "node" configurado — evita reinventar
# esse setup só para o workshop.
FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# postgresql-client: dá aos alunos um `psql` pronto no terminal do Codespace
# para inspecionar o Postgres local (pgvector) definido no
# docker-compose.yml da raiz, sem precisar instalar nada na hora.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql-client \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

USER node
