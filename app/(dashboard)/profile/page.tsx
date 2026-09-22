import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { getProfile } from '@/features/profile/server/profile';
import { getAuthenticatedUser, SESSION_COOKIE_NAME, UnauthenticatedError } from '@/lib/auth-server';

export default async function ProfilePage() {
  const cookieStore = await cookies();

  let user;
  try {
    user = await getAuthenticatedUser(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      // O middleware já exige o cookie pra chegar em /profile, mas ele só
      // checa "existe", não "é válido" — se expirou, caímos aqui.
      redirect('/login?redirect=/profile');
    }
    throw error;
  }

  const profile = await getProfile(user.id);

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-1">
          Bio, links e skills que aparecem pra quem revisa suas candidaturas.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </main>
  );
}
