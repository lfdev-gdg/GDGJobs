import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getJobById } from '@/features/jobs/server/get-jobs';
import { getApplicationForUser } from '@/features/applications/server/applications';
import { ApplyButton } from '@/features/applications/components/ApplyButton';
import { getOptionalAuthenticatedUser, SESSION_COOKIE_NAME } from '@/lib/auth-server';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  // /jobs/[id] é pública (visitante não-logado também vê a vaga) — por
  // isso a versão "optional" aqui: sabemos se tem usuário sem forçar login.
  const cookieStore = await cookies();
  const user = await getOptionalAuthenticatedUser(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const existingApplication = user ? await getApplicationForUser(job.id, user.id) : null;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600">
              {job.company_name} • {job.location}
            </p>
          </div>
          <div className="shrink-0">
            <ApplyButton
              jobId={job.id}
              applicationUrl={job.application_url}
              isAuthenticated={!!user}
              initialHasApplied={!!existingApplication}
            />
          </div>
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
