/**
 * Configuração do Firebase Admin SDK (server-side only)
 * Usado para verificar ID tokens e emitir o cookie de sessão (__session)
 * que o middleware lê para proteger /dashboard, /profile, /submit-job.
 *
 * Credenciais vêm de uma Service Account (Firebase Console → Project
 * Settings → Contas de serviço → Gerar nova chave privada).
 */

import { cert, getApps, getApp, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const requiredEnv: Array<[string, string | undefined]> = [
  ['FIREBASE_PROJECT_ID', process.env.FIREBASE_PROJECT_ID],
  ['FIREBASE_CLIENT_EMAIL', process.env.FIREBASE_CLIENT_EMAIL],
  ['FIREBASE_PRIVATE_KEY', privateKey],
];

for (const [envName, value] of requiredEnv) {
  if (!value) {
    throw new Error(
      `[Firebase Admin] Variável de ambiente ausente: ${envName}\n` +
        `Gere uma Service Account em: Firebase Console → Project Settings → Contas de serviço.\n` +
        `Preencha FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no .env.local.`,
    );
  }
}

const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      })
    : getApp();

export const adminAuth = getAuth(adminApp);
