'use client';
import { useState } from 'react';

type JobPayload = {
  title: string;
  employer: string;
  city?: string;
  region?: string;
  job_type?: string;
  pay_range?: string;
  remote?: boolean;
  apply_url?: string;
  description?: string;
};

export default function Employers() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const entries = Object.fromEntries(form.entries());

    const payload: JobPayload = {
      title: String(entries.title || ''),
      employer: String(entries.employer || ''),
      city: entries.city ? String(entries.city) : undefined,
      region: entries.region ? String(entries.region) : undefined,
      job_type: entries.job_type ? String(entries.job_type) : undefined,
      pay_range: entries.pay_range ? String(entries.pay_range) : undefined,
      apply_url: entries.apply_url ? String(entries.apply_url) : undefined,
      description: entries.description ? String(entries.description) : undefined,
      remote: !!formEl.querySelector<HTMLInputElement>('input[name="remote"]')?.checked,
    };

    try {
      const res = await fetch('/api/employer-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submit failed');
      setMsg('Thanks! Your role was received as a draft.');
      formEl.reset();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
        <h1 className="text-3xl font-bold">Post a Role</h1>
        <p className="text-gray-600">Submit your job. We’ll verify and publish within 24 hours.</p>
      </section>

      {msg && <div className="p-3 border rounded-xl bg-green-50 text-green-700">{msg}</div>}
      {err && <div className="p-3 border rounded-xl bg-red-50 text-red-700">{err}</div>}

      <form onSubmit={submit} className="border bg-white rounded-2xl p-6 shadow-sm grid gap-3">
        <input name="title" placeholder="Job title (e.g., BCBA Program Supervisor)" className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
        <input name="employer" placeholder="Employer (e.g., Coyne & Associates)" className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="city" placeholder="City" className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="region" placeholder="Region (e.g., Los Angeles, South Bay)" className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="job_type" placeholder="Job type (Part-time, FT…)" className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="pay_range" placeholder="Pay range (e.g., $55–$70/hr)" className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input name="remote" type="checkbox" className="rounded" /> Remote / Hybrid
        </label>
        <input name="apply_url" placeholder="Apply URL (must start with https://)" className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        <textarea name="description" placeholder="Short description / how to apply" className="border rounded-xl px-3 py-2 h-28 focus:ring-2 focus:ring-indigo-500 outline-none" />
        <button disabled={loading} className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60">
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
