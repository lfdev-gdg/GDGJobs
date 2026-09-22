import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  /** searchParams atuais (sem "page"), para preservar os filtros ao trocar de página */
  searchParams: Record<string, string | undefined>;
}

// Server Component: cada link já aponta pra URL final (?page=N&...), sem
// precisar de JS no client — a navegação server-side é quem faz a paginação.
export function Pagination({ page, totalPages, totalCount, pageSize, searchParams }: PaginationProps) {
  if (totalCount === 0) {
    return null;
  }

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (targetPage > 1) {
      params.set('page', String(targetPage));
    } else {
      params.delete('page');
    }
    const query = params.toString();
    return `/jobs${query ? `?${query}` : ''}`;
  };

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <nav
      aria-label="Paginação de vagas"
      className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100"
    >
      <p className="text-sm text-gray-500">
        Mostrando <span className="font-medium text-gray-700">{start}–{end}</span> de{' '}
        <span className="font-medium text-gray-700">{totalCount}</span> vagas
      </p>

      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-300 border border-gray-100 rounded-md px-3 py-1.5 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </span>
        )}

        <span className="text-sm text-gray-500 px-2">
          Página <span className="font-medium text-gray-700">{page}</span> de{' '}
          <span className="font-medium text-gray-700">{totalPages}</span>
        </span>

        {page < totalPages ? (
          <Link
            href={buildHref(page + 1)}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-300 border border-gray-100 rounded-md px-3 py-1.5 cursor-not-allowed">
            Próxima
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
