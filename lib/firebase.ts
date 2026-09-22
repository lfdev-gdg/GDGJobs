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

// Acessos literais a process.env.NEXT_PUBLIC_* — só assim o Next.js consegue
// inlinar os valores no bundle do navegador. process.env[key] dinâmico não é
// substituído em build time e sempre resulta em undefined no client.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

// Validação: garante que todas as variáveis obrigatórias estão definidas
const requiredKeys = [
  ['apiKey', 'NEXT_PUBLIC_FIREBASE_API_KEY'],
  ['authDomain', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  ['projectId', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
  ['storageBucket', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'],
  ['messagingSenderId', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
  ['appId', 'NEXT_PUBLIC_FIREBASE_APP_ID'],
] as const;

for (const [configKey, envName] of requiredKeys) {
  if (!firebaseConfig[configKey]) {
    throw new Error(
      `[Firebase Config] Variável de ambiente ausente: ${envName}\n` +
        `Verifique se o arquivo .env.local está criado e preenchido.\n` +
        `Copie de: cp .env.example .env.local`,
    );
  }
}

// Singleton: evita re-inicialização no hot reload do Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Scopes adicionais para pegar email e profile do Google
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { signInWithPopup, signOut, onAuthStateChanged };
export type { User };
