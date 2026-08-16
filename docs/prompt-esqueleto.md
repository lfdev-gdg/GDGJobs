PROMPT: Gerar Estrutura de Pastas (Scaffolding) — GDG Jobs
Contexto
Você é um arquiteto de software sênior. Sua tarefa é criar o esqueleto (scaffolding/casquinha) do projeto GDG Jobs, um painel de vagas curado pela comunidade GDG, com as seguintes características:
Stack: Next.js 15 (App Router) + Tailwind CSS + shadcn/ui + Supabase + Firebase Auth + Gemini API
Objetivo: Criar a estrutura de diretórios, arquivos de configuração e boilerplate mínimo para que colaboradores futuros clonem o repositório e comecem a trabalhar imediatamente.
Restrição CRÍTICA: NÃO implemente lógica de negócio, NÃO crie requisitos funcionais detalhados e NÃO programe as features. Apenas organize a casa.
Documentos de Referência
Utilize como base os seguintes documentos (fornecidos no contexto):
@Kick-off — Apresentação do GDG Lauro de Freitas (ferramentas, escopo, stack, cronograma)
@file:prd.md — Documento de Arquitetura e PRD (modelo de dados, fluxos, LGPD, ML, curadoria)
O que você DEVE fazer

1. Estrutura de Pastas
   Crie a árvore de diretórios completa seguindo as convenções do Next.js 15 App Router, separando claramente:
   Frontend (páginas, componentes, hooks, estilos)
   Backend/API (rotas, middleware, integrações)
   Banco de dados (migrations, seeds, schemas SQL)
   ML/IA (scripts, modelos, pipelines — estrutura vazia com README)
   DevOps (CI/CD, Docker, scripts)
   Documentação (docs internos, ADRs, guias de contribuição)
2. Arquivos de Configuração
   Gere os arquivos essenciais de configuração (com valores placeholder ou comentários explicativos):
   package.json (dependências iniciais: next, react, tailwind, shadcn, supabase-js, firebase, etc.)
   tsconfig.json
   tailwind.config.ts
   next.config.js (com configurações de imagem, rewrites, headers)
   .env.example (todas as variáveis necessárias: Supabase, Firebase, Gemini, Resend, Vercel)
   .env.local (vazio, com .gitignore protegendo)
   supabase/config.toml (se aplicável)
   .github/workflows/ci.yml (pipeline mínima: lint, build, test)
   docker-compose.yml (PostgreSQL local + pgvector para desenvolvimento)
3. Boilerplate por Módulo
   Dentro de cada módulo, crie apenas:
   README.md explicando o propósito daquele diretório
   Arquivos .gitkeep em pastas vazias que precisam ser versionadas
   Arquivos placeholder (ex: page.tsx, layout.tsx, route.ts) com comentários indicando o que deve ser implementado
   Types/interfaces vazias ou com campos comentados (baseados no PRD)
4. Exemplos de Estrutura Esperada
   plain
   gdg-jobs/
   ├── .github/
   │ └── workflows/
   │ └── ci.yml
   ├── .vscode/
   │ └── settings.json
   ├── apps/
   │ └── web/
   │ ├── app/
   │ │ ├── (auth)/
   │ │ ├── (dashboard)/
   │ │ ├── api/
   │ │ └── layout.tsx
   │ ├── components/
   │ │ └── ui/
   │ ├── lib/
   │ │ └── utils.ts
   │ ├── hooks/
   │ ├── types/
   │ └── public/
   ├── packages/
   │ ├── database/
   │ │ ├── migrations/
   │ │ ├── seeds/
   │ │ └── schema.sql
   │ ├── ml/
   │ │ └── README.md
   │ └── shared/
   │ └── types/
   ├── docs/
   │ ├── ADR/
   │ ├── contribuicao/
   │ └── onboarding/
   ├── scripts/
   │ └── setup.sh
   ├── docker-compose.yml
   ├── .env.example
   ├── .gitignore
   └── README.md
5. README Principal
   O README.md raiz deve conter:
   Título e descrição do projeto
   Stack tecnológica (badges)
   Pré-requisitos (Node.js, Docker, contas necessárias)
   Instruções de setup em 3 passos (git clone, npm install, npm run dev)
   Estrutura de pastas explicada
   Como contribuir (link para docs/contribuicao/GUIDE.md)
   Código de conduta
   Licença (MIT)
6. Documentação de Onboarding
   Crie docs/onboarding/DEV_SETUP.md com:
   Como clonar e subir o ambiente local
   Como configurar variáveis de ambiente (copiar de .env.example)
   Como rodar migrations do Supabase local
   Como conectar Firebase Auth no ambiente dev
   Troubleshooting comum
   O que você NÃO deve fazer
   ❌ NÃO escreva a lógica de CRUD de vagas
   ❌ NÃO implemente o sistema de autenticação
   ❌ NÃO programe o algoritmo de matching ou ML
   ❌ NÃO crie testes unitários (apenas configure o ambiente de teste)
   ❌ NÃO escreva documentação de requisitos funcionais — apenas estrutural
   ❌ NÃO adicione dados mockados extensos (apenas seeds mínimos se necessário)
   ❌ NÃO configure deploy em produção (apenas CI básica e scripts locais)
   Critérios de Qualidade
   A estrutura deve refletir as decisões arquiteturais do PRD (Next.js App Router, Supabase, Firebase, etc.)
   Cada pasta deve ter um propósito claro e documentado
   O setup local deve funcionar em menos de 5 minutos após o clone
   O código deve ser 100% TypeScript
   shadcn/ui deve estar inicializado (com components.json)
   Tailwind deve estar configurado com as cores do design system GDG
   ESLint + Prettier devem estar configurados
   Entregáveis Esperados
   Árvore completa de diretórios e arquivos
   Todo arquivo de configuração funcional (não placeholder)
   README.md raiz completo
   docs/onboarding/DEV_SETUP.md
   .env.example com todas as variáveis documentadas
   package.json com scripts úteis (dev, build, lint, db:migrate, db:seed)
   Tom e Estilo
   Profissional, mas acolhedor para iniciantes
   Comentários em português (projeto brasileiro)
   Código e configs em inglês (convenção internacional)
   Use TODO comments para indicar onde a implementação começa
