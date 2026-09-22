export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';

/** Status em que a candidatura ainda está em andamento (dashboard: "candidaturas ativas"). */
export const ACTIVE_APPLICATION_STATUSES: ApplicationStatus[] = ['APPLIED', 'REVIEWING'];

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Candidatura + o resumo da vaga associada — o que o dashboard do candidato exibe. */
export interface ApplicationWithJob {
  id: string;
  status: ApplicationStatus;
  created_at: string;
  job: {
    id: string;
    title: string;
    company_name: string;
    modality: string;
    seniority: string;
  };
}
