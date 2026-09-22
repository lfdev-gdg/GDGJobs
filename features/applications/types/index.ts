export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';

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
