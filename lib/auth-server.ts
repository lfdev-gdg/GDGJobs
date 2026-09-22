/**
 * Resolve o usuário autenticado (Firebase) em código server-side e garante
 * que ele tenha uma linha correspondente em public.users — é essa linha
 * (não o Firebase UID direto) que profiles/applications referenciam via FK.
 *
 * Usado por toda rota que precisa saber "quem está fazendo essa request":
 * app/api/profile, app/api/applications, app/(dashboard)/dashboard, etc.
 */

import { adminAuth } from './firebase-admin';
import { getSupabaseAdmin } from './supabase-admin';

export const SESSION_COOKIE_NAME = '__session';

export class UnauthenticatedError extends Error {}

export interface AppUser {
  /** id em public.users (UUID) — é este que profiles/applications usam como FK. */
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
}

/**
 * Verifica o cookie de sessão do Firebase e sincroniza (upsert) a linha do
 * usuário em public.users. Lança UnauthenticatedError se o cookie estiver
 * ausente, expirado ou inválido — quem chama decide o que fazer (401 numa
 * rota; null/redirect numa página).
 */
export async function getAuthenticatedUser(
  sessionCookie: string | undefined,
): Promise<AppUser> {
  if (!sessionCookie) {
    throw new UnauthenticatedError('Sessão ausente. Faça login para continuar.');
  }

  let decoded;
  try {
    decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    throw new UnauthenticatedError('Sessão inválida ou expirada. Faça login novamente.');
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert(
      {
        firebase_uid: decoded.uid,
        email: decoded.email ?? '',
        display_name: decoded.name ?? null,
        photo_url: decoded.picture ?? null,
      },
      { onConflict: 'firebase_uid' },
    )
    .select('id, firebase_uid, email, display_name, photo_url')
    .single();

  if (error || !data) {
    console.error('Erro ao sincronizar usuário autenticado:', error);
    throw new Error('Não foi possível sincronizar seu usuário. Tente novamente.');
  }

  return {
    id: data.id,
    firebaseUid: data.firebase_uid,
    email: data.email,
    displayName: data.display_name,
    photoUrl: data.photo_url,
  };
}

/**
 * Mesma coisa, mas devolve null em vez de lançar — para páginas PÚBLICAS
 * (ex: /jobs/[id]) que só precisam saber "esse visitante está logado?"
 * sem bloquear quem não está.
 */
export async function getOptionalAuthenticatedUser(
  sessionCookie: string | undefined,
): Promise<AppUser | null> {
  try {
    return await getAuthenticatedUser(sessionCookie);
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return null;
    }
    throw error;
  }
}
