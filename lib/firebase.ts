/**
 * Configuração do Firebase Auth para o GDG Jobs
 * Todas as variáveis vêm de .env.local (NEXT_PUBLIC_*)
 *
 * Campos usados:
 * - apiKey: autenticação com Firebase
 * - authDomain: domínio do Firebase Auth
 * - projectId: identificador do projeto
 * - storageBucket: Storage do Firebase (futuro)
 * - messagingSenderId: Cloud Messaging (futuro)
 * - appId: identificador do app
 * - measurementId: Google Analytics (futuro)
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

// Validação: garante que todas as variáveis estão definidas
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(
      `[Firebase Config] Variável de ambiente ausente: ${key}\n` +
        `Verifique se o arquivo .env.local está criado e preenchido.\n` +
        `Copie de: cp .env.example .env.local`,
    );
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

// Singleton: evita re-inicialização no hot reload do Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Scopes adicionais para pegar email e profile do Google
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { signInWithPopup, signOut, onAuthStateChanged };
export type { User };
