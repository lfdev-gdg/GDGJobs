import { supabase } from '@/lib/supabase';
import { Job, JobFilters, PaginatedJobs } from '../types';

// Paginação server-side: 20 vagas por página (limit/offset via .range do Supabase)
export const JOBS_PAGE_SIZE = 20;

// Monta os parâmetros de filtro (modalidade/senioridade/tech/busca) uma
// única vez, reaproveitados tanto na contagem quanto na busca dos dados —
// pra nunca desalinhar as duas queries.
function buildJobsQuery(filters?: JobFilters) {
  return {
    modality: filters?.modality && filters.modality !== 'ALL' ? filters.modality : undefined,
    seniority: filters?.seniority && filters.seniority !== 'ALL' ? filters.seniority : undefined,
    tech: filters?.tech || undefined,
    search: filters?.search || undefined,
  };
}

export async function getJobs(filters?: JobFilters): Promise<PaginatedJobs> {
  const requestedPage = Math.max(1, filters?.page ?? 1);
  const { modality, seniority, tech, search } = buildJobsQuery(filters);

  // 1) Conta quantas vagas casam com os filtros ANTES de aplicar o range.
  // Necessário porque o PostgREST erra (PGRST103) se o offset pedido cair
  // fora do total de linhas — pedir a página 2 quando só há 1 é comum
  // (filtro mudou, ou o usuário voltou no histórico) e não pode dar 500.
  let countQuery = supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true);
  if (modality) countQuery = countQuery.eq('modality', modality);
  if (seniority) countQuery = countQuery.eq('seniority', seniority);
  if (tech) countQuery = countQuery.contains('technologies', [tech]);
  if (search) countQuery = countQuery.or(`title.ilike.%${search}%,company_name.ilike.%${search}%`);

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('Erro ao contar vagas no Supabase:', countError);
    throw new Error('Não foi possível carregar as vagas.');
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / JOBS_PAGE_SIZE));

  if (totalCount === 0) {
    return { jobs: [], page: 1, pageSize: JOBS_PAGE_SIZE, totalCount: 0, totalPages: 1 };
  }

  // "Grampeia" a página pedida ao intervalo válido antes de calcular o range.
  const page = Math.min(requestedPage, totalPages);
  const from = (page - 1) * JOBS_PAGE_SIZE;
  const to = from + JOBS_PAGE_SIZE - 1;

  // 2) Busca só a página atual (limit/offset via .range do Supabase).
  let dataQuery = supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (modality) dataQuery = dataQuery.eq('modality', modality);
  if (seniority) dataQuery = dataQuery.eq('seniority', seniority);
  if (tech) dataQuery = dataQuery.contains('technologies', [tech]);
  if (search) dataQuery = dataQuery.or(`title.ilike.%${search}%,company_name.ilike.%${search}%`);

  const { data, error } = await dataQuery.range(from, to);

  if (error) {
    console.error('Erro ao buscar vagas do Supabase:', error);
    throw new Error('Não foi possível carregar as vagas.');
  }

  return {
    jobs: data as Job[],
    page,
    pageSize: JOBS_PAGE_SIZE,
    totalCount,
    totalPages,
  };
}

export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`Erro ao buscar vaga com ID ${id}:`, error);
    return null;
  }

  return data as Job;
}
