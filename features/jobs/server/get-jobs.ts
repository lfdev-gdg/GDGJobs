import { supabase } from '@/lib/supabase';
import { Job, JobFilters, PaginatedJobs } from '../types';

// Paginação server-side: 20 vagas por página (limit/offset via .range do Supabase)
export const JOBS_PAGE_SIZE = 20;

export async function getJobs(filters?: JobFilters): Promise<PaginatedJobs> {
  const page = Math.max(1, filters?.page ?? 1);
  const from = (page - 1) * JOBS_PAGE_SIZE;
  const to = from + JOBS_PAGE_SIZE - 1;

  // count: 'exact' pede ao Postgres o total de linhas que casam com os
  // filtros (antes do range), para calcularmos totalPages sem buscar tudo.
  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (filters?.modality && filters.modality !== 'ALL') {
    query = query.eq('modality', filters.modality);
  }

  if (filters?.seniority && filters.seniority !== 'ALL') {
    query = query.eq('seniority', filters.seniority);
  }

  if (filters?.tech) {
    // Faz a busca dentro do array Postgres de tecnologias
    query = query.contains('technologies', [filters.tech]);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Erro ao buscar vagas do Supabase:', error);
    throw new Error('Não foi possível carregar as vagas.');
  }

  const totalCount = count ?? 0;

  return {
    jobs: data as Job[],
    page,
    pageSize: JOBS_PAGE_SIZE,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / JOBS_PAGE_SIZE)),
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
