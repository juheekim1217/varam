import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
);

export const GET: APIRoute = async ({ url }) => {
  const email = url.searchParams.get('email');
  if (!email) {
    return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('email', email)
    .order('date', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ classes: data }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
