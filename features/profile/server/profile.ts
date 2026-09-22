import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { Profile, ProfileInput } from '../types';

/** Perfil do candidato. null quando ele ainda não preencheu nada (linha nunca criada). */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    throw new Error('Não foi possível carregar o perfil.');
  }

  return (data as Profile) ?? null;
}

/**
 * Cria ou atualiza o perfil do usuário autenticado. Sempre um upsert por
 * `id` — o formulário de perfil não distingue "criar" de "editar" (é a
 * mesma tela, o registro só passa a existir no primeiro save).
 */
export async function upsertProfile(userId: string, input: ProfileInput): Promise<Profile> {
  const { data, error } = await getSupabaseAdmin()
    .from('profiles')
    .upsert(
      {
        id: userId,
        bio: input.bio ?? null,
        github_url: input.github_url ?? null,
        linkedin_url: input.linkedin_url ?? null,
        portfolio_url: input.portfolio_url ?? null,
        skills: input.skills ?? [],
        seniority: input.seniority ?? null,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single();

  if (error || !data) {
    console.error('Erro ao salvar perfil:', error);
    throw new Error('Não foi possível salvar o perfil.');
  }

  return data as Profile;
}
