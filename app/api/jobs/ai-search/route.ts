/**
 * Endpoint da busca de vagas em linguagem natural (Feature 3 da V1).
 *
 * POST { query: "vaga remota React sênior" }
 *   -> { filters: { modality: "REMOTE", seniority: "SENIOR", tech: "React" } }
 *
 * O client (AiSearchBar) usa o retorno pra montar a URL /jobs?... e deixa a
 * própria página server-side (getJobs) aplicar os filtros — o endpoint só
 * traduz linguagem natural em filtros estruturados, não busca vagas.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractJobFiltersFromQuery, AiNotConfiguredError } from '@/lib/ai';

export async function POST(request: NextRequest) {
  let query: unknown;

  try {
    const body = await request.json();
    query = body?.query;
  } catch {
    return NextResponse.json({ error: 'JSON inválido no corpo da requisição.' }, { status: 400 });
  }

  if (typeof query !== 'string' || !query.trim()) {
    return NextResponse.json(
      { error: 'Campo "query" é obrigatório (busca em linguagem natural).' },
      { status: 400 },
    );
  }

  try {
    const filters = await extractJobFiltersFromQuery(query);
    return NextResponse.json({ filters });
  } catch (error) {
    if (error instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    console.error('Erro na busca de vagas por IA:', error);
    return NextResponse.json(
      {
        error: 'Não foi possível interpretar a busca agora. Tente novamente ou use os filtros manuais.',
      },
      { status: 502 },
    );
  }
}
