import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const POST: APIRoute = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:4321/my-classes', // or your live URL
    },
  });

  if (error || !data?.url) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/sign-in?error=${encodeURIComponent(error?.message ?? 'Login failed')}` },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: data.url },
  });
};
