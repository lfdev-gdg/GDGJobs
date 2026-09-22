import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { listApplicationsWithJobsForUser } from '@/features/applications/server/applications';
import { StatusBadge } from '@/features/applications/components/StatusBadge';
import { ACTIVE_APPLICATION_STATUSES } from '@/features/applications/types';
import { getAuthenticatedUser, SESSION_COOKIE_NAME, UnauthenticatedError } from '@/lib/auth-server';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  let user;
  try {
    user = await getAuthenticatedUser(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      // Mesma situação do /profile: o middleware só exige o cookie
      // existir, não que ele ainda seja válido.
      redirect('/login?redirect=/dashboard');
    }
    throw error;
  }

  const applications = await listApplicationsWithJobsForUser(user.id);

  const activeCount = applications.filter((app) =>
    ACTIVE_APPLICATION_STATUSES.includes(app.status),
  ).length;
  const acceptedCount = applications.filter((app) => app.status === 'ACCEPTED').length;
  const rejectedCount = applications.filter((app) => app.status === 'REJECTED').length;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Candidaturas</h1>
        <p className="text-gray-600 mt-1">Acompanhe o status das vagas que você se candidatou.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ativas" value={activeCount} highlight />
        <StatCard label="Total" value={applications.length} />
        <StatCard label="Aceitas" value={acceptedCount} />
        <StatCard label="Rejeitadas" value={rejectedCount} />
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium mb-3">
            Você ainda não se candidatou a nenhuma vaga.
          </p>
          <Link href="/jobs" className="text-blue-600 font-medium hover:underline">
            Ver vagas disponíveis →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/jobs/${application.job.id}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 truncate block"
                >
                  {application.job.title}
                </Link>
                <p className="text-sm text-gray-500 truncate">
                  {application.job.company_name} •{' '}
                  {new Date(application.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <StatusBadge status={application.status} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
      }`}
    >
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
