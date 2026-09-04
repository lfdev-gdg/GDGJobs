// app/page.tsx
/**
 * HOME PÚBLICA — GDG Jobs
 *
 * O visitante explora vagas SEM login.
 * Login aparece como consequência natural da jornada.
 *
 * Seções:
 * 1. Navbar
 * 2. Hero
 * 3. Encontre Oportunidades (busca + filtros)
 * 4. Lista de Vagas (6 cards)
 * 5. Diferencial do GDGJobs (3 pilares)
 * 6. Como Funciona (3 passos)
 * 7. Momento de Login (CTA)
 * 8. Footer
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

// ── DADOS FICTÍCIOS (seed) ──
const VAGAS_EXEMPLO = [
  {
    id: '1',
    title: 'Desenvolvedor Front-end React',
    company: 'TechLab',
    level: 'junior',
    techs: ['React', 'TypeScript', 'Next.js'],
    modality: 'Remote',
    location: 'Remoto',
    description:
      'Buscamos uma pessoa desenvolvedora para atuar na construção de produtos digitais modernos e escaláveis.',
    posted_at: '2026-08-28',
    is_curated: true,
  },
  {
    id: '2',
    title: 'Engenheiro de Software Pleno',
    company: 'NexGen Digital',
    level: 'mid',
    techs: ['Next.js', 'Node.js', 'PostgreSQL'],
    modality: 'Remote',
    location: 'Remoto',
    description:
      'Liderar squads em projetos de e-commerce. Desenvolver features end-to-end e fazer code review.',
    posted_at: '2026-08-27',
    is_curated: true,
  },
  {
    id: '3',
    title: 'Desenvolvedor Mobile Flutter',
    company: 'AppCriativa',
    level: 'junior',
    techs: ['Flutter', 'Dart', 'Firebase'],
    modality: 'On-site',
    location: 'Salvador, BA',
    description:
      'Venha construir apps incríveis com Flutter! Treinamento interno e certificações pagas.',
    posted_at: '2026-08-26',
    is_curated: true,
  },
  {
    id: '4',
    title: 'Engenheiro de ML Sênior',
    company: 'AI Factory',
    level: 'senior',
    techs: ['Python', 'PyTorch', 'GCP'],
    modality: 'Remote',
    location: 'Remoto',
    description: 'Lidere projetos de ML do zero à produção. NLP, visão computacional e MLOps.',
    posted_at: '2026-08-25',
    is_curated: true,
  },
  {
    id: '5',
    title: 'Product Designer Pleno',
    company: 'UXLab Studio',
    level: 'mid',
    techs: ['Figma', 'Design System', 'Prototipagem'],
    modality: 'Remote',
    location: 'Remoto',
    description:
      'Designer para produto SaaS B2B. Pesquisas com usuários, protótipos e design system.',
    posted_at: '2026-08-24',
    is_curated: true,
  },
  {
    id: '6',
    title: 'Staff Engineer (Platform)',
    company: 'MegaScale Systems',
    level: 'staff',
    techs: ['Go', 'Kubernetes', 'Terraform'],
    modality: 'Remote',
    location: 'Remoto',
    description:
      'Defina a visão técnica da plataforma de infraestrutura. Referência para 50+ engenheiros.',
    posted_at: '2026-08-23',
    is_curated: true,
  },
];

const TECH_FILTERS = ['React', 'Flutter', 'Python', 'Java', 'Node.js', 'Angular', 'Cloud'];
const LEVEL_FILTERS = [
  { value: 'junior', label: 'Júnior', emoji: '🌱' },
  { value: 'mid', label: 'Pleno', emoji: '🚀' },
  { value: 'senior', label: 'Sênior', emoji: '👑' },
];
const MODALITY_FILTERS = ['Remoto', 'Híbrido', 'Presencial'];

// ── HELPERS ──
const levelConfig: Record<string, { label: string; color: string }> = {
  junior: { label: 'Júnior', color: 'bg-emerald-100 text-emerald-800' },
  mid: { label: 'Pleno', color: 'bg-blue-100 text-blue-800' },
  senior: { label: 'Sênior', color: 'bg-violet-100 text-violet-800' },
  staff: { label: 'Staff', color: 'bg-amber-100 text-amber-800' },
};

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTech, setActiveTech] = useState<string>('');
  const [activeLevel, setActiveLevel] = useState<string>('');
  const [activeModality, setActiveModality] = useState<string>('');

  // Filtra vagas
  const filteredJobs = VAGAS_EXEMPLO.filter((job) => {
    if (activeTech && !job.techs.some((t) => t.toLowerCase().includes(activeTech.toLowerCase())))
      return false;
    if (activeLevel && job.level !== activeLevel) return false;
    if (activeModality && job.modality !== activeModality) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.techs.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTech('');
    setActiveLevel('');
    setActiveModality('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ════════════════════════════════════════════════════
          NAVBAR
         ════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">GDGJobs</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/jobs"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Vagas
            </Link>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Como funciona
            </a>
            <a
              href="#sobre"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sobre
            </a>
          </nav>

          <div className="hidden md:block">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Entrar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
            <Link
              href="/jobs"
              className="block text-sm font-medium text-slate-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vagas
            </Link>
            <a
              href="#como-funciona"
              className="block text-sm font-medium text-slate-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Como funciona
            </a>
            <a
              href="#sobre"
              className="block text-sm font-medium text-slate-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </a>
            <Link
              href="/login"
              className="block w-full text-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Entrar
            </Link>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════════════
          HERO
         ════════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-community.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.75)_55%,rgba(255,255,255,0.35)_100%)]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Sua próxima oportunidade em tecnologia pode estar aqui.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            O GDGJobs conecta talentos da comunidade a oportunidades tech, com vagas organizadas
            para você encontrar o que realmente combina com o seu momento profissional.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#vagas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explorar oportunidades
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#sobre"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Conhecer o GDGJobs
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ENCONTRE OPORTUNIDADES
         ════════════════════════════════════════════════════ */}
      <section id="vagas" className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Encontre oportunidades que fazem sentido para você
            </h2>
            <p className="mt-2 text-slate-500">
              Explore vagas de tecnologia organizadas por área, nível e modalidade
            </p>
          </div>

          {/* Busca */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por cargo, tecnologia ou empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-4 mb-8">
            {/* Tecnologias */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveTech('')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeTech === ''
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Todas
              </button>
              {TECH_FILTERS.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setActiveTech(activeTech === tech ? '' : tech)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeTech === tech
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>

            {/* Nível */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {LEVEL_FILTERS.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  onClick={() => setActiveLevel(activeLevel === value ? '' : value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeLevel === value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>

            {/* Modalidade */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {MODALITY_FILTERS.map((mod) => (
                <button
                  key={mod}
                  onClick={() => setActiveModality(activeModality === mod ? '' : mod)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeModality === mod
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>

            {/* Limpar filtros */}
            {(activeTech || activeLevel || activeModality || searchQuery) && (
              <div className="text-center">
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          {/* Lista de vagas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug">{job.title}</h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${levelConfig[job.level]?.color || 'bg-slate-100 text-slate-700'}`}
                  >
                    {levelConfig[job.level]?.label || job.level}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  {job.company}
                  <span className="text-slate-300">·</span>
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {job.techs.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(job.posted_at).toLocaleDateString('pt-BR')}
                  </div>
                  {job.is_curated && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Vaga curada
                    </span>
                  )}
                </div>

                <button
                  onClick={() => router.push('/login')}
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Ver oportunidade
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </article>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Nenhuma vaga encontrada com esses filtros.</p>
              <button onClick={clearFilters} className="mt-2 text-sm text-blue-600 font-medium">
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          DIFERENCIAL
         ════════════════════════════════════════════════════ */}
      <section id="sobre" className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Não somos apenas mais uma lista de vagas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">01 — Encontre</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Vagas organizadas para você encontrar oportunidades de tecnologia com mais clareza.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">02 — Conecte</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Oportunidades compartilhadas e curadas dentro da comunidade.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">03 — Evolua</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Quanto mais conhecemos você, melhor podemos conectar seu perfil a oportunidades
                relevantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          COMO FUNCIONA
         ════════════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Como funciona</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Explore',
                desc: 'Conheça oportunidades de tecnologia disponíveis.',
              },
              {
                step: '02',
                title: 'Encontre',
                desc: 'Use filtros para encontrar vagas alinhadas ao seu momento.',
              },
              {
                step: '03',
                title: 'Conecte-se',
                desc: 'Entre na plataforma para continuar sua jornada.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="text-3xl font-bold text-blue-600">{item.step}</span>
                <h3 className="text-lg font-semibold text-slate-900 mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          MOMENTO DE LOGIN
         ════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Encontrou uma oportunidade interessante?
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Agora queremos conhecer você também. Entre no GDGJobs para continuar sua jornada e, nas
            próximas versões, construir um perfil que ajude a encontrar oportunidades cada vez mais
            relevantes.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </Link>
          <p className="mt-3 text-xs text-slate-400">Login rápido e seguro com sua conta Google</p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-900">GDGJobs</span>
              </div>
              <p className="text-sm text-slate-500">
                Conectando talentos tech a oportunidades reais.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/jobs"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Vagas
              </Link>
              <a
                href="#como-funciona"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Como funciona
              </a>
              <a
                href="#sobre"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Sobre
              </a>
              <span className="text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                Privacidade
              </span>
              <span className="text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                Termos
              </span>
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Construído pela comunidade GDG Lauro de Freitas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
