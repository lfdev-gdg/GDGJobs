-- ============================================================
-- GDGJobs — V1: users, companies, applications + pgvector
-- ============================================================
-- Contexto:
--   A tabela `jobs` (001_create_jobs_table.sql) já está em produção no
--   Supabase e permanece denormalizada (company_name em texto) para não
--   quebrar dados/leituras existentes. Esta migration ADICIONA as tabelas
--   que faltavam para a V1 (users, companies, applications), habilita o
--   pgvector (base para a V3 de recomendação, conforme prd.md) e estende
--   `jobs` de forma retrocompatível (colunas novas, nullable).
--
-- Nota sobre auth:
--   O prd.md original (V2) assumia Supabase Auth (`profiles` referenciando
--   `auth.users`). O projeto evoluiu para Firebase Auth (Google 1-click) —
--   por isso `users` aqui é uma tabela própria, sincronizada pelo
--   `firebase_uid`, e não uma FK para `auth.users`. Toda escrita nestas
--   tabelas acontece via rotas server-side usando a service role key,
--   depois de validar o cookie de sessão do Firebase (lib/firebase-admin.ts).
--   As policies de RLS abaixo são defesa em profundidade: sem policy de
--   escrita para anon/authenticated, só a service role (que ignora RLS)
--   consegue gravar.
-- ============================================================

-- Extensão pgvector — nome correto no Postgres/Supabase é "vector"
-- (o schema.sql antigo tinha "pgvector", que não existe como extensão).
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Leitura pública (vitrine de empresas parceiras da comunidade)
CREATE POLICY "Leitura publica de empresas"
  ON public.companies
  FOR SELECT
  USING (true);

-- ============================================================
-- USERS
-- Espelha o usuário autenticado via Firebase (Google OAuth 1-click).
-- Criado/atualizado pela rota server-side de sessão após o login.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  photo_url TEXT,
  role VARCHAR(32) NOT NULL DEFAULT 'candidate'
    CHECK (role IN ('candidate', 'company_admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users(firebase_uid);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Sem policy de SELECT/INSERT/UPDATE para anon/authenticated: dados de
-- usuário só são lidos/gravados pelas rotas server-side (service role),
-- que já validam a identidade via cookie de sessão do Firebase.

-- ============================================================
-- JOBS — extensão retrocompatível da tabela existente
-- ============================================================

-- Referência opcional à empresa estruturada (além do company_name legado).
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Embedding semântico (base para V3 — busca por similaridade com
-- sentence-transformers 'paraphrase-multilingual-MiniLM-L12-v2', 384 dims,
-- conforme prd.md). Não é usado na V1, mas a coluna/extensão precisam
-- existir desde já.
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS embedding vector(384);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);

-- ============================================================
-- APPLICATIONS
-- Candidatura de um usuário a uma vaga.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(32) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'viewed', 'rejected', 'accepted')),
  cover_letter TEXT,
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (job_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
-- Idem `users`: sem policy pública. Uma candidatura só pode ser criada ou
-- lida através da rota server-side, que confirma o usuário dono do cookie
-- de sessão antes de tocar na tabela com a service role key.
