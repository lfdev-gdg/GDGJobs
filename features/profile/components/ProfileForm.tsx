'use client';

import { Github, Globe, Linkedin, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/toaster';
import type { Profile, SeniorityLevel } from '../types';

interface ProfileFormProps {
  initialProfile: Profile | null;
}

const SENIORITY_OPTIONS: { value: SeniorityLevel; label: string }[] = [
  { value: 'JUNIOR', label: 'Júnior' },
  { value: 'PLENO', label: 'Pleno' },
  { value: 'SENIOR', label: 'Sênior' },
  { value: 'STAFF', label: 'Staff' },
];

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { showToast } = useToast();

  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [githubUrl, setGithubUrl] = useState(initialProfile?.github_url ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialProfile?.linkedin_url ?? '');
  const [portfolioUrl, setPortfolioUrl] = useState(initialProfile?.portfolio_url ?? '');
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills ?? []);
  const [skillInput, setSkillInput] = useState('');
  const [seniority, setSeniority] = useState<SeniorityLevel | ''>(initialProfile?.seniority ?? '');

  const addSkill = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setSkills((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setSkillInput('');
  };

  const removeSkill = (value: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== value));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleAiExtract = async () => {
    if (!rawText.trim() || isExtracting) return;

    setIsExtracting(true);
    try {
      const response = await fetch('/api/profile/ai-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      const body = await response.json();

      if (!response.ok) {
        showToast(body.error ?? 'Não foi possível extrair o perfil.', 'error');
        return;
      }

      // Pré-preenche — o candidato ainda revisa/edita antes de salvar.
      setBio(body.bio ?? '');
      setSkills(Array.isArray(body.skills) ? body.skills : []);
      if (body.seniority) setSeniority(body.seniority);
      showToast('Perfil extraído! Revise os campos antes de salvar.', 'success');
    } catch {
      showToast('Erro de conexão ao extrair o perfil. Tente novamente.', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          portfolio_url: portfolioUrl,
          skills,
          seniority: seniority || null,
        }),
      });
      const body = await response.json();

      if (!response.ok) {
        showToast(body.error ?? 'Não foi possível salvar o perfil.', 'error');
        return;
      }

      showToast('Perfil salvo com sucesso!', 'success');
    } catch {
      showToast('Erro de conexão ao salvar o perfil. Tente novamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Extração por IA — texto livre vira bio/skills/seniority pré-preenchidos */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-purple-900 mb-2">
          <Sparkles className="w-4 h-4" />
          Preencher com IA
        </label>
        <p className="text-xs text-purple-700 mb-2">
          Escreva livremente sobre sua experiência, projetos e tecnologias — a IA sugere bio,
          skills e senioridade pra você revisar.
        </p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={4}
          placeholder="Ex: Sou desenvolvedor há 3 anos, trabalho com React e Node no dia a dia, já liderei uma migração de um monolito pra microsserviços..."
          className="w-full text-sm border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        />
        <button
          type="button"
          onClick={handleAiExtract}
          disabled={isExtracting || !rawText.trim()}
          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {isExtracting ? 'Extraindo...' : 'Extrair com IA'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Um resumo profissional curto sobre você."
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
              <Github className="w-3.5 h-3.5" /> GitHub
            </label>
            <input
              type="url"
              value={githubUrl ?? ''}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/seu-usuario"
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </label>
            <input
              type="url"
              value={linkedinUrl ?? ''}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/seu-usuario"
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
              <Globe className="w-3.5 h-3.5" /> Portfólio
            </label>
            <input
              type="url"
              value={portfolioUrl ?? ''}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://seusite.com"
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Skills (Enter ou vírgula para adicionar)
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remover ${skill}`}
                  className="hover:text-blue-950"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            onBlur={() => addSkill(skillInput)}
            placeholder="Ex: React, TypeScript, PostgreSQL..."
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Senioridade</label>
          <select
            value={seniority}
            onChange={(e) => setSeniority(e.target.value as SeniorityLevel | '')}
            className="w-full sm:w-64 text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Não informado</option>
            {SENIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </div>
      </form>
    </div>
  );
}
