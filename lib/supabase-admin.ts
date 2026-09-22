/**
 * Cliente Supabase com a service role key — ignora RLS, uso EXCLUSIVO em
 * código server-side (rotas em app/api/**), nunca importado por um
 * componente client.
 *
 * Diferente de lib/supabase.ts, o client aqui é construído sob demanda
 * (getSupabaseAdmin()), não no carregamento do módulo. Fizemos assim de
 * propósito: o `next build` do V1 quebrou no CI porque lib/supabase.ts e
 * lib/firebase-admin.ts instanciam seus clients eagerly, e o Next executa
 * esse código ao "coletar dados" de cada rota mesmo sem nenhuma request de
 * verdade — sem as env vars corretas (o CI não tinha nenhuma), o build
 * falhava (ver .github/workflows/ci.yml). Uma factory lazy evita esse
 * problema de raiz pra qualquer client novo: só falha se alguém de fato
 * chamar getSupabaseAdmin() sem a service role key configurada.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      '[Supabase Admin] Variáveis de ambiente ausentes: NEXT_PUBLIC_SUPABASE_URL e/ou ' +
        'SUPABASE_SERVICE_ROLE_KEY. Preencha o .env.local (veja .env.example) — a service role ' +
        'key fica em Supabase Dashboard → Project Settings → API → service_role.',
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      // Este client nunca deve manter sessão de usuário — cada request já
      // chega com o usuário resolvido via cookie de sessão do Firebase.
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
