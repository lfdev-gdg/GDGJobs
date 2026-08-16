export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobDraft {
  title?: string;
  company?: string;
  location?: string;
  country?: string;
  type?: string;
  modality?: string;
  level?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  techs?: string[];
  description?: string;
  url?: string;
  source?: string;
}

export interface ProfileDraft {
  name?: string;
  email?: string;
  bio?: string;
  techs?: string[];
  experienceYears?: number;
  level?: string;
  softSkills?: Record<string, number>;
  prefModality?: string[];
  prefCountry?: string[];
  prefLevel?: string;
  salaryExpectation?: number;
  openToRelocate?: boolean;
}

// TODO: definir contratos finais compartilhados entre frontend, backend e ML.
