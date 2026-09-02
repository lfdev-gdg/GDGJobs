/**
 * Página de login — Firebase Auth com Google
 * Route group (auth) não aplica layout do dashboard
 */
// app/(auth)/login/page.tsx
/**
 * Página de login — Firebase Auth com Google
 * Aceita ?redirect=/jobs (ou outra rota) para voltar depois do login
 */

'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function LoginSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function LoginForm() {
  const { user, isLoading, isAuthenticated, error, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Redireciona após login bem-sucedido
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, redirectTo, router]);

  if (isLoading) {
    return <LoginSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">GDG Jobs</h1>
          <p className="text-sm text-slate-500">Entre com sua conta Google para continuar</p>
          {redirectTo !== '/dashboard' && (
            <p className="text-xs text-slate-400 mt-1">
              Você será redirecionado de volta após o login
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Entrar com Google
        </button>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Voltar para a home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
