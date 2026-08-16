# 🧭 Visão do Produto GDG Jobs

O GDG Jobs é um painel de vagas construído pela comunidade, para a comunidade, que evolui de um agregador simples para um sistema inteligente de recomendação de carreira.

Nossa visão é criar o principal hub de empregos focado em tecnologia, com curadoria e validação da comunidade GDG, garantindo relevância e qualidade superiores às plataformas genéricas.
Roteiro de Versões
Versão
Foco Principal
Valor para a Comunidade
V1
Painel de vagas curado
Entrega de valor imediato, lista de vagas confiável e relevante.
V2
Perfil do usuário + filtros avançados
Experiência personalizada, capacidade de salvar vagas e refinar a busca.
V3
Sistema de recomendação com ML
Matchmaking inteligente entre usuários e vagas, impulsionando a progressão na carreira.

🏗️ Arquitetura Geral
A arquitetura do GDG Jobs é projetada para ser modular, escalável e preparada para a introdução de Machine Learning (ML) desde o início, utilizando o pgvector no Supabase.

Segue abaixo o fluxo principal dos dados:

┌─────────────────────────────────────────────────────┐
│ FONTES DE VAGAS │
│ LinkedIn API · GitHub Jobs · APIs de empresas │
│ Scrapers · Submissão manual pela comunidade │
└────────────────────┬────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────┐
│ PIPELINE DE INGESTÃO │
│ Coleta → Normalização → Deduplicação → Banco │
└────────────────────┬────────────────────────────────┘
↓
┌──────────────┐ ↓
│ FRONTEND │←───────→│ BACKEND API │
│ Next.js + │ │ Next.js API Routes ou │
│ Tailwind │ │ FastAPI (para o ML) │
└──────────────┘ └────────────┬──────────────┘
↓
┌────────────────────────────┐
│ BANCO DE DADOS │
│ Supabase (banco + auth) │
│ + pgvector (embeddings) │
└────────────────────────────┘
↓
┌────────────────────────────┐
│ ENGINE DE RECOMENDAÇÃO │
│ Python · scikit-learn │
│ sentence-transformers │
│ FastAPI · pgvector │
└────────────────────────────┘
📦 V1 — Painel de Vagas Curado
Objetivo
Entregar valor imediato com complexidade baixa. A comunidade já usa, já valida e já contribui. O foco é a ingestão de dados e a apresentação eficiente em um painel funcional.
Stack Técnica
Frontend: Next.js + Tailwind + shadcn/ui
Backend: Next.js API Routes (para CRUD simples e exposição de dados)
Banco: Supabase (PostgreSQL)
Hospedagem: Vercel (gratuito)
Modelo de Dados
O modelo de dados inicial é focado na tabela jobs, projetada para acomodar os filtros essenciais para a V1 e estabelecer a base para futuras expansões (V2 e V3).-- Vagas

CREATE TABLE jobs (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

company TEXT NOT NULL,

location TEXT, -- "Remoto", "São Paulo", "Berlin"

country TEXT, -- "BR", "US", "DE"

type TEXT, -- CLT, PJ, Freelance, Internship

modality TEXT, -- Remote, Hybrid, On-site

level TEXT, -- Junior, Mid, Senior, Staff

salary_min INTEGER,

salary_max INTEGER,

currency TEXT DEFAULT 'BRL',

techs TEXT[], -- ["React", "TypeScript", "Node"]

description TEXT,

url TEXT NOT NULL,

source TEXT, -- "linkedin", "manual", "scraper"

posted_at TIMESTAMPTZ,

expires_at TIMESTAMPTZ,

created_at TIMESTAMPTZ DEFAULT now()

);

-- Índices para filtros rápidos

CREATE INDEX ON jobs (country);

CREATE INDEX ON jobs (level);

CREATE INDEX ON jobs (modality);

CREATE INDEX ON jobs (techs) USING GIN;

Para mais detalhes sobre o desenvolvimento da V1, consulte o documento anexo: File

### Funcionalidades V1

- Listagem com filtros: país, modalidade, nível, tecnologia, faixa salarial
- Busca textual simples
- Submissão de vaga pela comunidade (com aprovação)
- Página de detalhe da vaga
- Alertas por e-mail (tag de interesse cadastrada)

### Como a comunidade contribui na V1

| Perfil       | Contribuição                                |
| ------------ | ------------------------------------------- |
| Dev Frontend | Componentes de card, filtros, paginação     |
| Dev Backend  | API de vagas, pipeline de ingestão          |
| Designer     | Design system, identidade visual            |
| Não-técnico  | Curadoria manual de vagas, testes, feedback |

---

## 👤 V2 — Perfil do Usuário e Matching Básico

### Objetivo

Coletar dados de perfil que vão alimentar o sistema de recomendação da V3. Já entrega valor com matching por regras simples.

### Modelo de Dados do Perfil

sql
CREATE TABLE profiles (
id UUID PRIMARY KEY REFERENCES auth.users,
name TEXT,
email TEXT,
bio TEXT,

-- Hard skills
techs TEXT[], -- ["Python", "React", "Docker"]
experience_years INTEGER,
level TEXT, -- Junior, Mid, Senior

-- Soft skills (escala 1-5, coletado via onboarding)
soft_skills JSONB,
-- {
-- "comunicacao": 4,
-- "lideranca": 2,
-- "trabalho_em_equipe": 5,
-- "autonomia": 3,
-- "resolucao_problemas": 4
-- }

-- Preferências de vaga
pref_modality TEXT[], -- ["Remote", "Hybrid"]
pref_country TEXT[], -- ["BR", "US"]
pref_level TEXT,
salary_expectation INTEGER,
open_to_relocate BOOLEAN DEFAULT false,

-- Histórico
saved_jobs UUID[],
applied_jobs UUID[],
dismissed_jobs UUID[], -- sinal negativo para o modelo

updated_at TIMESTAMPTZ DEFAULT now()
);

### Onboarding do Perfil

Um fluxo simples de 5 passos que coleta os dados necessários para a recomendação:

Passo 1 → Tecnologias que você usa (multi-select + peso)
Passo 2 → Nível e anos de experiência
Passo 3 → Soft skills (quiz rápido de 8 perguntas situacionais)
Passo 4 → Preferências de vaga (modalidade, país, salário)
Passo 5 → Objetivo atual (primeiro emprego, transição, crescimento, renda extra)

### Matching por Regras (pré-ML)

Enquanto não há dados suficientes para treinar o modelo, o matching funciona por score simples:

python
def score_job(job, profile):
score = 0

    # Hard skills — maior peso
    tech_match = len(set(job.techs) & set(profile.techs))
    score += tech_match * 10

    # Modalidade e país
    if job.modality in profile.pref_modality: score += 15
    if job.country in profile.pref_country:   score += 10

    # Nível
    if job.level == profile.level:            score += 20

    # Salário dentro da expectativa
    if job.salary_max >= profile.salary_expectation: score += 10

    return score

---

## 🤖 V3 — Sistema de Recomendação com ML

### Estratégia em duas camadas

Camada 1 → Embeddings de semântica (o que a vaga e o perfil significam)
Camada 2 → Collaborative filtering (o que pessoas similares curtiram)
↓
Score final combinado

### Camada 1 — Embeddings Semânticos

Transforma vagas e perfis em vetores numéricos e mede similaridade por proximidade geométrica.

python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# Modelo multilingual — funciona em PT e EN

def build_job_text(job):
return f"""
{job['title']} em {job['company']}.
Tecnologias: {', '.join(job['techs'])}.
Nível: {job['level']}. Modalidade: {job['modality']}.
{job['description'][:500]}
def build_profile_text(profile):
return f"""
Desenvolvedor {profile['level']} com {profile['experience_years']} anos.
Tecnologias: {', '.join(profile['techs'])}.
Soft skills: {format_soft_skills(profile['soft_skills'])}.
Busca vagas {', '.join(profile['pref_modality'])} em {', '.join(profile['pref_country'])}.
Objetivo: {profile['objective']}.
"""

# Gera e salva embeddings no pgvector

job_embedding = model.encode(build_job_text(job))
profile_embedding = model.encode(build_profile_text(profile))

### pgvector — Busca por Similaridade no Banco

sql
-- Habilita extensão
CREATE EXTENSION IF NOT EXISTS vector;

-- Adiciona coluna de embedding nas vagas
ALTER TABLE jobs ADD COLUMN embedding vector(384);

-- Busca as 20 vagas mais similares ao perfil
SELECT id, title, company,
1 - (embedding <=> $1) AS similarity
FROM jobs
ORDER BY embedding <=> $1
LIMIT 20;

### Camada 2 — Sinais de Comportamento

O modelo aprende com as ações do usuário:

Salvou a vaga → sinal positivo forte (+1.0)
Clicou para ver mais → sinal positivo leve (+0.3)
Ignorou na listagem → sinal neutro/negativo (-0.1)
Marcou "não tenho interesse" → sinal negativo (-1.0)

python
from sklearn.decomposition import TruncatedSVD
import numpy as np

# Matriz usuário × vaga com scores de interação

interaction_matrix = build_interaction_matrix(interactions)

# Fatoração de matriz (collaborative filtering)

svd = TruncatedSVD(n*components=50)
user_factors = svd.fit_transform(interaction_matrix)
job_factors = svd.components*.T

# Score colaborativo para um usuário

def collaborative_score(user_id, job_id):
u = user_factors[user_id]
j = job_factors[job_id]
return np.dot(u, j)

### Score Final Combinado

python
def final_recommendation_score(user_id, job_id, profile, job):
semantic = cosine_similarity(profile_embedding, job_embedding)
collab = collaborative_score(user_id, job_id)
rule_based = score_job(job, profile) / 100 # normalizado

    # Pesos ajustáveis conforme o modelo evolui
    # No início: mais regra. Com dados: mais ML.
    score = (
        0.50 * semantic   +
        0.30 * collab     +
        0.20 * rule_based
    )
    return score

---

## 📅 Roadmap de Construção Coletiva

| Fase            | Entrega                                   | Horas estimadas | Time        |
| --------------- | ----------------------------------------- | --------------- | ----------- |
| _V1 — Mês 1–2_  | Painel com filtros + submissão manual     | 40–60h total    | 4–6 devs    |
| _V2 — Mês 3–4_  | Perfil + onboarding + matching por regras | 30–40h total    | 3–4 devs    |
| _V3a — Mês 5–6_ | Embeddings + pgvector + API FastAPI       | 40–50h total    | 2–3 devs ML |
| _V3b — Mês 7–8_ | Collaborative filtering + score combinado | 30–40h total    | 2 devs ML   |
| _Contínuo_      | Ajuste de pesos, novos sinais, A/B test   | ongoing         | Comunidade  |

---

## 🎓 O que cada membro aprende construindo isso

| Área             | Aprendizado                                             |
| ---------------- | ------------------------------------------------------- |
| Frontend         | Next.js, design system, acessibilidade                  |
| Backend          | API REST, modelagem relacional, autenticação            |
| Data Engineering | Pipeline de ingestão, deduplicação, scrapers            |
| ML/IA            | Embeddings, vetores, recomendação, avaliação de modelos |
| DevOps           | CI/CD, Vercel, variáveis de ambiente, monitoramento     |
| Produto          | Discovery, priorização, métricas de engajamento         |
