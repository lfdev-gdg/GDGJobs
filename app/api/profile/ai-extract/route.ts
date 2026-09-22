/**
 * Extração de perfil por IA (V2, Bloco 1).
 *
 * POST { rawText: "texto livre sobre o candidato" }
 *   -> { bio, skills, seniority }
 *
 * O ProfileForm usa o retorno pra PRÉ-PREENCHER os campos — o candidato
 * ainda revisa/edita antes de salvar de verdade em POST /api/profile.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AiNotConfiguredError, extractProfileFromText } from '@/lib/ai';
import { getAuthenticatedUser, SESSION_COOKIE_NAME, UnauthenticatedError } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    await getAuthenticatedUser(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  let rawText: unknown;
  try {
    const body = await request.json();
    rawText = body?.rawText;
  } catch {
    return NextResponse.json({ error: 'JSON inválido no corpo da requisição.' }, { status: 400 });
  }

  if (typeof rawText !== 'string' || !rawText.trim()) {
    return NextResponse.json(
      { error: 'Campo "rawText" é obrigatório (texto livre sobre você).' },
      { status: 400 },
    );
  }

  try {
    const extracted = await extractProfileFromText(rawText);
    return NextResponse.json(extracted);
  } catch (error) {
    if (error instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    console.error('Erro na extração de perfil por IA:', error);
    return NextResponse.json(
      { error: 'Não foi possível interpretar o texto agora. Tente novamente ou preencha manualmente.' },
      { status: 502 },
    );
  }
}
