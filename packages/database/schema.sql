-- ============================================================
-- GDGJobs — Schema consolidado (referência)
-- ============================================================
-- Este arquivo é uma FOTOGRAFIA do schema atual, útil para revisão e para
-- montar um banco novo do zero (`\i packages/database/schema.sql`).
-- A fonte da verdade incremental são as migrations em
-- packages/database/migrations/, aplicadas em ordem:
--   001_create_jobs_table.sql
--   002_create_core_tables.sql
-- Ao adicionar uma migration nova, atualize este arquivo também.
-- ============================================================

\i migrations/001_create_jobs_table.sql
\i migrations/002_create_core_tables.sql
