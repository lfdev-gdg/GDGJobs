# Estrutura de Pastas — GDGJobs

```
gdgjobs/
├── app/                            # Rotas Next.js (App Router)
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── jobs/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── route.ts
│   │   │   └── session/
│   │   │       └── route.ts
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── jobs/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── profile/
│   │   │   └── route.ts
│   │   ├── recommendations/
│   │   │   └── route.ts
│   │   └── submit-job/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
├── components/                     # Componentes de UI compartilhados
│   └── ui/
│       └── button.tsx
│
├── features/                       # Módulos de domínio (feature-first)
│   ├── admin/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   ├── types/
│   │   └── README.md
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── server/
│   │   ├── types/
│   │   └── README.md
│   ├── jobs/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   ├── types/
│   │   └── README.md
│   ├── profile/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   ├── types/
│   │   └── README.md
│   ├── recommendations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   ├── types/
│   │   └── README.md
│   ├── submissions/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   ├── types/
│   │   └── README.md
│   └── README.md
│
├── hooks/                          # Hooks globais (não específicos de feature)
│   └── use-local-storage.ts
│
├── lib/                             # Integrações e utilitários compartilhados
│   ├── ai.ts
│   ├── env.ts
│   ├── firebase-admin.ts
│   ├── firebase.ts
│   ├── supabase.ts
│   ├── utils.ts
│   └── validators.ts
│
├── packages/                       # Pacotes internos do monorepo
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   ├── schema.sql
│   │   └── README.md
│   ├── ml/
│   │   ├── models/
│   │   ├── pipelines/
│   │   └── README.md
│   └── shared/
│       ├── types/
│       │   └── index.ts
│       └── README.md
│
├── public/                         # Assets estáticos
│   └── images/
│       └── hero-community.jpg
│
├── scripts/
│   └── setup.sh
│
├── supabase/
│   └── config.toml
│
├── types/                          # Tipos globais
│   └── index.ts
│
├── docs/                           # Documentação
│   ├── ADR/
│   ├── contribuicao/
│   │   └── GUIDE.md
│   ├── onboarding/
│   │   ├── DEV_SETUP.md
│   │   ├── GUIA_ENV_LOCAL.md
│   │   └── workshop-v1.md
│   ├── prompt-esqueleto.md
│   └── README.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── test.yml
│
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── components.json
├── package.json
└── prd.md
```

## Convenção de organização

- **`app/`** — apenas rotas, layouts e route handlers (App Router). Lógica de negócio não deve viver aqui.
- **`features/<nome>/`** — cada domínio (auth, jobs, profile, recommendations, submissions, admin) é isolado em `components/`, `hooks/`, `server/` e `types/` próprios.
- **`lib/`** — integrações de baixo nível compartilhadas entre features (Firebase, Supabase, IA, validadores).
- **`components/ui/`** — componentes de UI genéricos, sem lógica de domínio.
- **`packages/`** — código compartilhado entre partes do monorepo (banco de dados, ML, tipos compartilhados).
