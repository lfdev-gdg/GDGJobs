# Package de Banco de Dados

Este módulo existe para centralizar o schema, migrations e seeds do projeto.

## Objetivo

- Versionar a estrutura de dados do produto
- Documentar o modelo relacional da V1 e expansões futuras
- Preparar a base para Supabase + pgvector

## Conteúdo esperado

- migrations/: scripts SQL ou geração de schema
- seeds/: dados mínimos de desenvolvimento
- schema.sql: definição do modelo principal

## TODO

- Definir schemas de jobs, profiles e integrações
- Criar migrations iniciais
- Adicionar extensão pgvector
- Preparar seed mínimo para ambiente local
