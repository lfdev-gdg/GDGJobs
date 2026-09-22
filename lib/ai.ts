/**
 * Cliente Gemini para a busca de vagas em linguagem natural (Feature 3 da V1).
 *
 * Recebe algo como "vaga remota React sênior" e devolve um JSON estruturado
 * com os mesmos campos do JobFilters (search/modality/seniority/tech), que
 * o endpoint em app/api/jobs/ai-search/route.ts aplica na query do Supabase.
 *
 * Requer GEMINI_API_KEY no .env.local — gere em https://aistudio.google.com/apikey
 */

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { z } from 'zod';
import type { JobFilters } from '@/features/jobs/types';

const apiKey = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export class AiNotConfiguredError extends Error {}

// Schema de saída controlada (structured output): o Gemini é forçado a
// responder só com esses campos/enums — evita ter que extrair JSON de um
// texto livre na mão.
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    search: {
      type: SchemaType.STRING,
      nullable: true,
      description:
        'Palavra-chave livre (cargo ou empresa) da busca que não corresponde a modality/seniority/tech. Null se não houver.',
    },
    modality: {
      type: SchemaType.STRING,
      enum: ['REMOTE', 'HYBRID', 'ON_SITE', 'ALL'],
      nullable: true,
      description: 'Modalidade de trabalho citada. ALL ou null se a busca não menciona modalidade.',
    },
    seniority: {
      type: SchemaType.STRING,
      enum: ['JUNIOR', 'PLENO', 'SENIOR', 'STAFF', 'ALL'],
      nullable: true,
      description: 'Nível de senioridade citado. ALL ou null se a busca não menciona nível.',
    },
    tech: {
      type: SchemaType.STRING,
      nullable: true,
      description: 'Principal tecnologia/stack citada (ex: React, Python, Java). Null se não houver.',
    },
  },
  required: [],
} as const;

// Validação do lado do nosso código: mesmo com structured output, nunca
// confiamos 100% no que o modelo devolve.
const geminiFilterSchema = z.object({
  search: z.string().trim().min(1).nullable().optional(),
  modality: z.enum(['REMOTE', 'HYBRID', 'ON_SITE', 'ALL']).nullable().optional(),
  seniority: z.enum(['JUNIOR', 'PLENO', 'SENIOR', 'STAFF', 'ALL']).nullable().optional(),
  tech: z.string().trim().min(1).nullable().optional(),
});

const SYSTEM_PROMPT = `Você é um parser de buscas por vagas de emprego em tecnologia, em português ou inglês.
Extraia da frase do usuário APENAS os campos definidos no schema de resposta:
- modality: REMOTE (remoto/home office), HYBRID (híbrido) ou ON_SITE (presencial). ALL se não citado.
- seniority: JUNIOR, PLENO, SENIOR ou STAFF (staff/especialista/principal). ALL se não citado.
- tech: uma única tecnologia/stack principal citada (ex: "React", "Python", "Java"). Null se nenhuma tecnologia for citada.
- search: qualquer palavra-chave restante relevante (cargo, empresa) que não seja modality/seniority/tech. Null se não houver mais nada relevante.
Nunca invente valores que não estejam implícitos na frase do usuário.`;

/**
 * Chama o Gemini para transformar busca em linguagem natural em filtros
 * estruturados compatíveis com JobFilters.
 */
export async function extractJobFiltersFromQuery(query: string): Promise<Partial<JobFilters>> {
  if (!genAI) {
    throw new AiNotConfiguredError(
      'GEMINI_API_KEY não configurada. Adicione a chave no .env.local para habilitar a busca por IA (veja .env.example).',
    );
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- shape do SDK do Gemini
      responseSchema: responseSchema as any,
      temperature: 0,
    },
  });

  const result = await model.generateContent([SYSTEM_PROMPT, `Busca do usuário: "${query.trim()}"`]);
  const text = result.response.text();

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('O Gemini retornou uma resposta que não é um JSON válido.');
  }

  const parsed = geminiFilterSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('A resposta da IA não seguiu o formato esperado de filtros.');
  }

  const { search, modality, seniority, tech } = parsed.data;
  const filters: Partial<JobFilters> = {};

  if (search) filters.search = search;
  if (modality && modality !== 'ALL') filters.modality = modality;
  if (seniority && seniority !== 'ALL') filters.seniority = seniority;
  if (tech) filters.tech = tech;

  return filters;
}
