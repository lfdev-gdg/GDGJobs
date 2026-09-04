export type JobModality = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type SeniorityLevel = 'JUNIOR' | 'PLENO' | 'SENIOR' | 'STAFF';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  location: string;
  modality: JobModality;
  seniority: SeniorityLevel;
  description: string;
  requirements: string[];
  technologies: string[];
  application_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobFilters {
  search?: string;
  modality?: JobModality | 'ALL';
  seniority?: SeniorityLevel | 'ALL';
  tech?: string;
}
