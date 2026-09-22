/**
 * Candidatura 1-click (V2, Bloco 2).
 *
 * POST { job_id } -> registra a candidatura do usuário autenticado.
 * Idempotente: candidatar de novo pra mesma vaga devolve a candidatura já
 * existente (200), nunca erro — a prevenção de duplicados de verdade é a
 * UNIQUE (job_id, user_id) no banco (ver applications.ts), isso aqui só
 * evita expor esse detalhe como se fosse uma falha pro candidato.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthenticatedUser, SESSION_COOKIE_NAME, UnauthenticatedError } from '@/lib/auth-server';
import { createApplication } from '@/features/applications/server/applications';

const FOREIGN_KEY_VIOLATION = '23503';

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

  let jobId: unknown;
  try {
    const body = await request.json();
    jobId = body?.job_id;
  } catch {
    return NextResponse.json({ error: 'JSON inválido no corpo da requisição.' }, { status: 400 });
  }

  if (typeof jobId !== 'string' || !jobId) {
    return NextResponse.json({ error: 'Campo "job_id" é obrigatório.' }, { status: 400 });
  }

  try {
    const application = await createApplication(jobId, user.id);
    return NextResponse.json({ application });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === FOREIGN_KEY_VIOLATION) {
      return NextResponse.json({ error: 'Vaga não encontrada.' }, { status: 404 });
    }

    console.error('Erro ao registrar candidatura:', error);
    return NextResponse.json(
      { error: 'Não foi possível registrar a candidatura. Tente novamente.' },
      { status: 500 },
    );
  }
}
