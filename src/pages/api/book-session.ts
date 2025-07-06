// src/pages/api/book-session.ts
import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabaseClient';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const date = formData.get('date');
  const time = formData.get('time');

  const { error } = await supabase.from('bookings').insert([{ name, email, date, time }]);

  if (error) {
    console.error('book-session.ts - Supabase insert error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/messages/success-booking' },
  });
};
