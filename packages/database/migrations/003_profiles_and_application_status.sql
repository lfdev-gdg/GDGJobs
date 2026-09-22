-- ============================================================
-- GDGJobs — V2: profiles do candidato + vocabulário de status de applications
-- ============================================================
-- Contexto sobre auth.uid() / auth.users:
--   O requisito original desta migration pede `profiles` vinculada a
--   `auth.users` com RLS `auth.uid() = id`. Isso pressupõe Supabase Auth,
--   mas este projeto autentica via Firebase (Google 1-click, ver V1) — não
--   existe sessão do Supabase Auth, então `auth.uid()` é sempre NULL pro
--   client anônimo usado no browser.
--
--   Em vez de referenciar `auth.users` (que nunca teria linha nenhuma),
--   `profiles` referencia `public.users` — a tabela que já espelha o
--   usuário do Firebase (ver 002_create_core_tables.sql), sincronizada a
--   cada request autenticado por lib/auth-server.ts.
--
--   As policies abaixo são escritas exatamente como pedido
--   (`auth.uid() = id`) porque isso não é incorreto — hoje elas só ficam
--   inertes (negam toda escrita pelo client, o que é o comportamento
--   seguro padrão) e passam a funcionar de verdade automaticamente se/
--   quando o projeto Supabase for configurado com Firebase como Third-
--   Party Auth (Authentication → Sign In → Third Party Auth, ação de
--   dashboard, fora do alcance de uma migration). Até lá, toda edição
--   real acontece via rota server-side (app/api/profile) usando a
--   service role key, depois de validar o cookie de sessão do Firebase.

-- ============================================================
-- PROFILES — perfil público do candidato (bio, links, skills, senioridade)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  seniority seniority_level,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN(skills);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Leitura pública: perfil de candidato funciona como "vitrine" (empresas
-- e outros membros da comunidade podem ver bio/skills/links).
CREATE POLICY "Leitura publica de perfis"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Edição só pelo próprio usuário — ver nota no topo do arquivo sobre por
-- que auth.uid() é inerte hoje (Firebase Auth, não Supabase Auth).
CREATE POLICY "Usuario edita o proprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuario cria o proprio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- APPLICATIONS — status em MAIÚSCULAS, alinhado ao dashboard do candidato
-- (V2 Bloco 3): APPLIED, REVIEWING, ACCEPTED, REJECTED.
-- A UNIQUE (job_id, user_id) pedida no requisito já existe desde
-- 002_create_core_tables.sql — só o vocabulário de status muda aqui.
-- ============================================================

-- A constraint ANTIGA precisa cair ANTES do UPDATE — senão o próprio
-- UPDATE pra 'APPLIED'/'REVIEWING'/... violaria o CHECK velho, que só
-- aceitava 'submitted'/'viewed'/'accepted'/'rejected' (achei esse bug
-- testando a migration localmente: a ordem inversa falha sempre).
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;

UPDATE public.applications
SET status = CASE status
  WHEN 'submitted' THEN 'APPLIED'
  WHEN 'viewed' THEN 'REVIEWING'
  WHEN 'accepted' THEN 'ACCEPTED'
  WHEN 'rejected' THEN 'REJECTED'
  ELSE UPPER(status)
END
WHERE status <> UPPER(status) OR status IN ('submitted', 'viewed', 'accepted', 'rejected');

ALTER TABLE public.applications
  ALTER COLUMN status SET DEFAULT 'APPLIED';

ALTER TABLE public.applications
  ADD CONSTRAINT applications_status_check
    CHECK (status IN ('APPLIED', 'REVIEWING', 'ACCEPTED', 'REJECTED'));
