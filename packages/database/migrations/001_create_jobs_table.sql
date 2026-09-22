-- Habilita extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criação do tipo ENUM para modalidade e nível de senioridade
CREATE TYPE job_modality AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');
CREATE TYPE seniority_level AS ENUM ('JUNIOR', 'PLENO', 'SENIOR', 'STAFF');

-- Criação da tabela principal de vagas
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_logo_url TEXT,
  location VARCHAR(255) NOT NULL,
  modality job_modality NOT NULL DEFAULT 'REMOTE',
  seniority seniority_level NOT NULL DEFAULT 'PLENO',
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  application_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para otimizar busca e filtros no Supabase
CREATE INDEX IF NOT EXISTS idx_jobs_modality ON public.jobs(modality);
CREATE INDEX IF NOT EXISTS idx_jobs_seniority ON public.jobs(seniority);
CREATE INDEX IF NOT EXISTS idx_jobs_technologies ON public.jobs USING GIN(technologies);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);

-- Habilita Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer pessoa pode listar/ver vagas ativas)
CREATE POLICY "Leitura publica de vagas ativas" 
  ON public.jobs 
  FOR SELECT 
  USING (is_active = true);