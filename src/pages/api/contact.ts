import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  // Validate required fields
  if (!name || !email || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  // 🔒 Step 1: Call Edge Function to validate submission
  const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/check-inquiry-blocked`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });

  const result = await res.json();

  if (!res.ok || result.allowed === false) {
    console.warn('Blocked form submission:', email);
    return new Response(null, {
      status: 302,
      headers: { Location: '/flagged/inquiry-blocked' },
    });
  }

  // Gmail SMTP config
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'varamstrength@gmail.com',
      pass: import.meta.env.EMAIL_APP_PASS, // set in your `.env`
    },
  });

  try {
    await transporter.sendMail({
      from: `"Varam Website" <varamstrength@gmail.com>`,
      to: 'varamstrength@gmail.com',
      subject: 'New Contact Message from Website',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return new Response(null, {
      status: 302,
      headers: { Location: '/messages/success-message' },
    });
  } catch (err) {
    console.error('Email send error:', err);
    return new Response('Email failed to send', { status: 500 });
  }
};
