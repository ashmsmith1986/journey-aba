'use client';
export default function EnvCheck() {
  const url = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    <div style={{fontFamily:'sans-serif', padding:20}}>
      <h2>Env Check</h2>
      <p>URL: {url ? 'Loaded' : 'Missing'}</p>
      <p>ANON: {anon ? 'Loaded' : 'Missing'}</p>
    </div>
  );
}
