'use client';

import { useState, useEffect } from 'react';
import { Job, JobFilters } from '../types';

export function useJobs(initialFilters?: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>(initialFilters || {});

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.modality && filters.modality !== 'ALL')
          params.set('modality', filters.modality);
        if (filters.seniority && filters.seniority !== 'ALL')
          params.set('seniority', filters.seniority);
        if (filters.tech) params.set('tech', filters.tech);

        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Falha ao atualizar lista de vagas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [filters]);

  return { jobs, loading, filters, setFilters };
}
