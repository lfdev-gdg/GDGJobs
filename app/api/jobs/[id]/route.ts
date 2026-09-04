import { NextRequest, NextResponse } from 'next/server';
import { getJobById } from '@/features/jobs/server/get-jobs';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await getJobById(params.id);

    if (!job) {
      return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao buscar vaga' }, { status: 500 });
  }
}
