export type JobType = 'CLT' | 'PJ' | 'Freelance' | 'Internship';
export type JobModality = 'Remote' | 'Hybrid' | 'On-site';
export type JobLevel = 'Junior' | 'Mid' | 'Senior' | 'Staff';

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  country?: string;
  type?: JobType;
  modality?: JobModality;
  level?: JobLevel;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  techs?: string[];
  description?: string;
  url: string;
  source?: string;
  postedAt?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface Profile {
  id: string;
  name?: string;
  email?: string;
  bio?: string;
  techs?: string[];
  experienceYears?: number;
  level?: JobLevel;
  softSkills?: Record<string, number>;
  prefModality?: JobModality[];
  prefCountry?: string[];
  prefLevel?: JobLevel;
  salaryExpectation?: number;
  openToRelocate?: boolean;
  savedJobs?: string[];
  appliedJobs?: string[];
  dismissedJobs?: string[];
  updatedAt?: string;
}

// TODO: expandir os contratos com enums, payloads de autenticação e DTOs de API.
