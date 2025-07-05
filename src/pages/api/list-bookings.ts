// /src/pages/api/list-bookings.ts
// import type { APIRoute } from 'astro';
// import { createClient } from '@supabase/supabase-js';


// export const GET: APIRoute = async () => {
//   const { data, error } = await supabase.from('bookings').select('*').order('date');

//   return new Response(JSON.stringify({ data, error }), {
//     headers: { 'Content-Type': 'application/json' },
//   });
// };

import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabaseClient'; // Adjust the import path as necessary

export const prerender = false;


export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');
    //.order('date', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ classes: data }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
