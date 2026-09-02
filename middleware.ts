/**
 * Middleware de autenticação
 *
 * REGRAS:
 * - PÚBLICO (sem login): /, /jobs, /login, /api/*, arquivos estáticos
 * - PROTEGIDO (exige login): /dashboard, /profile, /submit-job
 *
 * A home e a listagem de vagas são públicas — o visitante explora
 * antes de decidir entrar.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que NÃO precisam de autenticação
const PUBLIC_ROUTES = [
  '/', // Home pública
  '/jobs', // Listagem de vagas pública
  '/login', // Página de login
  '/api', // API Routes
  '/_next', // Next.js internals
  '/favicon.ico', // Favicon
];

// Rotas que EXIGEM autenticação
const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/submit-job', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se for rota pública, libera imediatamente
  const isPublic = PUBLIC_ROUTES.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route),
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // Se não for rota protegida, também libera (fallback seguro)
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Rota protegida: verifica sessão
  const sessionCookie = request.cookies.get('__session')?.value;

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
