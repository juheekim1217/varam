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
    return new Response('Booking failed', { status: 500 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/messages/success-booking' },
  });
};
