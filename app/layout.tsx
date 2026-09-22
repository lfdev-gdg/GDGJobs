/**
 * Layout raiz — providers globais
 * Importa Tailwind CSS e fonte Inter
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GDG Jobs: Vagas curadas pela comunidade',
  description: 'Hub de vagas de tecnologia curado pela comunidade GDG Lauro de Freitas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
