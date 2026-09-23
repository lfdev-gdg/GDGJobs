-- ============================================================
-- GDGJobs — Schema consolidado (referência)
-- ============================================================
-- Este arquivo é uma FOTOGRAFIA do schema atual, útil para revisão e para
-- montar um banco novo do zero (`\i packages/database/schema.sql`).
-- A fonte da verdade incremental são as migrations em
-- packages/database/migrations/, aplicadas em ordem:
--   001_create_jobs_table.sql
--   002_create_core_tables.sql
--   003_profiles_and_application_status.sql
--   004_grants_service_role.sql
-- Ao adicionar uma migration nova, atualize este arquivo também.
--
-- 003 usa auth.uid(), que só existe em Postgres gerenciado pelo Supabase
-- (não em um Postgres genérico) — rodar este arquivo fora do Supabase
-- exige o schema/stub descrito em packages/database/README.md.
-- 004 faz GRANT pros roles anon/authenticated/service_role, que também
-- só existem de fábrica no Supabase — fora dele, crie-os antes (idem).
-- ============================================================

\i migrations/001_create_jobs_table.sql
\i migrations/002_create_core_tables.sql
\i migrations/003_profiles_and_application_status.sql
\i migrations/004_grants_service_role.sql
