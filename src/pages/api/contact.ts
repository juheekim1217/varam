import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  if (!name || !email || !message) {
    return new Response('Missing fields', { status: 400 });
  }

  // Gmail SMTP config
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'varamstrength@gmail.com',
      pass: import.meta.env.PUBLIC_EMAIL_APP_PASS, // set in your `.env`
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
      headers: { Location: '/success' },
    });
  } catch (err) {
    console.error('Email send error:', err);
    return new Response('Email failed to send', { status: 500 });
  }
};
