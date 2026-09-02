/**
 * Hook de autenticação com Firebase
 * Gerencia login, logout e estado do usuário
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from '@/lib/firebase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, isLoading: false, error: null });
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setState({ user: result.user, isLoading: false, error: null });
      return result.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await signOut(auth);
      setState({ user: null, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao sair';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: !!state.user,
    error: state.error,
    loginWithGoogle,
    logout,
  };
}
