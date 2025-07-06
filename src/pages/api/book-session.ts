// src/pages/api/book-session.ts
import type { APIRoute } from 'astro';
import { supabase } from '~/lib/supabaseClient';
import { Resend } from 'resend';

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

  // ✉️ Email content
  const subject = `✅ Varam Strength Session Booked - ${date} at ${time}`;
  const message = `
    <p>Hi ${name},</p>
    <p>Your training session has been confirmed:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
    </ul>
    <p>We look forward to training with you!</p>
    <p>– Varam Strength</p>
  `;
  const from = `Varam Strength <${import.meta.env.ADMIN_EMAIL as string}>`;

  try {
    const resend = new Resend(import.meta.env.RESEND_API_KEY as string);
    console.log('Sending email to:', email);
    console.log('RESEND_API_KEY:', import.meta.env.RESEND_API_KEY as string);
    // Send to user
    await resend.emails.send({
      from: from,
      to: [email as string],
      subject,
      html: message,
    });

    // Send to admin
    await resend.emails.send({
      from: from,
      to: [import.meta.env.ADMIN_EMAIL as string], // change to your admin email
      subject: `📥 New Booking from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
      `,
    });
  } catch (e) {
    console.error('Failed to send email:', e);
    // Don’t block user booking if email fails
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/messages/success-booking' },
  });
};
