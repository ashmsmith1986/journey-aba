'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Job = {
  id: string;
  title: string;
  employer: string;
  city: string | null;
  region: string | null;
  pay_range: string | null;
  job_type: string | null;
  remote: boolean | null;
  apply_url: string | null;
  description: string | null;
  posted_on: string | null;
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [region, setRegion] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      let q = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'published')
        .order('posted_on', { ascending: false });

      if (region) q = q.eq('region', region);
      const { data, error } = await q;
      if (error) { console.error(error); setJobs([]); return; }

      const filtered = (data || []).filter(j =>
        (j.title + ' ' + j.employer + ' ' + (j.city || '')).toLowerCase()
          .includes(query.toLowerCase())
      );
      setJobs(filtered);
    };
    load();
  }, [region, query]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Curated ABA Jobs (California)</h1>
        <p className="text-gray-600">Human-verified • Fresh listings • Candidate-first</p>
      </header>

      <div className="flex gap-3 items-center">
        <input
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Search title, employer, or city"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          className="border rounded-xl px-3 py-2"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">All regions</option>
          <option>South Bay</option>
          <option>Los Angeles</option>
          <option>Orange County</option>
          <option>San Diego</option>
          <option>Inland Empire</option>
        </select>
      </div>

      <ul className="grid md:grid-cols-2 gap-4">
        {jobs.map(job => (
          <li key={job.id} className="border rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <span className="text-xs px-2 py-1 border rounded-full">{job.job_type || '—'}</span>
            </div>
            <p className="text-sm text-gray-700">{job.employer}</p>
            <p className="text-sm text-gray-600">
              {job.city ? `${job.city} • ` : ''}{job.region || 'California'}{job.remote ? ' • Remote' : ''}
            </p>
            {job.pay_range && <p className="text-sm mt-1">Pay: {job.pay_range}</p>}
            {job.description && <p className="text-sm mt-2">{job.description}</p>}
            {job.apply_url && (
              <a className="inline-block mt-3 underline" href={job.apply_url} target="_blank" rel="noreferrer">
                Apply
              </a>
            )}
          </li>
        ))}
        {jobs.length === 0 && (
          <p className="text-gray-600">No jobs match yet. Try a different region or keyword.</p>
        )}
      </ul>
    </main>
  );
}
