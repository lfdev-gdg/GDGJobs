import { Suspense } from 'react';
import { getJobs } from '@/features/jobs/server/get-jobs';
import { JobList } from '@/features/jobs/components/JobList';
import { JobFilters } from '@/features/jobs/components/JobFilters';
import { JobModality, SeniorityLevel } from '@/features/jobs/types';

interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    modality?: JobModality | 'ALL';
    seniority?: SeniorityLevel | 'ALL';
    tech?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const filters = await searchParams;

  // Busca vagas filtradas no lado do servidor
  const jobs = await getJobs({
    search: filters.search,
    modality: filters.modality,
    seniority: filters.seniority,
    tech: filters.tech,
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vagas da Comunidade</h1>
        <p className="text-gray-600 mt-1">
          Encontre e filtre vagas curadas pelo GDG Lauro de Freitas.
        </p>
      </div>

      {/* Componente Client-Side para manipular os filtros de busca */}
      <Suspense fallback={<div className="h-32 bg-gray-100 rounded-lg animate-pulse mb-6" />}>
        <JobFilters />
      </Suspense>

      {/* Lista das vagas retornadas */}
      <JobList jobs={jobs} />
    </main>
  );
}
