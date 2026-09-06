import { supabase } from '@/lib/supabase';
import { Job, JobFilters } from '../types';

export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*')
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

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar vagas do Supabase:', error);
    throw new Error('Não foi possível carregar as vagas.');
  }

  return data as Job[];
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
