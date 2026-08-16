# Features do Frontend

Este diretório organiza a aplicação por domínio de produto, em vez de por tipo de arquivo.

## Estrutura proposta

- auth: autenticação, login e fluxo de onboarding inicial
- jobs: listagem, filtros, detalhes e curadoria de vagas
- profile: perfil do usuário, preferências e configurações
- recommendations: motor de recomendações e matching futuro
- submissions: submissão manual de vagas pela comunidade
- admin: moderação e painel interno

## Regra

Cada feature pode conter seus próprios componentes, hooks, tipos e serviços, sem misturar responsabilidades entre áreas.

## TODO

- Definir estados e contratos de cada feature
- Distribuir componentes visuais por domínio
- Adicionar integrações reais quando a implementação começar
