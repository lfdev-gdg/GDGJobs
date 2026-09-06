# Feature: Jobs

Responsável pela experiência principal de vagas e busca.

## Conteúdo esperado

- components/
- hooks/
- types/
- server/

## TODO

- Definir filtros e paginação
- Criar cards e páginas de detalhe
- Modelar curadoria e submissão de vagas

## Notas

- `app/api/jobs/route.ts`, `app/api/jobs/[id]/route.ts` e `features/jobs/hooks/useJobs.ts`
  foram removidos por serem código morto: `app/(dashboard)/jobs/page.tsx` e
  `app/(dashboard)/jobs/[id]/page.tsx` chamam `getJobs`/`getJobById` direto no
  servidor, sem passar por HTTP. Reative essas rotas (e o hook) somente se
  surgir um consumidor real via HTTP — um client component, um app mobile ou
  um webhook externo.
