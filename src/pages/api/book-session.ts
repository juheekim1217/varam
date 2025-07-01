// src/pages/api/book-session.ts
import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const date = formData.get('date');
  const time = formData.get('time');

  const { error } = await supabase.from('bookings').insert([{ name, email, date, time }]);

  if (error) {
    return new Response('Booking failed', { status: 500 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/book/success' },
  });
};
