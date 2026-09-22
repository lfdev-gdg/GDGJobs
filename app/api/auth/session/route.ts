/**
 * Troca um ID token do Firebase (client) por um cookie de sessão httpOnly.
 * O middleware usa esse cookie (__session) para proteger rotas server-side —
 * sem ele, /dashboard nunca reconhece o login feito no client.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000; // 5 dias (máximo aceito pelo Admin SDK)

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json({ error: 'idToken ausente' }, { status: 400 });
  }

  try {
    // checkRevoked garante que um token revogado não gere sessão nova
    await adminAuth.verifyIdToken(idToken, true);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN_MS,
    });

    const response = NextResponse.json({ status: 'ok' });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRES_IN_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'ok' });
  response.cookies.set(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}
