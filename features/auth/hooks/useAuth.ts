/**
 * Hook de autenticação com Firebase
 * Gerencia login, logout e estado do usuário
 * USO:
 * const { user, isLoading, isAuthenticated, loginWithGoogle, logout } = useAuth();
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '@/lib/firebase';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

// Mantém o cookie __session (lido pelo middleware) sincronizado com a sessão
// do Firebase no client. Sem isso, rotas protegidas nunca enxergam um login
// feito só no client, e o app entra num loop de redirect /login <-> /dashboard.
async function syncSessionCookie(firebaseUser: User | null): Promise<void> {
  if (firebaseUser) {
    const idToken = await firebaseUser.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } else {
    await fetch('/api/auth/session', { method: 'DELETE' });
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    // onAuthStateChanged é a ÚNICA fonte da verdade para a sessão do usuário
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          await syncSessionCookie(firebaseUser);
        } catch {
          // Segue mesmo se a sincronização falhar; o middleware protege as rotas de qualquer forma
        }

        setState({
          user: firebaseUser,
          isLoading: false,
          isAuthenticated: !!firebaseUser,
          error: null,
        });
      },
      (error) => {
        // Trata falhas internas de escuta do Firebase
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
      },
    );

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Garante que o cookie já existe antes do caller redirecionar para uma rota protegida
      await syncSessionCookie(result.user);
      return result.user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Falha no login com Google');
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error,
      }));
      throw error; // Relança para o handler do componente capturar no try/catch
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await signOut(auth);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Falha ao encerrar sessão');
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error,
      }));
      throw error;
    }
  }, []);

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    loginWithGoogle,
    logout,
  };
}
