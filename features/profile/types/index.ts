import type { SeniorityLevel } from '@/features/jobs/types';

export type { SeniorityLevel };

export interface Profile {
  id: string;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  skills: string[];
  seniority: SeniorityLevel | null;
  created_at: string;
  updated_at: string;
}

/** Payload aceito por POST /api/profile (todos os campos opcionais/parciais). */
export interface ProfileInput {
  bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  skills?: string[];
  seniority?: SeniorityLevel | null;
}

/** Retorno de POST /api/profile/ai-extract — o que a IA consegue inferir do texto bruto. */
export interface AiProfileExtraction {
  bio: string;
  skills: string[];
  seniority: SeniorityLevel;
}
