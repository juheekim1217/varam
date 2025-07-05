import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabaseClient'; // Adjust the import path as necessary

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // Store session client-side (localStorage) or set cookie server-side if you implement it
  return redirect('/account/dashboard');
};
