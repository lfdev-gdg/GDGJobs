import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  url: z.string().url(),
});

export const profileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

// TODO: criar validadores de domínio para vagas, perfil, submissão e onboarding.
