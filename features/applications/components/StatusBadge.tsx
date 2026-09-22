import type { ApplicationStatus } from '../types';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  APPLIED: { label: 'Enviada', className: 'bg-blue-100 text-blue-800' },
  REVIEWING: { label: 'Em análise', className: 'bg-amber-100 text-amber-800' },
  ACCEPTED: { label: 'Aceita', className: 'bg-emerald-100 text-emerald-800' },
  REJECTED: { label: 'Rejeitada', className: 'bg-red-100 text-red-800' },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${config.className}`}>
      {config.label}
    </span>
  );
}
