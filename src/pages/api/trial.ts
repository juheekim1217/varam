import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const firstName = data.get('firstName');
  const lastName = data.get('lastName');
  const email = data.get('email');
  const phone = data.get('phone');
  const message = data.get('message');

  if (!firstName || !lastName || !email || !phone || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  // 🔒 Step 1: Call Edge Function to validate submission
  const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/check-inquiry-blocked`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, phone, message }),
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
  const adminEmail = import.meta.env.ADMIN_EMAIL;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: import.meta.env.ADMIN_EMAIL_APP_PASS, // set in your `.env`
    },
  });
  console.log('transporter created');
  try {
    await transporter.sendMail({
      from: `"Varam Strength" <${adminEmail}>`,
      to: adminEmail,
      subject: 'New Trial Request from Website',
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    });
    console.log('Email sent await');
    return new Response(null, {
      status: 302,
      headers: { Location: '/messages/success-message' },
    });
  } catch (err) {
    console.error('Email send error:', err);
    return new Response('Email failed to send', { status: 500 });
  }
};
