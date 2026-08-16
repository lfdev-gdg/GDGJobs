# GDG Jobs

GDG Jobs é o hub de vagas curado pela comunidade GDG para a comunidade de tecnologia. O projeto nasce como um painel de oportunidades relevantes e evolui para um sistema de recomendação inteligente de carreira.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28)
![Gemini](https://img.shields.io/badge/Gemini-AI-8B5CF6)

## Visão geral

Este repositório organiza a estrutura inicial do produto, com foco em:

- Next.js 15 App Router
- Tailwind CSS e shadcn/ui
- Supabase como base de dados e autenticação principal
- Firebase Auth para integrações específicas de autenticação e identidade
- Gemini API para experiências de IA e recomendações futuras
- CI minimalista para lint, type check e build

## Pré-requisitos

Antes de começar, tenha instalado em sua máquina:

- Node.js 22+
- npm 10+
- Docker Desktop ou Docker Engine
- Git
- Contas necessárias:
  - Supabase
  - Firebase
  - Google AI Studio / Gemini
  - Resend (opcional para alertas por e-mail)

## Setup em 3 passos

1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd gdg-jobs
```

2. Instale as dependências

```bash
npm install
```

3. Inicie o ambiente local

```bash
cp .env.example .env.local
npm run dev
```

O app ficará disponível em `http://localhost:3000`.

## Estrutura de pastas

```text
gdg-jobs/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
├── features/
│   ├── auth/
│   ├── jobs/
│   ├── profile/
│   ├── recommendations/
│   ├── submissions/
│   └── admin/
├── hooks/
├── lib/
├── types/
├── public/
├── packages/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── schema.sql
│   ├── ml/
│   │   ├── README.md
│   │   ├── pipelines/
│   │   └── models/
│   └── shared/
│       └── types/
├── docs/
│   ├── ADR/
│   ├── contribuicao/
│   ├── onboarding/
│   └── prompt-esqueleto.md
├── scripts/
│   └── setup.sh
├── .github/
│   └── workflows/
│       └── ci.yml
├── .vscode/
│   └── settings.json
├── .env.example
├── .env.local
├── .gitignore
├── .prettierrc
├── .eslintrc.json
├── components.json
├── docker-compose.yml
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── LICENSE
├── README.md
└── supabase/
    └── config.toml
```

## Observação sobre a estrutura de pastas

O app é um único projeto Next.js na raiz do repositório (sem `apps/web` intermediário). `app/` é a pasta obrigatória do App Router; `features/` organiza a lógica de produto por domínio (auth, jobs, profile, recommendations, submissions, admin), e `components/`, `hooks/`, `lib/` e `types/` guardam o que é compartilhado entre features.

`packages/database`, `packages/ml` e `packages/shared` continuam separados por serem preocupações fora do app web (schema/migrations do banco, pipelines de ML e tipos compartilhados) — mas não são workspaces npm por enquanto, só pastas de referência. Se algum desses virar um serviço com build próprio no futuro, aí sim vale promover o repositório para um monorepo com workspaces.

## Como contribuir

Leia o guia de contribuição em [docs/contribuicao/GUIDE.md](docs/contribuicao/GUIDE.md) e o onboarding em [docs/onboarding/DEV_SETUP.md](docs/onboarding/DEV_SETUP.md).

## Código de conduta

Este projeto segue os princípios de respeito, inclusão e colaboração da comunidade GDG. Contribuições discriminatórias, ofensivas ou de baixa qualidade serão rejeitadas.

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).

## Observação

Este repositório está em fase de scaffolding. A lógica de negócio, integrações e features ainda serão implementadas por colaboradores da comunidade conforme roadmap do produto.
