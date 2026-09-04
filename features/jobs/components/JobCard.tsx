import Link from 'next/link';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
            {job.modality}
          </span>
          <span className="text-xs text-gray-500">{job.seniority}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {job.company_name} • {job.location}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.technologies.map((tech) => (
            <span key={tech} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {new Date(job.created_at).toLocaleDateString('pt-BR')}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Ver detalhes →
        </Link>
      </div>
    </div>
  );
}
