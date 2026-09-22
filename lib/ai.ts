/**
 * Cliente Gemini do GDGJobs — duas extrações estruturadas:
 *   - extractJobFiltersFromQuery: busca de vagas em linguagem natural (V1)
 *   - extractProfileFromText: perfil do candidato a partir de texto livre (V2)
 *
 * Ambas seguem o mesmo padrão: responseSchema (structured output) pra
 * forçar o formato de saída + validação com zod do nosso lado, porque
 * nunca confiamos 100% no que o modelo devolve mesmo com schema.
 *
 * Requer GEMINI_API_KEY no .env.local — gere em https://aistudio.google.com/apikey
 */

import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { z } from 'zod';
import type { JobFilters } from '@/features/jobs/types';
import type { AiProfileExtraction } from '@/features/profile/types';

const apiKey = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export class AiNotConfiguredError extends Error {}

/**
 * Monta um GenerativeModel configurado pra structured output, com
 * temperature 0 (queremos extração determinística, não criatividade).
 * `systemInstruction` é o mecanismo de Engenharia de Prompt do próprio
 * SDK do Gemini — separado do conteúdo da mensagem do usuário, em vez de
 * só concatenar um texto de instrução na frente do prompt.
 */
function getConfiguredModel(responseSchema: Schema, systemInstruction?: string) {
  if (!genAI) {
    throw new AiNotConfiguredError(
      'GEMINI_API_KEY não configurada. Adicione a chave no .env.local para habilitar recursos de IA (veja .env.example).',
    );
  }

  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0,
    },
  });
}

// Schema de saída controlada (structured output): o Gemini é forçado a
// responder só com esses campos/enums — evita ter que extrair JSON de um
// texto livre na mão.
const jobFiltersResponseSchema: Schema = {
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
};

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
  const model = getConfiguredModel(jobFiltersResponseSchema);

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

// ============================================================
// Perfil do candidato a partir de texto livre (V2, Bloco 1)
// ============================================================

const profileResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    bio: {
      type: SchemaType.STRING,
      description:
        'Resumo profissional em português, 2 a 4 frases, tom neutro/objetivo, baseado só no que o texto original diz.',
    },
    skills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description:
        'Lista de tecnologias/skills técnicas mencionadas explicitamente (ex: ["React","Python","Docker"]).',
    },
    seniority: {
      type: SchemaType.STRING,
      enum: ['JUNIOR', 'PLENO', 'SENIOR', 'STAFF'],
      description:
        'Nível de senioridade inferido da experiência descrita (anos, complexidade, liderança). PLENO se não for possível inferir com confiança.',
    },
  },
  required: ['bio', 'skills', 'seniority'],
};

const profileExtractionSchema = z.object({
  bio: z.string().trim().min(1),
  skills: z.array(z.string().trim().min(1)).default([]),
  seniority: z.enum(['JUNIOR', 'PLENO', 'SENIOR', 'STAFF']),
});

// System Instruction (Engenharia de Prompt): fica separada do texto do
// candidato no próprio parâmetro do SDK, não concatenada no prompt — o
// modelo trata isso como a "regra do jogo", com prioridade mais alta do
// que o conteúdo do usuário.
const PROFILE_SYSTEM_INSTRUCTION = `Você é um extrator de perfil profissional para uma plataforma de vagas de tecnologia.

A partir do texto bruto que um candidato escreve sobre si mesmo (experiência, projetos, tecnologias, objetivos), extraia ESTRITAMENTE os campos definidos no schema de resposta:

- bio: reescreva como um resumo profissional curto (2 a 4 frases), tom neutro e objetivo. Não invente cargos, empresas ou anos de experiência que não estejam no texto.
- skills: liste só as tecnologias/skills técnicas citadas explicitamente. Não infira tecnologias "relacionadas" que o candidato não mencionou.
- seniority: infira JUNIOR, PLENO, SENIOR ou STAFF pela experiência descrita (anos, complexidade dos projetos, liderança de pessoas/times). Use PLENO como padrão neutro quando não houver sinal suficiente para inferir com confiança.

Nunca invente informação que não esteja implícita no texto do candidato. Se o texto for vago ou muito curto, prefira uma bio mais genérica em vez de preencher lacunas com suposições.`;

/**
 * Extrai { bio, skills, seniority } de um texto livre escrito pelo
 * candidato, usando System Instruction (não concatenação de prompt) +
 * structured output. Usado por POST /api/profile/ai-extract.
 */
export async function extractProfileFromText(rawText: string): Promise<AiProfileExtraction> {
  const model = getConfiguredModel(profileResponseSchema, PROFILE_SYSTEM_INSTRUCTION);

  const result = await model.generateContent(rawText.trim());
  const text = result.response.text();

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('O Gemini retornou uma resposta que não é um JSON válido.');
  }

  const parsed = profileExtractionSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('A resposta da IA não seguiu o formato esperado de perfil.');
  }

  return parsed.data;
}
