import { notFound } from 'next/navigation';
import { getJobById } from '@/features/jobs/server/get-jobs';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);

  if (!job) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600">
              {job.company_name} • {job.location}
            </p>
          </div>
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Candidatar-se
          </a>
        </div>

        <div className="flex gap-2 my-4">
          <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded font-medium">
            {job.modality}
          </span>
          <span className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded font-medium">
            {job.seniority}
          </span>
        </div>

        <hr className="my-6" />

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Descrição da Vaga</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Requisitos</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-2">Tecnologias</h2>
          <div className="flex flex-wrap gap-2">
            {job.technologies.map((tech) => (
              <span key={tech} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
