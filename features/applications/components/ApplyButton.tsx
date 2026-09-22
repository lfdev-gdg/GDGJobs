'use client';

import { CheckCircle2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/toaster';

interface ApplyButtonProps {
  jobId: string;
  isAuthenticated: boolean;
  /** Candidatura já existente pra essa vaga, resolvida no server (job detail page). */
  initialHasApplied: boolean;
}

/**
 * Botão de candidatura 1-click. Três estados possíveis:
 *   1. Não autenticado -> vira link pro login (volta pra essa vaga depois)
 *   2. Já candidatado   -> badge fixo "Candidatura enviada", não clicável
 *   3. Pendente         -> botão clicável que registra a candidatura
 *
 * UI otimista: ao clicar, já mostra "enviada" antes da resposta do
 * servidor chegar. Se der erro, volta pro estado anterior — a prevenção
 * de duplicados de verdade é a UNIQUE (job_id, user_id) no banco (ver
 * features/applications/server/applications.ts), isso aqui é só UX.
 */
export function ApplyButton({ jobId, isAuthenticated, initialHasApplied }: ApplyButtonProps) {
  const { showToast } = useToast();
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?redirect=/jobs/${jobId}`}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
      >
        <LogIn className="w-4 h-4" />
        Entrar para se candidatar
      </Link>
    );
  }

  if (hasApplied) {
    return (
      <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-4 py-2 rounded-md cursor-default">
        <CheckCircle2 className="w-4 h-4" />
        Candidatura enviada
      </span>
    );
  }

  const handleApply = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setHasApplied(true); // otimista

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setHasApplied(false); // reverte a UI otimista
        showToast(body.error ?? 'Não foi possível enviar a candidatura.', 'error');
        return;
      }

      showToast('Candidatura enviada!', 'success');
    } catch {
      setHasApplied(false);
      showToast('Erro de conexão ao enviar a candidatura. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50"
    >
      {isSubmitting ? 'Enviando...' : 'Candidatar-se'}
    </button>
  );
}
