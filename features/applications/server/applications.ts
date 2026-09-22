import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { Application } from '../types';

const UNIQUE_VIOLATION = '23505';

/** A candidatura do usuário pra essa vaga específica, ou null se ele nunca se candidatou. */
export async function getApplicationForUser(
  jobId: string,
  userId: string,
): Promise<Application | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar candidatura:', error);
    throw new Error('Não foi possível verificar a candidatura.');
  }

  return (data as Application) ?? null;
}

/**
 * Registra a candidatura. Idempotente por design: se o usuário já tinha
 * se candidatado (UNIQUE (job_id, user_id) no banco — a fonte da verdade
 * contra duplicados, não só uma checagem na UI), devolve a candidatura
 * JÁ EXISTENTE em vez de erro. Um duplo-clique ou uma corrida de rede não
 * deve virar erro pro candidato: o resultado que importa ("eu me
 * candidatei") já é verdade nos dois casos.
 */
export async function createApplication(jobId: string, userId: string): Promise<Application> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from('applications')
    .insert({ job_id: jobId, user_id: userId })
    .select('*')
    .single();

  if (!error) {
    return data as Application;
  }

  if (error.code === UNIQUE_VIOLATION) {
    const existing = await getApplicationForUser(jobId, userId);
    if (existing) {
      return existing;
    }
  }

  console.error('Erro ao criar candidatura:', error);
  // Relança o erro do Postgres como veio (preserva `.code`) — é assim que
  // a rota distingue "vaga não existe" (23503, FK) de qualquer outra
  // falha, sem a gente ter que reimplementar esse mapeamento aqui.
  throw error;
}
