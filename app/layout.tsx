import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GDG Jobs',
  description: 'Painel de vagas curado pela comunidade GDG.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

// TODO: configurar providers de tema, auth e analytics aqui.
