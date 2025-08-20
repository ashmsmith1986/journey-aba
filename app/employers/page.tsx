'use client';
import { useState } from 'react';

export default function Employers() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMsg(null); setErr(null);

    // Capture the form element BEFORE any await, so it doesn't go null
    const formEl = e.currentTarget as HTMLFormElement;
    const form = new FormData(formEl);
    const payload: any = Object.fromEntries(form.entries());

    // Make remote a true/false
    const remoteInput = formEl.querySelector<HTMLInputElement>('input[name="remote"]');
    payload.remote = !!remoteInput?.checked;

    try {
      const res = await fetch('/api/employer-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submit failed');

      setMsg('Thanks! Your role was received as a draft.');
      formEl.reset(); // safe now
    } catch (e: any) {
      setErr(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Post a Role</h1>
      <p className="text-gray-600">Submit your job. We’ll verify and publish within 24 hours.</p>

      {msg && <div className="p-3 border rounded-xl text-green-700">{msg}</div>}
      {err && <div className="p-3 border rounded-xl text-red-700">{err}</div>}

      <form onSubmit={submit} className="grid gap-3">
        <input name="title" placeholder="Job title (e.g., BCBA Program Supervisor)" className="border rounded-xl px-3 py-2" required />
        <input name="employer" placeholder="Employer (e.g., Coyne & Associates)" className="border rounded-xl px-3 py-2" required />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" placeholder="City" className="border rounded-xl px-3 py-2" />
          <input name="region" placeholder="Region (e.g., Los Angeles, South Bay)" className="border rounded-xl px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="job_type" placeholder="Job type (Part-time, FT…)" className="border rounded-xl px-3 py-2" />
          <input name="pay_range" placeholder="Pay range (e.g., $55–$70/hr)" className="border rounded-xl px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input name="remote" type="checkbox" /> Remote / Hybrid
        </label>
        <input name="apply_url" placeholder="Apply URL (must start with https://)" className="border rounded-xl px-3 py-2" />
        <textarea name="description" placeholder="Short description / how to apply" className="border rounded-xl px-3 py-2 h-28" />
        <button disabled={loading} className="rounded-2xl px-4 py-2 border shadow-sm">
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </main>
  );
}
