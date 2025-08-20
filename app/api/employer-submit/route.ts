import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      title: String(body.title || ''),
      employer: String(body.employer || ''),
      city: body.city ? String(body.city) : null,
      region: body.region ? String(body.region) : null,
      pay_range: body.pay_range ? String(body.pay_range) : null,
      job_type: body.job_type ? String(body.job_type) : null,
      remote: body.remote === true || body.remote === 'on' || body.remote === 'true',
      apply_url: body.apply_url ? String(body.apply_url) : null,
      description: body.description ? String(body.description) : null,
      status: 'draft' as const
    };

    if (!payload.title || !payload.employer) {
      return NextResponse.json({ error: 'Missing title or employer' }, { status: 400 });
    }

    const supabase = supabaseAdmin();
    const { error } = await supabase.from('jobs').insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
