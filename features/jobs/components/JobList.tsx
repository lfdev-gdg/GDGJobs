import { Job } from '../types';
import { JobCard } from './JobCard';

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
}

export function JobList({ jobs, loading }: JobListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-48 bg-gray-100 rounded-lg animate-pulse p-4" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">
          Nenhuma vaga encontrada para os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
