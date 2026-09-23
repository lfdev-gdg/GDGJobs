-- ============================================================
-- GDGJobs — patch: GRANTs explícitos pras tabelas da V1/V2
-- ============================================================
-- Erro real em produção depois de aplicar 002+003 no Supabase:
--
--   permission denied for table users (code 42501)
--   hint: Grant the required privileges to the current role with:
--         GRANT SELECT, INSERT, UPDATE ON public.users TO service_role;
--
-- RLS e GRANT são duas camadas INDEPENDENTES: RLS decide quais LINHAS um
-- role vê depois que o Postgres já libera acesso à TABELA. A service role
-- key do Supabase ignora RLS, mas não ignora GRANT — se o role
-- `service_role` não tem privilégio na tabela, nem chega a avaliar RLS.
--
-- Tabelas criadas pela Table Editor (UI) do Supabase ganham esses grants
-- automaticamente; tabelas criadas via SQL puro (SQL Editor, ou uma
-- migration como 002/003) não ganham — precisam de GRANT explícito.
-- `jobs` (001) não deu esse erro porque já tinha os grants de antes
-- (criada num momento em que o default privilege do projeto cobria isso).
--
-- NUNCA testei isso localmente antes porque o Postgres local roda tudo
-- como superusuário (bypassa GRANT igual bypassa RLS) — o bug só existe
-- com os roles reais do Supabase. Validado aqui recriando esses roles
-- localmente (ver packages/database/README.md).
-- ============================================================

-- service_role: usado por lib/supabase-admin.ts em toda rota server-side
-- (app/api/**) — precisa ler/gravar as 4 tabelas que passaram a existir
-- na V1/V2 e que não foram criadas pela Table Editor.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO service_role;

-- jobs (001) já tinha SELECT pra anon (por isso a listagem pública nunca
-- deu esse erro), mas nada garantia INSERT/UPDATE/DELETE pro service_role
-- — achei isso testando o insert de uma application de exemplo. Nenhuma
-- rota de hoje escreve em jobs via service role, mas a submissão de vaga
-- da comunidade (prd.md) vai precisar, então já cobre agora.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO service_role;

-- anon/authenticated: só nas tabelas que têm policy de leitura pública
-- (USING (true)). users e applications não entram aqui de propósito —
-- não têm (e não devem ter) policy nenhuma pra esses dois roles.
GRANT SELECT ON public.companies TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- Future-proofing: qualquer tabela nova criada a partir de agora pelo
-- mesmo role que rodar esta migration já nasce com o grant certo pro
-- service_role, sem depender de lembrar de repetir isso a cada migration.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
