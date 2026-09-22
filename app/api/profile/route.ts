/**
 * Perfil do candidato autenticado (V2, Bloco 1).
 *
 * GET  -> perfil do usuário logado (ou { profile: null } se ele nunca salvou)
 * POST { bio?, github_url?, linkedin_url?, portfolio_url?, skills?, seniority? }
 *   -> upsert do perfil, sempre o do usuário do cookie de sessão (nunca um
 *      id arbitrário mandado pelo client — não dá pra editar perfil de
 *      outra pessoa por aqui).
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser, SESSION_COOKIE_NAME, UnauthenticatedError } from '@/lib/auth-server';
import { getProfile, upsertProfile } from '@/features/profile/server/profile';

const profileInputSchema = z.object({
  bio: z.string().trim().max(2000).nullable().optional(),
  github_url: z.string().trim().url().max(500).nullable().optional().or(z.literal('')),
  linkedin_url: z.string().trim().url().max(500).nullable().optional().or(z.literal('')),
  portfolio_url: z.string().trim().url().max(500).nullable().optional().or(z.literal('')),
  skills: z.array(z.string().trim().min(1).max(60)).max(50).optional(),
  seniority: z.enum(['JUNIOR', 'PLENO', 'SENIOR', 'STAFF']).nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    const profile = await getProfile(user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json({ error: 'Não foi possível carregar o perfil.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let user;
  try {
    user = await getAuthenticatedUser(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido no corpo da requisição.' }, { status: 400 });
  }

  const parsed = profileInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados de perfil inválidos.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // '' (campo de URL deixado em branco no form) vira null, não uma URL inválida.
  const { bio, skills, seniority } = parsed.data;
  const github_url = parsed.data.github_url || null;
  const linkedin_url = parsed.data.linkedin_url || null;
  const portfolio_url = parsed.data.portfolio_url || null;

  try {
    const profile = await upsertProfile(user.id, {
      bio,
      github_url,
      linkedin_url,
      portfolio_url,
      skills,
      seniority,
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    return NextResponse.json({ error: 'Não foi possível salvar o perfil.' }, { status: 500 });
  }
}
