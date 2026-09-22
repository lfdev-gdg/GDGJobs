'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const FILTER_KEYS = ['search', 'modality', 'seniority', 'tech'] as const;

export function AiSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/jobs/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? 'Não foi possível interpretar a busca.');
        return;
      }

      const filters = (body.filters ?? {}) as Record<string, string | undefined>;
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page'); // toda nova busca reinicia a paginação

      FILTER_KEYS.forEach((key) => {
        if (filters[key]) {
          params.set(key, filters[key] as string);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    } catch {
      setError('Erro de conexão ao buscar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-500">
        <Sparkles className="w-5 h-5 text-purple-500 shrink-0 ml-1" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Busque em linguagem natural: "vaga remota React sênior"'
          className="flex-1 text-sm outline-none px-1 py-1.5"
        />
        <button
          type="submit"
          disabled={isBusy || !query.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50 shrink-0"
        >
          {isBusy ? 'Buscando...' : 'Buscar com IA'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5 ml-1">{error}</p>}
    </form>
  );
}
