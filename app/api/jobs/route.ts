import { NextRequest, NextResponse } from 'next/server';
import { getJobs } from '@/features/jobs/server/get-jobs';
import { JobModality, SeniorityLevel } from '@/features/jobs/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters = {
    search: searchParams.get('search') || undefined,
    modality: (searchParams.get('modality') as JobModality) || undefined,
    seniority: (searchParams.get('seniority') as SeniorityLevel) || undefined,
    tech: searchParams.get('tech') || undefined,
  };

  try {
    const jobs = await getJobs(filters);
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao buscar vagas' }, { status: 500 });
  }
}
