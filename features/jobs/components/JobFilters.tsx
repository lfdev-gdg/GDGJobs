'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { JobModality, SeniorityLevel } from '../types';

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [modality, setModality] = useState<string>(searchParams.get('modality') || 'ALL');
  const [seniority, setSeniority] = useState<string>(searchParams.get('seniority') || 'ALL');
  const [tech, setTech] = useState(searchParams.get('tech') || '');

  // Sincroniza as alterações com a URL da página
  const applyFilters = useCallback(
    (newFilters: { search?: string; modality?: string; seniority?: string; tech?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search, modality, seniority, tech });
  };

  const handleReset = () => {
    setSearch('');
    setModality('ALL');
    setSeniority('ALL');
    setTech('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Busca por Texto (Título / Empresa) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Buscar por palavra-chave
          </label>
          <input
            type="text"
            placeholder="Ex: React, GDG, Frontend..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro de Modalidade */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Modalidade</label>
          <select
            value={modality}
            onChange={(e) => {
              const val = e.target.value;
              setModality(val);
              applyFilters({ search, modality: val, seniority, tech });
            }}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">Todas as modalidades</option>
            <option value="REMOTE">Remoto</option>
            <option value="HYBRID">Híbrido</option>
            <option value="ON_SITE">Presencial</option>
          </select>
        </div>

        {/* Filtro de Senioridade */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nível / Senioridade
          </label>
          <select
            value={seniority}
            onChange={(e) => {
              const val = e.target.value;
              setSeniority(val);
              applyFilters({ search, modality, seniority: val, tech });
            }}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">Todos os níveis</option>
            <option value="JUNIOR">Júnior</option>
            <option value="PLENO">Pleno</option>
            <option value="SENIOR">Sênior</option>
            <option value="STAFF">STAFF</option>
          </select>
        </div>

        {/* Filtro por Tecnologia Especifica */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Tecnologia/Stack</label>
          <input
            type="text"
            placeholder="Ex: TypeScript, Python..."
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-medium text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded transition-colors"
        >
          Limpar Filtros
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {isPending ? 'Filtrando...' : 'Aplicar Filtros'}
        </button>
      </div>
    </form>
  );
}
